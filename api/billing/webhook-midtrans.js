const {
  readEnvConfig,
  sendJson,
  parseJsonBody,
  supabaseRest
} = require('../_lib/supabase');
const {
  readBillingConfig,
  verifyMidtransSignature,
  computeExtendedPeriodEnd,
  updateProfileBilling
} = require('../_lib/billing');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const env = readEnvConfig();
  const billing = readBillingConfig();
  if (!env.configured || !env.serviceRoleKey || !billing.midtrans.serverKey) {
    return sendJson(res, 503, { error: 'Midtrans webhook is not configured.' });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    return sendJson(res, err.statusCode || 400, { error: err.message || 'Invalid JSON body' });
  }

  if (!verifyMidtransSignature(body, billing.midtrans.serverKey)) {
    return sendJson(res, 401, { error: 'Invalid Midtrans signature_key' });
  }

  const orderId = String(body.order_id || '').trim();
  const encodedOrderId = encodeURIComponent(orderId);

  let existingOrder = null;
  try {
    const orderRes = await supabaseRest(
      `payment_orders?order_id=eq.${encodedOrderId}&select=order_id,user_id,plan_interval,status,period_extended_until`,
      { method: 'GET' },
      env,
      null
    );
    if (orderRes.ok && Array.isArray(orderRes.data) && orderRes.data[0]) {
      existingOrder = orderRes.data[0];
    }
  } catch {
    existingOrder = null;
  }

  if (existingOrder?.status === 'paid') {
    return sendJson(res, 200, { ok: true, duplicate: true, orderId });
  }

  const userId = String(existingOrder?.user_id || body.custom_field1 || '').trim();
  if (!userId) {
    return sendJson(res, 200, { ok: true, ignored: 'missing_user_id', orderId });
  }

  const rawInterval = existingOrder?.plan_interval || body.custom_field2 || (orderId.startsWith('PMN-YR-') ? 'annual' : 'monthly');
  const interval = rawInterval === 'annual' ? 'annual' : 'monthly';
  const txStatus = String(body.transaction_status || '').toLowerCase();
  const fraudStatus = String(body.fraud_status || '').toLowerCase();

  const isPaid = txStatus === 'settlement' || (txStatus === 'capture' && (!fraudStatus || fraudStatus === 'accept'));
  if (isPaid) {
    const profRes = await supabaseRest(
      `profiles?id=eq.${encodeURIComponent(userId)}&select=id,current_period_end`,
      { method: 'GET' },
      env,
      null
    );
    if (!profRes.ok) {
      return sendJson(res, 500, { error: profRes.data?.message || 'Failed to load user profile' });
    }
    const existingProfile = Array.isArray(profRes.data) ? profRes.data[0] : null;
    const daysToAdd = interval === 'annual' ? 365 : 30;
    const nextPeriodEnd = computeExtendedPeriodEnd(existingProfile?.current_period_end, daysToAdd);

    await supabaseRest(
      'payment_orders?on_conflict=order_id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: {
          order_id: orderId,
          user_id: userId,
          provider: 'midtrans',
          plan_interval: interval,
          currency: 'IDR',
          amount: Number(body.gross_amount) || 0,
          status: 'paid',
          provider_transaction_id: body.transaction_id ? String(body.transaction_id) : null,
          period_extended_until: nextPeriodEnd,
          raw_event: body
        }
      },
      env,
      null
    );

    const updateRes = await updateProfileBilling(
      userId,
      {
        plan: 'pro',
        plan_status: 'active',
        billing_provider: 'midtrans',
        provider_subscription_id: orderId,
        current_period_end: nextPeriodEnd
      },
      env
    );
    if (!updateRes.ok) {
      return sendJson(res, 500, { error: updateRes.data?.message || 'Failed to update profile billing' });
    }

    return sendJson(res, 200, {
      ok: true,
      status: 'paid',
      orderId,
      currentPeriodEnd: nextPeriodEnd
    });
  }

  if (['expire', 'cancel', 'deny', 'failure'].includes(txStatus)) {
    const mappedStatus = txStatus === 'expire' ? 'expired' : (txStatus === 'cancel' ? 'canceled' : 'failed');
    await supabaseRest(
      'payment_orders?on_conflict=order_id',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates' },
        body: {
          order_id: orderId,
          user_id: userId,
          provider: 'midtrans',
          plan_interval: interval,
          currency: 'IDR',
          amount: Number(body.gross_amount) || 0,
          status: mappedStatus,
          provider_transaction_id: body.transaction_id ? String(body.transaction_id) : null,
          raw_event: body
        }
      },
      env,
      null
    );
    return sendJson(res, 200, { ok: true, status: mappedStatus, orderId });
  }

  return sendJson(res, 200, { ok: true, status: txStatus || 'pending', orderId });
};
