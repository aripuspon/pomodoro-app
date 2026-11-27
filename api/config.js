const { readEnvConfig, sendJson } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const env = readEnvConfig();
  return sendJson(res, 200, {
    configured: env.configured,
    supabaseUrl: env.configured ? env.supabaseUrl : '',
    supabaseAnonKey: env.configured ? env.supabaseAnonKey : '',
    googleClientId: env.configured ? env.googleClientId : '',
    softBetaMode: env.softBetaMode,
    mode: env.configured ? 'cloud' : 'static',
    features: {
      auth: env.configured,
      cloudSync: env.configured,
      billingReady: env.configured
    }
  });
};
