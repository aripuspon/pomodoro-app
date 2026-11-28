const {
  readEnvConfig,
  sendJson,
  getBearerToken,
  parseJsonBody,
  verifyAccessToken,
  supabaseRest,
  computeEntitlement
} = require('./_lib/supabase');

async function readWorkspaceRow(userId, env, accessToken) {
  const encodedId = encodeURIComponent(userId);
  const res = await supabaseRest(
    `workspaces?user_id=eq.${encodedId}&select=user_id,schema_version,payload,revision,client_updated_at,updated_at`,
    { method: 'GET' },
    env,
    accessToken
  );
  if (!res.ok) {
    throw new Error(res.data?.message || 'Failed to query cloud workspace');
  }
  return Array.isArray(res.data) ? res.data[0] || null : null;
}

function validateWorkspacePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return 'Workspace payload must be a JSON object.';
  }
  if (payload.tasks !== undefined && !Array.isArray(payload.tasks)) {
    return 'Workspace tasks must be an array.';
  }
  if (payload.sessionHistory !== undefined && !Array.isArray(payload.sessionHistory)) {
    return 'Workspace sessionHistory must be an array.';
  }
  if (payload.appSettings !== undefined && (typeof payload.appSettings !== 'object' || Array.isArray(payload.appSettings))) {
    return 'Workspace appSettings must be an object.';
  }
  return null;
}

module.exports = async function handler(req, res) {
  const env = readEnvConfig();
  if (!env.configured) {
    return sendJson(res, 503, { error: 'Cloud sync backend is not configured.' });
  }

  const accessToken = getBearerToken(req);
  const auth = await verifyAccessToken(accessToken, env);
  if (auth.error) {
    return sendJson(res, auth.status, { error: auth.error });
  }

  const userId = auth.user.id;

  if (req.method === 'GET') {
    try {
      const row = await readWorkspaceRow(userId, env, accessToken);
      if (!row || row.revision === 0 || !row.payload || Object.keys(row.payload).length === 0) {
        return sendJson(res, 200, {
          exists: false,
          revision: row?.revision || 0,
          schemaVersion: row?.schema_version || 'pomodoro-workspace-v2',
          updatedAt: row?.updated_at || null,
          payload: null
        });
      }
      return sendJson(res, 200, {
        exists: true,
        revision: Number(row.revision) || 0,
        schemaVersion: row.schema_version || 'pomodoro-workspace-v2',
        clientUpdatedAt: row.client_updated_at || null,
        updatedAt: row.updated_at || null,
        payload: row.payload
      });
    } catch (err) {
      return sendJson(res, 500, { error: err.message || 'Failed to load workspace' });
    }
  }

  if (req.method === 'PUT') {
    try {
      if (!env.softBetaMode) {
        const encodedId = encodeURIComponent(userId);
        const profRes = await supabaseRest(
          `profiles?id=eq.${encodedId}&select=plan,plan_status,billing_provider,current_period_end`,
          { method: 'GET' },
          env,
          accessToken
        );
        const profile = Array.isArray(profRes.data) ? profRes.data[0] : null;
        const ent = computeEntitlement(profile, env);
        if (!ent.hasProAccess) {
          return sendJson(res, 403, {
            error: 'PRO_REQUIRED',
            message: 'Multi-device Cloud Sync requires an active PomoNow Pro plan or trial.'
          });
        }
      }

      const body = await parseJsonBody(req);
      const payload = body?.payload;
      const validationError = validateWorkspacePayload(payload);
      if (validationError) {
        return sendJson(res, 400, { error: validationError });
      }

      const force = Boolean(body.force);
      const expectedRevision = body.expectedRevision !== undefined && body.expectedRevision !== null
        ? Number(body.expectedRevision)
        : null;

      const existing = await readWorkspaceRow(userId, env, accessToken);
      const currentRevision = Number(existing?.revision) || 0;

      if (!force && expectedRevision !== null && Number.isFinite(expectedRevision) && existing && currentRevision !== expectedRevision) {
        return sendJson(res, 409, {
          error: 'SYNC_CONFLICT',
          message: 'Newer cloud snapshot exists on server.',
          serverRevision: currentRevision,
          serverUpdatedAt: existing.updated_at || null,
          serverPayload: existing.payload || null
        });
      }

      const nextRevision = currentRevision + 1;
      const clientUpdatedAt = typeof body.clientUpdatedAt === 'string' && !Number.isNaN(Date.parse(body.clientUpdatedAt))
        ? body.clientUpdatedAt
        : new Date().toISOString();

      let writeRes;
      if (existing) {
        const encodedId = encodeURIComponent(userId);
        const revGuard = !force ? `&revision=eq.${currentRevision}` : '';
        writeRes = await supabaseRest(
          `workspaces?user_id=eq.${encodedId}${revGuard}&select=revision,updated_at,client_updated_at`,
          {
            method: 'PATCH',
            headers: { Prefer: 'return=representation' },
            body: {
              schema_version: 'pomodoro-workspace-v2',
              payload,
              revision: nextRevision,
              client_updated_at: clientUpdatedAt
            }
          },
          env,
          accessToken
        );
      } else {
        writeRes = await supabaseRest(
          'workspaces?on_conflict=user_id&select=revision,updated_at,client_updated_at',
          {
            method: 'POST',
            headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
            body: {
              user_id: userId,
              schema_version: 'pomodoro-workspace-v2',
              payload,
              revision: nextRevision,
              client_updated_at: clientUpdatedAt
            }
          },
          env,
          accessToken
        );
      }

      if (!writeRes.ok) {
        return sendJson(res, writeRes.status || 500, { error: writeRes.data?.message || 'Failed to save cloud workspace' });
      }

      const updatedRow = Array.isArray(writeRes.data) ? writeRes.data[0] : null;
      if (existing && !updatedRow) {
        const latest = await readWorkspaceRow(userId, env, accessToken);
        return sendJson(res, 409, {
          error: 'SYNC_CONFLICT',
          message: 'Concurrent update detected.',
          serverRevision: latest?.revision || currentRevision,
          serverUpdatedAt: latest?.updated_at || null,
          serverPayload: latest?.payload || null
        });
      }

      return sendJson(res, 200, {
        ok: true,
        revision: Number(updatedRow?.revision) || nextRevision,
        updatedAt: updatedRow?.updated_at || new Date().toISOString()
      });
    } catch (err) {
      return sendJson(res, err.statusCode || 500, { error: err.message || 'Cloud sync write error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return sendJson(res, 405, { error: 'Method not allowed' });
};
