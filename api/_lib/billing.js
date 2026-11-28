const crypto = require('crypto');
const { supabaseRest } = require('./supabase');

function positiveInt(rawValue, fallback) {
  const n = Number(rawValue);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

function formatIdr(amount) {
  const rounded = Math.max(0, Math.round(Number(amount) || 0));
  return `Rp ${String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function readBillingConfig(env = process.env) {
  const lsApiKey = String(env.LEMONSQUEEZY_API_KEY || '').trim();
  const lsStoreId = String(env.LEMONSQUEEZY_STORE_ID || '').trim();
  const lsVariantMonthly = String(env.LEMONSQUEEZY_VARIANT_MONTHLY || '').trim();
  const lsVariantAnnual = String(env.LEMONSQUEEZY_VARIANT_ANNUAL || '').trim();
  const lsWebhookSecret = String(env.LEMONSQUEEZY_WEBHOOK_SECRET || '').trim();

  const midtransServerKey = String(env.MIDTRANS_SERVER_KEY || '').trim();
  const midtransIsProduction = String(env.MIDTRANS_IS_PRODUCTION || 'false').trim().toLowerCase() === 'true';

  const usdMonthly = positiveInt(env.BILLING_USD_MONTHLY, 5);
  const usdAnnual = positiveInt(env.BILLING_USD_ANNUAL, 39);
  const idrMonthly = positiveInt(env.BILLING_IDR_MONTHLY, 15000);
  const idrAnnual = positiveInt(env.BILLING_IDR_ANNUAL, 150000);

  const usdSavePct = Math.max(0, Math.round((1 - usdAnnual / (usdMonthly * 12)) * 100));
  const idrSavePct = Math.max(0, Math.round((1 - idrAnnual / (idrMonthly * 12)) * 100));

  const lemonSqueezyEnabled = Boolean(lsApiKey && lsStoreId && (lsVariantMonthly || lsVariantAnnual));
  const midtransEnabled = Boolean(midtransServerKey);

  return {
    lemonSqueezy: {
      apiKey: lsApiKey,
      storeId: lsStoreId,
      variantMonthly: lsVariantMonthly,
      variantAnnual: lsVariantAnnual,
      webhookSecret: lsWebhookSecret
    },
    midtrans: {
      serverKey: midtransServerKey,
      isProduction: midtransIsProduction,
      snapBaseUrl: midtransIsProduction ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com'
    },
    lemonSqueezyEnabled,
    midtransEnabled,
    midtransSandbox: !midtransIsProduction,
    pricing: {
      usd: {
        monthly: usdMonthly,
        annual: usdAnnual,
        monthlyLabel: `$${usdMonthly}`,
        annualLabel: `$${usdAnnual}`,
        annualSavePct: usdSavePct
      },
      idr: {
        monthly: idrMonthly,
        annual: idrAnnual,
        monthlyLabel: formatIdr(idrMonthly),
        annualLabel: formatIdr(idrAnnual),
        annualSavePct: idrSavePct
      }
    }
  };
}

function getPublicBillingConfig(env = process.env) {
  const cfg = readBillingConfig(env);
  return {
    lemonSqueezyEnabled: cfg.lemonSqueezyEnabled,
    midtransEnabled: cfg.midtransEnabled,
    midtransSandbox: cfg.midtransSandbox,
    pricing: cfg.pricing
  };
}

function resolveAppOrigin(req, env = process.env) {
  const explicit = String(env.APP_URL || '').trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  const origin = String(req.headers?.origin || '').trim().replace(/\/+$/, '');
  if (origin && /^https?:\/\//i.test(origin)) return origin;
  const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').trim();
  if (host) {
    const proto = String(req.headers?.['x-forwarded-proto'] || '').trim() || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
    return `${proto}://${host}`.replace(/\/+$/, '');
  }
  return 'https://pomonow.vercel.app';
}

function safeEqualHex(aHex, bHex) {
  const a = Buffer.from(String(aHex || '').trim().toLowerCase(), 'utf8');
  const b = Buffer.from(String(bHex || '').trim().toLowerCase(), 'utf8');
  if (!a.length || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function verifyLemonSqueezySignature(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader) return false;
  const digest = crypto
    .createHmac('sha256', String(secret))
    .update(String(rawBody || ''), 'utf8')
    .digest('hex');
  return safeEqualHex(digest, signatureHeader);
}

function verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key }, serverKey) {
  if (!serverKey || !order_id || !status_code || gross_amount === undefined || !signature_key) {
    return false;
  }
  const payload = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const digest = crypto.createHash('sha512').update(payload, 'utf8').digest('hex');
  return safeEqualHex(digest, signature_key);
}

function computeExtendedPeriodEnd(existingIso, daysToAdd, nowMs = Date.now()) {
  const parsed = existingIso ? Date.parse(existingIso) : NaN;
  const baseMs = Number.isFinite(parsed) && parsed > nowMs ? parsed : nowMs;
  return new Date(baseMs + (Number(daysToAdd) || 0) * 86400000).toISOString();
}

async function updateProfileBilling(userId, patchObj, env, fetchImpl = fetch) {
  const encodedId = encodeURIComponent(userId);
  const res = await supabaseRest(
    `profiles?id=eq.${encodedId}&select=id,plan,plan_status,billing_provider,current_period_end,customer_portal_url`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: patchObj
    },
    env,
    null,
    fetchImpl
  );

  if (!res.ok && Object.prototype.hasOwnProperty.call(patchObj, 'customer_portal_url')) {
    const msg = String(res.data?.message || res.data?.details || '');
    if (res.status === 400 || msg.includes('customer_portal_url')) {
      const { customer_portal_url: _omit, ...fallbackPatch } = patchObj;
      return supabaseRest(
        `profiles?id=eq.${encodedId}&select=id,plan,plan_status,billing_provider,current_period_end`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: fallbackPatch
        },
        env,
        null,
        fetchImpl
      );
    }
  }
  return res;
}

module.exports = {
  readBillingConfig,
  getPublicBillingConfig,
  resolveAppOrigin,
  verifyLemonSqueezySignature,
  verifyMidtransSignature,
  computeExtendedPeriodEnd,
  updateProfileBilling
};
