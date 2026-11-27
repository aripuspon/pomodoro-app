const {
  readEnvConfig,
  sendJson,
  getBearerToken,
  parseJsonBody,
  verifyAccessToken,
  supabaseRest,
  computeEntitlement
} = require('./_lib/supabase');

async function getOrCreateProfile(authUser, env, accessToken) {
  const userId = encodeURIComponent(authUser.id);
  const query = `profiles?id=eq.${userId}&select=id,email,display_name,avatar_url,plan,plan_status,billing_provider,current_period_end,created_at,updated_at`;
  const existingRes = await supabaseRest(query, { method: 'GET' }, env, accessToken);
  if (!existingRes.ok) {
    throw new Error(existingRes.data?.message || 'Failed to read user profile');
  }
  if (Array.isArray(existingRes.data) && existingRes.data[0]) {
    return existingRes.data[0];
  }

  if (env.serviceRoleKey) {
    const defaultName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || (authUser.email || '').split('@')[0] || 'Focus User';
    const created = await supabaseRest(
      'profiles?on_conflict=id',
      {
        method: 'POST',
        headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
        body: {
          id: authUser.id,
          email: authUser.email || null,
          display_name: String(defaultName).slice(0, 60),
          avatar_url: authUser.user_metadata?.avatar_url || null,
          plan: 'pro',
          plan_status: 'trialing',
          current_period_end: new Date(Date.now() + 3 * 86400000).toISOString()
        }
      },
      env,
      accessToken
    );
    if (created.ok && Array.isArray(created.data) && created.data[0]) {
      return created.data[0];
    }
  }

  return {
    id: authUser.id,
    email: authUser.email || '',
    display_name: authUser.user_metadata?.full_name || (authUser.email || '').split('@')[0] || 'Focus User',
    avatar_url: authUser.user_metadata?.avatar_url || null,
    plan: 'free',
    plan_status: 'inactive',
    billing_provider: null,
    current_period_end: null
  };
}

module.exports = async function handler(req, res) {
  const env = readEnvConfig();
  if (!env.configured) {
    return sendJson(res, 503, { error: 'Cloud backend not configured in Vercel environment variables.' });
  }

  const accessToken = getBearerToken(req);
  const auth = await verifyAccessToken(accessToken, env);
  if (auth.error) {
    return sendJson(res, auth.status, { error: auth.error });
  }

  if (req.method === 'GET') {
    try {
      const profile = await getOrCreateProfile(auth.user, env, accessToken);
      return sendJson(res, 200, {
        user: {
          id: auth.user.id,
          email: profile.email || auth.user.email || '',
          displayName: profile.display_name || '',
          avatarUrl: profile.avatar_url || null
        },
        entitlement: computeEntitlement(profile, env)
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message || 'Failed to load profile' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const body = await parseJsonBody(req);
      const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 60) : '';
      if (!displayName) {
        return sendJson(res, 400, { error: 'displayName cannot be empty.' });
      }
      const userId = encodeURIComponent(auth.user.id);
      const updated = await supabaseRest(
        `profiles?id=eq.${userId}&select=id,email,display_name,avatar_url,plan,plan_status,billing_provider,current_period_end`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: { display_name: displayName }
        },
        env,
        accessToken
      );
      if (!updated.ok) {
        return sendJson(res, updated.status || 500, { error: updated.data?.message || 'Could not update display name' });
      }
      const profile = (Array.isArray(updated.data) && updated.data[0]) || await getOrCreateProfile(auth.user, env, accessToken);
      return sendJson(res, 200, {
        user: {
          id: auth.user.id,
          email: profile.email || auth.user.email || '',
          displayName: profile.display_name || displayName,
          avatarUrl: profile.avatar_url || null
        },
        entitlement: computeEntitlement(profile, env)
      });
    } catch (err) {
      return sendJson(res, err.statusCode || 400, { error: err.message || 'Invalid update payload' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return sendJson(res, 405, { error: 'Method not allowed' });
};
