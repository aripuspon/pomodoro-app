const {
  readEnvConfig,
  sendJson,
  readRawBody,
  supabaseRest
} = require('../_lib/supabase');
const {
  readBillingConfig,
  verifyLemonSqueezySignature,
  updateProfileBilling
} = require('../_lib/billing');

function mapLemonSqueezySubscription(eventName, attrs, subId) {
  const status = String(attrs?.status || '').toLowerCase();
  const periodEnd = attrs?.renews_at || attrs?.ends_at || attrs?.trial_ends_at || null;
  const portalUrl = attrs?.urls?.customer_portal || null;
  const customerId = attrs?.customer_id !== undefined && attrs?.customer_id !== null
    ? String(attrs.customer_id)
    : null;

  const base = {
    billing_provider: 'lemon_squeezy',
    ...(customerId ? { provider_customer_id: customerId } : {}),
    ...(subId ? { provider_subscription_id: subId } : {}),
    ...(portalUrl ? { customer_portal_url: portalUrl } : {}),
    ...(periodEnd ? { current_period_end: periodEnd } : {})
  };

  if (eventName === 'subscription_expired' || status === 'expired') {
    return {
      ...base,
      plan: 'free',
      plan_status: 'inactive'
    };
  }

  if (eventName === 'subscription_cancelled' || status === 'cancelled') {
    return {
      ...base,
      plan: 'pro',
      plan_status: 'canceled'
    };
  }

  if (status === 'on_trial') {
    return {
      ...base,
      plan: 'pro',
      plan_status: 'trialing'
    };
  }

  if (status === 'past_due' || status === 'unpaid') {
    return {
      ...base,
      plan: 'pro',
      plan_status: 'past_due'
    };
  }

  // subscription_created / subscription_updated / subscription_resumed / subscription_payment_success (active)
  return {
    ...base,
    plan: 'pro',
    plan_status: 'active'
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const env = readEnvConfig();
  const billing = readBillingConfig();
  if (!env.configured || !env.serviceRoleKey || !billing.lemonSqueezy.webhookSecret) {
    return sendJson(res, 503, { error: 'Lemon Squeezy webhook is not configured.' });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    return sendJson(res, err.statusCode || 400, { error: err.message || 'Invalid webhook payload' });
  }

  const signature = req.headers?.['x-signature'] || req.headers?.['X-Signature'] || '';
  if (!verifyLemonSqueezySignature(rawBody, signature, billing.lemonSqueezy.webhookSecret)) {
    return sendJson(res, 401, { error: 'Invalid webhook signature' });
  }

  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON payload' });
  }

  const eventName = String(payload?.meta?.event_name || '');
  const customData = payload?.meta?.custom_data || {};
  const userId = customData.user_id ? String(customData.user_id).trim() : '';
  if (!userId) {
    return sendJson(res, 200, { ok: true, ignored: 'missing_user_id', event: eventName });
  }

  const attrs = payload?.data?.attributes || {};
  const subId = payload?.data?.id !== undefined && payload?.data?.id !== null ? String(payload.data.id) : '';
  const relevantEvents = new Set([
    'subscription_created',
    'subscription_updated',
    'subscription_resumed',
    'subscription_cancelled',
    'subscription_expired',
    'subscription_payment_success'
  ]);

  if (!relevantEvents.has(eventName)) {
    return sendJson(res, 200, { ok: true, ignored: 'unhandled_event', event: eventName });
  }

  const patch = mapLemonSqueezySubscription(eventName, attrs, subId);
  const updateRes = await updateProfileBilling(userId, patch, env);
  if (!updateRes.ok) {
    return sendJson(res, 500, { error: updateRes.data?.message || 'Failed to update subscription profile' });
  }

  if (eventName === 'subscription_payment_success') {
    const interval = customData.plan_interval === 'annual' ? 'annual' : 'monthly';
    const orderId = `LS-${subId || 'SUB'}-${attrs.order_id || Date.now()}`;
    try {
      await supabaseRest(
        'payment_orders?on_conflict=order_id',
        {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: {
            order_id: orderId,
            user_id: userId,
            provider: 'lemon_squeezy',
            plan_interval: interval,
            currency: String(attrs.currency || 'USD').toUpperCase(),
            amount: Number(attrs.total_usd || attrs.subtotal_usd || attrs.total || 0) / 100 || 0,
            status: 'paid',
            provider_transaction_id: attrs.order_id ? String(attrs.order_id) : subId || null,
            period_extended_until: patch.current_period_end || null,
            raw_event: payload
          }
        },
        env,
        null
      );
    } catch {
      // Non-fatal audit insert
    }
  }

  return sendJson(res, 200, { ok: true, event: eventName });
};
