const {
  readEnvConfig,
  sendJson,
  getBearerToken,
  parseJsonBody,
  verifyAccessToken,
  supabaseRest
} = require('../_lib/supabase');
const { readBillingConfig, resolveAppOrigin } = require('../_lib/billing');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const env = readEnvConfig();
  if (!env.configured) {
    return sendJson(res, 503, { error: 'Cloud backend is not configured yet.' });
  }

  const accessToken = getBearerToken(req);
  const auth = await verifyAccessToken(accessToken, env);
  if (auth.error) {
    return sendJson(res, auth.status, { error: auth.error });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    return sendJson(res, err.statusCode || 400, { error: err.message || 'Invalid JSON body' });
  }

  const provider = String(body?.provider || '').trim();
  const interval = String(body?.interval || '').trim();
  if (!['lemon_squeezy', 'midtrans'].includes(provider)) {
    return sendJson(res, 400, { error: 'Invalid billing provider. Use "lemon_squeezy" or "midtrans".' });
  }
  if (!['monthly', 'annual'].includes(interval)) {
    return sendJson(res, 400, { error: 'Invalid billing interval. Use "monthly" or "annual".' });
  }

  const billing = readBillingConfig();
  const origin = resolveAppOrigin(req);

  if (provider === 'lemon_squeezy') {
    const variantId = interval === 'annual' ? billing.lemonSqueezy.variantAnnual : billing.lemonSqueezy.variantMonthly;
    if (!billing.lemonSqueezyEnabled || !variantId) {
      return sendJson(res, 503, { error: 'Lemon Squeezy checkout is not configured yet.' });
    }

    try {
      const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${billing.lemonSqueezy.apiKey}`,
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: auth.user.email || undefined,
                custom: {
                  user_id: auth.user.id,
                  plan_interval: interval
                }
              },
              product_options: {
                redirect_url: `${origin}/?billing=success&provider=lemon_squeezy`
              }
            },
            relationships: {
              store: {
                data: { type: 'stores', id: String(billing.lemonSqueezy.storeId) }
              },
              variant: {
                data: { type: 'variants', id: String(variantId) }
              }
            }
          }
        })
      });

      const lsData = await lsRes.json().catch(() => ({}));
      const checkoutUrl = lsData?.data?.attributes?.url;
      if (!lsRes.ok || !checkoutUrl) {
        const errMsg = lsData?.errors?.[0]?.detail || lsData?.message || 'Unable to create Lemon Squeezy checkout session.';
        return sendJson(res, 502, { error: errMsg });
      }

      return sendJson(res, 200, {
        provider: 'lemon_squeezy',
        interval,
        checkoutUrl
      });
    } catch (err) {
      return sendJson(res, 502, { error: err?.message || 'Failed to contact Lemon Squeezy.' });
    }
  }

  // Midtrans Snap (IDR)
  if (!billing.midtransEnabled) {
    return sendJson(res, 503, { error: 'Midtrans checkout is not configured yet.' });
  }

  const amount = interval === 'annual' ? billing.pricing.idr.annual : billing.pricing.idr.monthly;
  const shortUid = String(auth.user.id).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'USER';
  const orderId = `PMN-${interval === 'annual' ? 'YR' : 'MO'}-${shortUid}-${Date.now().toString(36).toUpperCase()}`.slice(0, 50);

  if (env.serviceRoleKey) {
    try {
      await supabaseRest(
        'payment_orders?on_conflict=order_id',
        {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: {
            order_id: orderId,
            user_id: auth.user.id,
            provider: 'midtrans',
            plan_interval: interval,
            currency: 'IDR',
            amount,
            status: 'pending'
          }
        },
        env,
        null
      );
    } catch {
      // Non-fatal if payment_orders table hasn't been migrated yet
    }
  }

  try {
    const basicToken = Buffer.from(`${billing.midtrans.serverKey}:`).toString('base64');
    const snapRes = await fetch(`${billing.midtrans.snapBaseUrl}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        item_details: [
          {
            id: `pomonow-pro-${interval}`,
            price: amount,
            quantity: 1,
            name: interval === 'annual' ? 'PomoNow Pro (1 Year Pass)' : 'PomoNow Pro (1 Month Pass)'
          }
        ],
        customer_details: {
          email: auth.user.email || undefined,
          first_name: auth.user.user_metadata?.full_name || auth.user.user_metadata?.name || undefined
        },
        custom_field1: auth.user.id,
        custom_field2: interval,
        callbacks: {
          finish: `${origin}/?billing=success&provider=midtrans`
        }
      })
    });

    const snapData = await snapRes.json().catch(() => ({}));
    if (!snapRes.ok || !snapData?.redirect_url) {
      const errMsg = snapData?.error_messages?.[0] || snapData?.message || 'Unable to create Midtrans Snap transaction.';
      return sendJson(res, 502, { error: errMsg });
    }

    return sendJson(res, 200, {
      provider: 'midtrans',
      interval,
      orderId,
      snapToken: snapData.token || null,
      checkoutUrl: snapData.redirect_url
    });
  } catch (err) {
    return sendJson(res, 502, { error: err?.message || 'Failed to contact Midtrans.' });
  }
};
