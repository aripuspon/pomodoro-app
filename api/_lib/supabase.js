const MAX_JSON_BODY_BYTES = 2 * 1024 * 1024;

function readEnvConfig(env = process.env) {
  const supabaseUrl = String(env.SUPABASE_URL || '')
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
  const supabaseAnonKey = String(env.SUPABASE_ANON_KEY || '').trim();
  const serviceRoleKey = String(env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const googleClientId = String(env.GOOGLE_CLIENT_ID || '').trim();
  const softBetaMode = String(env.SOFT_BETA_MODE || 'true').trim().toLowerCase() !== 'false';
  return {
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    googleClientId,
    softBetaMode,
    configured: Boolean(supabaseUrl && supabaseAnonKey)
  };
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(data));
}

function getBearerToken(req) {
  const rawHeader = req.headers?.authorization || req.headers?.Authorization || '';
  const match = String(rawHeader).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

async function parseJsonBody(req, maxBytes = MAX_JSON_BODY_BYTES) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      if (Buffer.byteLength(req.body, 'utf8') > maxBytes) {
        const err = new Error('Payload too large');
        err.statusCode = 413;
        throw err;
      }
      return req.body ? JSON.parse(req.body) : {};
    }
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        const err = new Error('Payload too large');
        err.statusCode = 413;
        reject(err);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        const err = new Error('Invalid JSON body');
        err.statusCode = 400;
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function verifyAccessToken(accessToken, env, fetchImpl = fetch) {
  if (!accessToken) {
    return { error: 'Missing Authorization Bearer token', status: 401, user: null };
  }
  const res = await fetchImpl(`${env.supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!res.ok) {
    return { error: 'Invalid or expired session token', status: 401, user: null };
  }
  const user = await res.json();
  if (!user || !user.id) {
    return { error: 'Authenticated user payload invalid', status: 401, user: null };
  }
  return { error: null, status: 200, user };
}

async function supabaseRest(path, options = {}, env, userToken, fetchImpl = fetch) {
  const isOpaqueSecretKey = Boolean(env.serviceRoleKey && env.serviceRoleKey.startsWith('sb_secret_'));
  const apiKey = env.serviceRoleKey || env.supabaseAnonKey;
  const headers = {
    apikey: apiKey,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (env.serviceRoleKey) {
    if (!isOpaqueSecretKey) {
      headers.Authorization = `Bearer ${env.serviceRoleKey}`;
    }
  } else if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  const res = await fetchImpl(`${env.supabaseUrl}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }
  return { ok: res.ok, status: res.status, data: json };
}

function computeEntitlement(profile, env) {
  const plan = ['free', 'pro', 'lifetime'].includes(profile?.plan) ? profile.plan : 'free';
  const planStatus = typeof profile?.plan_status === 'string' ? profile.plan_status : 'inactive';
  const periodEndMs = profile?.current_period_end ? Date.parse(profile.current_period_end) : null;
  const activePeriod = !periodEndMs || (Number.isFinite(periodEndMs) && periodEndMs > Date.now());
  const paidPlanActive =
    (plan === 'lifetime') ||
    (plan === 'pro' && ['active', 'trialing'].includes(planStatus) && activePeriod);

  const hasProAccess = paidPlanActive || Boolean(env.softBetaMode);
  return {
    plan,
    planStatus,
    hasProAccess,
    paidPlanActive,
    softBetaMode: Boolean(env.softBetaMode),
    canCloudSync: true,
    billingProvider: profile?.billing_provider || null,
    currentPeriodEnd: profile?.current_period_end || null,
    source: paidPlanActive ? 'subscription' : (env.softBetaMode ? 'soft_beta' : 'free')
  };
}

module.exports = {
  readEnvConfig,
  sendJson,
  getBearerToken,
  parseJsonBody,
  verifyAccessToken,
  supabaseRest,
  computeEntitlement
};
