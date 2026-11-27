// --- SAAS AUTH, CLOUD SYNC & SOFT-BETA ENTITLEMENT CLIENT ---
(function initPomodoroCloud() {
  const SESSION_STORAGE_KEY = 'pomodoroCloudSession';
  const REV_STORAGE_PREFIX = 'pomodoroCloudRevision:';
  const PENDING_UPLOAD_PREFIX = 'pomodoroCloudPending:';
  const SYNC_DEBOUNCE_MS = 1200;

  let cloudConfig = {
    configured: false,
    supabaseUrl: '',
    supabaseAnonKey: '',
    googleClientId: '',
    softBetaMode: true,
    mode: 'static',
    features: { auth: false, cloudSync: false, billingReady: false }
  };

  let session = loadStoredSession();
  let authMode = 'signin';
  let refreshPromise = null;
  let gsiScriptPromise = null;
  let activeGoogleRawNonce = '';
  let syncDebounceTimer = null;
  let isSyncInFlight = false;
  let knownRevision = session?.user?.id ? loadStoredRevision(session.user.id) : null;
  let pendingUpload = session?.user?.id ? loadPendingFlag(session.user.id) : false;
  let pendingConflictPayload = null;
  let pendingConflictRevision = null;
  let lastSyncedAt = null;
  let syncStateLabel = 'Local only';

  let userProfile = null;
  let entitlement = {
    plan: 'free',
    planStatus: 'inactive',
    hasProAccess: true,
    softBetaMode: true,
    canCloudSync: false,
    source: 'soft_beta'
  };

  // DOM Elements
  const btnAccount = document.getElementById('btn-account');
  const accountStatusDot = document.getElementById('account-status-dot');
  const accountBtnLabel = document.getElementById('account-btn-label');

  const settingsAccountEmail = document.getElementById('settings-account-email');
  const settingsPlanBadge = document.getElementById('settings-plan-badge');
  const settingsSyncStatus = document.getElementById('settings-sync-status');
  const btnSettingsAccount = document.getElementById('btn-settings-account');
  const btnOpenUpgrade = document.getElementById('btn-open-upgrade');
  const btnFooterPlans = document.getElementById('btn-footer-plans');

  const accountModal = document.getElementById('account-modal');
  const accountModalBackdrop = document.getElementById('account-modal-backdrop');
  const accountModalClose = document.getElementById('account-modal-close');
  const cloudSetupNotice = document.getElementById('cloud-setup-notice');
  const authPanelGuest = document.getElementById('auth-panel-guest');
  const authPanelUser = document.getElementById('auth-panel-user');
  const authModeBtns = document.querySelectorAll('#auth-mode-tabs .choice-btn');
  const authForm = document.getElementById('auth-form');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordWrap = document.getElementById('auth-password-wrap');
  const authPasswordInput = document.getElementById('auth-password');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const googleGsiContainer = document.getElementById('google-gsi-container');
  const btnAuthGoogle = document.getElementById('btn-auth-google');

  const accountAvatar = document.getElementById('account-avatar');
  const accountUserEmail = document.getElementById('account-user-email');
  const accountPlanBadge = document.getElementById('account-plan-badge');
  const btnAccountPlans = document.getElementById('btn-account-plans');
  const accountDisplayName = document.getElementById('account-display-name');
  const btnSaveProfile = document.getElementById('btn-save-profile');
  const cloudSyncSummary = document.getElementById('cloud-sync-summary');
  const cloudSyncDetail = document.getElementById('cloud-sync-detail');
  const btnCloudSyncNow = document.getElementById('btn-cloud-sync-now');
  const btnCloudPull = document.getElementById('btn-cloud-pull');
  const syncConflictBox = document.getElementById('sync-conflict-box');
  const btnSyncMerge = document.getElementById('btn-sync-merge');
  const btnSyncUseCloud = document.getElementById('btn-sync-use-cloud');
  const btnSyncKeepLocal = document.getElementById('btn-sync-keep-local');
  const btnAuthSignout = document.getElementById('btn-auth-signout');
  const authFeedback = document.getElementById('auth-feedback');

  const upgradeModal = document.getElementById('upgrade-modal');
  const upgradeModalBackdrop = document.getElementById('upgrade-modal-backdrop');
  const upgradeModalClose = document.getElementById('upgrade-modal-close');
  const upgradePlanStatus = document.getElementById('upgrade-plan-status');
  const btnUpgradeCta = document.getElementById('btn-upgrade-cta');
  const upgradeCtaNote = document.getElementById('upgrade-cta-note');

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage quota/privacy mode failures
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage quota/privacy mode failures
    }
  }

  function loadStoredSession() {
    try {
      const raw = safeStorageGet(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.access_token ? parsed : null;
    } catch {
      return null;
    }
  }

  function saveStoredSession(nextSession) {
    session = nextSession;
    if (nextSession) {
      safeStorageSet(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      if (nextSession.user?.id) {
        knownRevision = loadStoredRevision(nextSession.user.id);
        pendingUpload = loadPendingFlag(nextSession.user.id);
      }
    } else {
      safeStorageRemove(SESSION_STORAGE_KEY);
      userProfile = null;
      knownRevision = null;
      pendingUpload = false;
      pendingConflictPayload = null;
      pendingConflictRevision = null;
    }
  }

  function loadStoredRevision(userId) {
    const raw = safeStorageGet(`${REV_STORAGE_PREFIX}${userId}`);
    if (raw === null || raw === '') return null;
    const num = Number(raw);
    return Number.isInteger(num) && num >= 0 ? num : null;
  }

  function saveStoredRevision(userId, rev) {
    knownRevision = rev;
    if (userId && Number.isInteger(rev) && rev >= 0) {
      safeStorageSet(`${REV_STORAGE_PREFIX}${userId}`, String(rev));
    }
  }

  function loadPendingFlag(userId) {
    return safeStorageGet(`${PENDING_UPLOAD_PREFIX}${userId}`) === '1';
  }

  function savePendingFlag(userId, val) {
    pendingUpload = Boolean(val);
    if (!userId) return;
    if (pendingUpload) safeStorageSet(`${PENDING_UPLOAD_PREFIX}${userId}`, '1');
    else safeStorageRemove(`${PENDING_UPLOAD_PREFIX}${userId}`);
  }

  function showFeedback(message, isError = false) {
    if (!authFeedback) return;
    if (!message) {
      authFeedback.classList.add('hidden');
      authFeedback.textContent = '';
      return;
    }
    authFeedback.textContent = message;
    authFeedback.classList.toggle('is-error', Boolean(isError));
    authFeedback.classList.remove('hidden');
  }

  function getPlanLabel() {
    if (entitlement.plan === 'lifetime') return 'Lifetime Pro';
    if (entitlement.plan === 'pro' && ['active', 'trialing'].includes(entitlement.planStatus)) {
      return 'Pro Active';
    }
    if (entitlement.softBetaMode) return 'Free · Beta Access';
    return 'Free Plan';
  }

  function formatSyncTimestamp(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function updateCloudUI() {
    const isSignedIn = Boolean(session && session.access_token);
    const email = userProfile?.email || session?.user?.email || '';
    const displayName = userProfile?.displayName || session?.user?.user_metadata?.full_name || email.split('@')[0] || 'Account';

    if (cloudSetupNotice) {
      cloudSetupNotice.classList.toggle('hidden', Boolean(cloudConfig.configured));
    }

    if (authPanelGuest) authPanelGuest.classList.toggle('hidden', isSignedIn);
    if (authPanelUser) authPanelUser.classList.toggle('hidden', !isSignedIn);

    const planText = getPlanLabel();
    if (settingsPlanBadge) settingsPlanBadge.textContent = planText;
    if (accountPlanBadge) accountPlanBadge.textContent = planText;

    if (accountBtnLabel) {
      accountBtnLabel.textContent = isSignedIn ? displayName.slice(0, 14) : 'Sign In';
    }

    if (accountStatusDot) {
      accountStatusDot.classList.remove('is-synced', 'is-syncing', 'is-offline');
      if (isSignedIn) {
        if (isSyncInFlight) accountStatusDot.classList.add('is-syncing');
        else if (syncStateLabel.includes('Offline') || syncStateLabel.includes('Error') || pendingConflictPayload) accountStatusDot.classList.add('is-offline');
        else accountStatusDot.classList.add('is-synced');
      }
    }

    if (settingsAccountEmail) {
      settingsAccountEmail.textContent = isSignedIn ? email : 'Guest Mode (Local only)';
    }

    if (isSignedIn) {
      if (accountAvatar) accountAvatar.textContent = (displayName || email || 'U').charAt(0).toUpperCase();
      if (accountUserEmail) accountUserEmail.textContent = email || displayName;
      if (accountDisplayName && document.activeElement !== accountDisplayName) {
        accountDisplayName.value = userProfile?.displayName || '';
      }
    }

    const revPart = Number.isInteger(knownRevision) && knownRevision > 0 ? `Rev #${knownRevision}` : 'Not synced yet';
    const timePart = lastSyncedAt ? ` at ${formatSyncTimestamp(lastSyncedAt)}` : '';
    const syncDetailText = isSignedIn
      ? (pendingConflictPayload
        ? 'Action needed: choose how to merge local and cloud data.'
        : `${syncStateLabel} · ${revPart}${timePart}`)
      : (cloudConfig.configured
        ? 'Sign in to enable cross-device Supabase Cloud Sync.'
        : 'Local storage active (deploy on Vercel + Supabase for Cloud Sync)');

    if (cloudSyncSummary) {
      cloudSyncSummary.textContent = isSyncInFlight ? 'Syncing...' : syncStateLabel;
      cloudSyncSummary.classList.toggle('is-error', Boolean(syncStateLabel.includes('Error') || syncStateLabel.includes('Conflict')));
    }
    if (cloudSyncDetail) cloudSyncDetail.textContent = syncDetailText;
    if (settingsSyncStatus) settingsSyncStatus.textContent = syncDetailText;

    if (syncConflictBox) {
      syncConflictBox.classList.toggle('hidden', !pendingConflictPayload);
    }

    if (upgradePlanStatus) {
      upgradePlanStatus.innerHTML = entitlement.paidPlanActive
        ? `<strong>${getPlanLabel()}:</strong> All Pro capabilities and Cloud Sync are active on your account.`
        : (entitlement.softBetaMode
          ? '<strong>Soft Beta Access Active:</strong> All Pro features are currently unlocked while subscription billing is finalized.'
          : '<strong>Free Plan:</strong> Upgrade to Pro to unlock Cloud Sync and full suite capabilities.');
    }

    if (btnUpgradeCta && upgradeCtaNote) {
      if (!isSignedIn) {
        btnUpgradeCta.textContent = cloudConfig.configured ? 'Sign In / Create Account (Free Beta)' : 'Open Account Setup';
        upgradeCtaNote.textContent = 'Create an account to prepare for Cloud Sync. Payment checkout connects later.';
      } else if (entitlement.paidPlanActive) {
        btnUpgradeCta.textContent = 'Pro Active on Account';
        upgradeCtaNote.textContent = 'Thank you for supporting Pomodoro!';
      } else {
        btnUpgradeCta.textContent = entitlement.softBetaMode ? 'Billing Coming Soon (Beta Unlocked)' : 'Upgrade Coming Soon';
        upgradeCtaNote.textContent = 'Payment checkout (Lemon Squeezy / Paddle / QRIS) will attach right here when enabled.';
      }
    }
  }

  function setAuthMode(nextMode) {
    authMode = ['signin', 'signup', 'magic'].includes(nextMode) ? nextMode : 'signin';
    authModeBtns.forEach(btn => {
      const active = btn.dataset.authMode === authMode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    if (authPasswordWrap) authPasswordWrap.classList.toggle('hidden', authMode === 'magic');
    if (authPasswordInput) authPasswordInput.required = authMode !== 'magic';
    if (btnAuthSubmit) {
      btnAuthSubmit.textContent = authMode === 'signup'
        ? 'Create Account'
        : (authMode === 'magic' ? 'Send Magic Link' : 'Sign In');
    }
    showFeedback('');
  }

  function openAccountModal() {
    if (!accountModal) return;
    closeUpgradeModal();
    showFeedback('');
    updateCloudUI();
    accountModal.classList.remove('hidden');
    if (!session && authEmailInput) authEmailInput.focus();
    renderGoogleSignInWidget();
  }

  function closeAccountModal() {
    if (accountModal) accountModal.classList.add('hidden');
  }

  function openUpgradeModal() {
    if (!upgradeModal) return;
    closeAccountModal();
    updateCloudUI();
    upgradeModal.classList.remove('hidden');
  }

  function closeUpgradeModal() {
    if (upgradeModal) upgradeModal.classList.add('hidden');
  }

  function closeTopModal() {
    if (accountModal && !accountModal.classList.contains('hidden')) {
      closeAccountModal();
      return true;
    }
    if (upgradeModal && !upgradeModal.classList.contains('hidden')) {
      closeUpgradeModal();
      return true;
    }
    return false;
  }

  async function loadCloudConfig() {
    if (typeof window !== 'undefined' && window.POMODORO_CLOUD_CONFIG) {
      cloudConfig = { ...cloudConfig, ...window.POMODORO_CLOUD_CONFIG };
      entitlement.softBetaMode = cloudConfig.softBetaMode !== false;
      updateCloudUI();
      return cloudConfig;
    }

    if (typeof window !== 'undefined' && window.location?.protocol === 'file:') {
      updateCloudUI();
      return cloudConfig;
    }

    try {
      const res = await fetch('./cloud-config.json', { cache: 'no-store' });
      let data = null;
      const isVercelRuntime = Boolean(
        res.headers &&
        typeof res.headers.get === 'function' &&
        res.headers.get('x-cloud-runtime') === 'vercel'
      );

      if (isVercelRuntime) {
        const apiRes = await fetch('/api/config', { cache: 'no-store' });
        if (apiRes.ok) {
          data = await apiRes.json();
        }
      }

      if (!data && res.ok) {
        data = await res.json();
      }

      if (data && typeof data === 'object') {
        cloudConfig = { ...cloudConfig, ...data };
        entitlement.softBetaMode = cloudConfig.softBetaMode !== false;
        if (!entitlement.paidPlanActive) {
          entitlement.hasProAccess = entitlement.softBetaMode;
        }
      }
    } catch {
      // Stay cleanly in static/local mode
    }
    updateCloudUI();
    return cloudConfig;
  }

  function extractSessionFromUrlHash() {
    if (typeof window === 'undefined' || !window.location.hash) return false;
    const rawHash = window.location.hash.replace(/^#/, '');
    if (!rawHash.includes('access_token=') && !rawHash.includes('error_description=')) return false;

    const params = new URLSearchParams(rawHash);
    if (window.history && typeof window.history.replaceState === 'function') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const errDesc = params.get('error_description') || params.get('error');
    if (errDesc) {
      openAccountModal();
      showFeedback(errDesc, true);
      return false;
    }

    const accessToken = params.get('access_token');
    if (!accessToken) return false;

    const expiresIn = Number(params.get('expires_in')) || 3600;
    const nextSession = {
      access_token: accessToken,
      refresh_token: params.get('refresh_token') || '',
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      user: session?.user || null
    };
    saveStoredSession(nextSession);
    return true;
  }

  async function supabaseAuthRequest(path, bodyObj) {
    if (!cloudConfig.configured || !cloudConfig.supabaseUrl || !cloudConfig.supabaseAnonKey) {
      throw new Error('Cloud backend is not configured yet. Follow SUPABASE_VERCEL_SETUP.md.');
    }
    const res = await fetch(`${cloudConfig.supabaseUrl}${path}`, {
      method: 'POST',
      headers: {
        apikey: cloudConfig.supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.msg || data.error_description || data.error || `Auth error (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }

  async function refreshSessionIfNeeded(forceRefresh = false) {
    if (!session || !session.access_token) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiresAt = Number(session.expires_at) || 0;
    if (!forceRefresh && expiresAt > nowSec + 60) {
      return session.access_token;
    }
    if (!session.refresh_token || !cloudConfig.configured) {
      return forceRefresh ? null : session.access_token;
    }
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const refreshed = await supabaseAuthRequest('/auth/v1/token?grant_type=refresh_token', {
          refresh_token: session.refresh_token
        });
        const nextExpires = refreshed.expires_at || (Math.floor(Date.now() / 1000) + (Number(refreshed.expires_in) || 3600));
        saveStoredSession({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token || session.refresh_token,
          expires_at: nextExpires,
          user: refreshed.user || session.user || null
        });
        return session.access_token;
      } catch {
        saveStoredSession(null);
        syncStateLabel = 'Session expired';
        updateCloudUI();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  async function apiRequest(path, options = {}, retryOnAuth = true) {
    const token = await refreshSessionIfNeeded(false);
    if (!token) throw new Error('Not authenticated.');

    const res = await fetch(path, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (res.status === 401 && retryOnAuth) {
      const renewed = await refreshSessionIfNeeded(true);
      if (renewed) return apiRequest(path, options, false);
    }

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  async function fetchProfileAndEntitlement() {
    if (!cloudConfig.configured || !session) return null;
    const res = await apiRequest('/api/me', { method: 'GET' });
    if (!res.ok) {
      throw new Error(res.data?.error || 'Failed to load profile');
    }
    if (res.data.user) {
      userProfile = res.data.user;
      if (!session.user || session.user.id !== res.data.user.id) {
        saveStoredSession({ ...session, user: res.data.user });
      }
    }
    if (res.data.entitlement) {
      entitlement = res.data.entitlement;
    }
    updateCloudUI();
    return res.data;
  }

  async function pushWorkspaceToCloud({ force = false } = {}) {
    const bridge = window.PomodoroWorkspace;
    if (!cloudConfig.configured || !session || !bridge) return null;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      syncStateLabel = 'Offline (saved locally)';
      savePendingFlag(session.user?.id, true);
      updateCloudUI();
      return null;
    }

    isSyncInFlight = true;
    syncStateLabel = 'Syncing...';
    updateCloudUI();

    try {
      const payload = bridge.exportSnapshot();
      const res = await apiRequest('/api/sync', {
        method: 'PUT',
        body: {
          expectedRevision: force ? null : knownRevision,
          force,
          clientUpdatedAt: new Date().toISOString(),
          payload
        }
      });

      if (res.status === 409) {
        pendingConflictPayload = res.data?.serverPayload || null;
        pendingConflictRevision = Number(res.data?.serverRevision) || knownRevision;
        syncStateLabel = 'Sync Conflict';
        updateCloudUI();
        return null;
      }

      if (!res.ok) {
        throw new Error(res.data?.error || 'Cloud sync upload failed');
      }

      saveStoredRevision(session.user?.id, Number(res.data.revision) || 1);
      savePendingFlag(session.user?.id, false);
      pendingConflictPayload = null;
      pendingConflictRevision = null;
      lastSyncedAt = res.data.updatedAt || new Date().toISOString();
      syncStateLabel = 'Synced';
      updateCloudUI();
      return res.data;
    } catch (err) {
      savePendingFlag(session.user?.id, true);
      syncStateLabel = typeof navigator !== 'undefined' && navigator.onLine === false ? 'Offline (saved locally)' : 'Sync Error';
      updateCloudUI();
      return null;
    } finally {
      isSyncInFlight = false;
      updateCloudUI();
    }
  }

  async function pullFromCloud() {
    const bridge = window.PomodoroWorkspace;
    if (!cloudConfig.configured || !session || !bridge) return null;

    isSyncInFlight = true;
    syncStateLabel = 'Loading cloud...';
    updateCloudUI();

    try {
      const res = await apiRequest('/api/sync', { method: 'GET' });
      if (!res.ok) throw new Error(res.data?.error || 'Failed to read cloud workspace');

      if (!res.data.exists || !res.data.payload) {
        saveStoredRevision(session.user?.id, 0);
        syncStateLabel = 'Synced';
        updateCloudUI();
        return res.data;
      }

      bridge.applySnapshot(res.data.payload);
      saveStoredRevision(session.user?.id, Number(res.data.revision) || 1);
      savePendingFlag(session.user?.id, false);
      pendingConflictPayload = null;
      pendingConflictRevision = null;
      lastSyncedAt = res.data.updatedAt || new Date().toISOString();
      syncStateLabel = 'Synced';
      updateCloudUI();
      return res.data;
    } catch (err) {
      syncStateLabel = 'Sync Error';
      showFeedback(err?.message || 'Could not restore from cloud', true);
      updateCloudUI();
      return null;
    } finally {
      isSyncInFlight = false;
      updateCloudUI();
    }
  }

  async function bootstrapCloudSession() {
    if (!cloudConfig.configured || !session) {
      updateCloudUI();
      return;
    }
    const bridge = window.PomodoroWorkspace;
    try {
      await fetchProfileAndEntitlement();
      const userId = session.user?.id;
      const syncRes = await apiRequest('/api/sync', { method: 'GET' });
      if (!syncRes.ok) {
        throw new Error(syncRes.data?.error || 'Unable to check cloud workspace');
      }

      const serverExists = Boolean(syncRes.data.exists && syncRes.data.payload);
      const serverRev = Number(syncRes.data.revision) || 0;
      const localRev = userId ? loadStoredRevision(userId) : null;
      const localHasData = Boolean(bridge && bridge.hasMeaningfulData());

      if (!serverExists || serverRev === 0) {
        if (localHasData) {
          await pushWorkspaceToCloud({ force: true });
        } else {
          saveStoredRevision(userId, 0);
          syncStateLabel = 'Synced';
          updateCloudUI();
        }
        return;
      }

      if (localRev === null && localHasData) {
        // First time syncing this guest browser into a non-empty cloud account: prompt merge vs keep!
        pendingConflictPayload = syncRes.data.payload;
        pendingConflictRevision = serverRev;
        syncStateLabel = 'Conflict (Choose Merge)';
        openAccountModal();
        updateCloudUI();
        return;
      }

      if (localRev === null || serverRev > localRev) {
        if (pendingUpload && localHasData) {
          pendingConflictPayload = syncRes.data.payload;
          pendingConflictRevision = serverRev;
          syncStateLabel = 'Conflict (Choose Merge)';
          updateCloudUI();
          return;
        }
        bridge?.applySnapshot(syncRes.data.payload);
        saveStoredRevision(userId, serverRev);
        lastSyncedAt = syncRes.data.updatedAt || new Date().toISOString();
        syncStateLabel = 'Synced';
        updateCloudUI();
        return;
      }

      if (pendingUpload) {
        await pushWorkspaceToCloud();
      } else {
        lastSyncedAt = syncRes.data.updatedAt || lastSyncedAt;
        syncStateLabel = 'Synced';
        updateCloudUI();
      }
    } catch (err) {
      syncStateLabel = typeof navigator !== 'undefined' && navigator.onLine === false ? 'Offline (saved locally)' : 'Sync Error';
      updateCloudUI();
    }
  }

  function onWorkspaceChanged() {
    if (!cloudConfig.configured || !session || pendingConflictPayload) return;
    if (session.user?.id) savePendingFlag(session.user.id, true);
    syncStateLabel = 'Pending sync...';
    updateCloudUI();
    clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      pushWorkspaceToCloud();
    }, SYNC_DEBOUNCE_MS);
  }

  // Event Listeners
  if (btnAccount) btnAccount.addEventListener('click', openAccountModal);
  if (btnSettingsAccount) btnSettingsAccount.addEventListener('click', openAccountModal);
  if (accountModalClose) accountModalClose.addEventListener('click', closeAccountModal);
  if (accountModalBackdrop) accountModalBackdrop.addEventListener('click', closeAccountModal);

  if (btnOpenUpgrade) btnOpenUpgrade.addEventListener('click', openUpgradeModal);
  if (btnFooterPlans) btnFooterPlans.addEventListener('click', openUpgradeModal);
  if (btnAccountPlans) btnAccountPlans.addEventListener('click', openUpgradeModal);
  if (upgradeModalClose) upgradeModalClose.addEventListener('click', closeUpgradeModal);
  if (upgradeModalBackdrop) upgradeModalBackdrop.addEventListener('click', closeUpgradeModal);

  authModeBtns.forEach(btn => {
    btn.addEventListener('click', () => setAuthMode(btn.dataset.authMode));
  });

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!cloudConfig.configured) {
        showFeedback('Local mode only — add Supabase + Vercel keys to sign in.', true);
        return;
      }
      const email = String(authEmailInput?.value || '').trim();
      const password = String(authPasswordInput?.value || '');
      if (!email) return;

      btnAuthSubmit.disabled = true;
      showFeedback('Connecting...');
      try {
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        if (authMode === 'magic') {
          await supabaseAuthRequest(`/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
            email,
            create_user: true
          });
          showFeedback('Magic link sent! Check your email inbox to finish signing in.');
        } else if (authMode === 'signup') {
          const data = await supabaseAuthRequest(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
            email,
            password
          });
          if (data.access_token) {
            saveStoredSession({
              access_token: data.access_token,
              refresh_token: data.refresh_token || '',
              expires_at: data.expires_at || (Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600)),
              user: data.user || null
            });
            showFeedback('Account created! Syncing workspace...');
            await bootstrapCloudSession();
          } else {
            showFeedback('Account created! Check your email inbox to confirm your address before signing in.');
          }
        } else {
          const data = await supabaseAuthRequest('/auth/v1/token?grant_type=password', {
            email,
            password
          });
          saveStoredSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token || '',
            expires_at: data.expires_at || (Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600)),
            user: data.user || null
          });
          showFeedback('');
          await bootstrapCloudSession();
        }
      } catch (err) {
        showFeedback(err?.message || 'Authentication failed.', true);
      } finally {
        btnAuthSubmit.disabled = false;
      }
    });
  }

  async function createNoncePair() {
    let rawNonce = '';
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      rawNonce = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    } else {
      rawNonce = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    }

    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      const encoded = new TextEncoder().encode(rawNonce);
      const digest = await crypto.subtle.digest('SHA-256', encoded);
      const hashedNonce = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
      return { rawNonce, hashedNonce };
    }
    return { rawNonce: '', hashedNonce: '' };
  }

  function loadGoogleGsiScript() {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      return Promise.resolve(window.google.accounts.id);
    }
    if (gsiScriptPromise) return gsiScriptPromise;

    gsiScriptPromise = new Promise((resolve, reject) => {
      if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
        reject(new Error('DOM unavailable for Google Sign-In'));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          resolve(window.google.accounts.id);
        } else {
          gsiScriptPromise = null;
          reject(new Error('Google Identity Services did not initialize.'));
        }
      };
      script.onerror = () => {
        gsiScriptPromise = null;
        reject(new Error('Failed to load Google Sign-In script.'));
      };
      const target = document.head || document.documentElement || document.body;
      if (!target) {
        gsiScriptPromise = null;
        reject(new Error('Document root unavailable.'));
        return;
      }
      target.appendChild(script);
    });

    return gsiScriptPromise;
  }

  async function handleGoogleIdTokenCredential(response) {
    const idToken = response?.credential;
    if (!idToken) {
      showFeedback('Google Sign-In did not return a credential.', true);
      return;
    }

    showFeedback('Signing in with Google...');
    try {
      const payload = {
        provider: 'google',
        id_token: idToken,
        ...(activeGoogleRawNonce ? { nonce: activeGoogleRawNonce } : {})
      };
      const data = await supabaseAuthRequest('/auth/v1/token?grant_type=id_token', payload);
      saveStoredSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token || '',
        expires_at: data.expires_at || (Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600)),
        user: data.user || null
      });
      showFeedback('');
      await bootstrapCloudSession();
    } catch (err) {
      showFeedback(err?.message || 'Google authentication failed.', true);
      renderGoogleSignInWidget();
    }
  }

  async function renderGoogleSignInWidget() {
    if (!googleGsiContainer || !btnAuthGoogle) return;
    if (!cloudConfig.configured || !cloudConfig.googleClientId || session) {
      googleGsiContainer.classList.add('hidden');
      btnAuthGoogle.classList.remove('hidden');
      return;
    }

    try {
      const gsi = await loadGoogleGsiScript();
      const { rawNonce, hashedNonce } = await createNoncePair();
      activeGoogleRawNonce = rawNonce;

      gsi.initialize({
        client_id: cloudConfig.googleClientId,
        callback: handleGoogleIdTokenCredential,
        ...(hashedNonce ? { nonce: hashedNonce } : {}),
        ux_mode: 'popup',
        context: 'signin'
      });

      googleGsiContainer.innerHTML = '';
      googleGsiContainer.classList.remove('hidden');
      btnAuthGoogle.classList.add('hidden');

      const width = Math.min(388, Math.max(240, Math.floor(googleGsiContainer.clientWidth || 350)));
      const isDark = document.documentElement?.getAttribute?.('data-theme') === 'dark';
      gsi.renderButton(googleGsiContainer, {
        type: 'standard',
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width
      });
    } catch {
      googleGsiContainer.classList.add('hidden');
      btnAuthGoogle.classList.remove('hidden');
    }
  }

  if (btnAuthGoogle) {
    btnAuthGoogle.addEventListener('click', () => {
      if (!cloudConfig.configured) {
        showFeedback('Connect your Supabase & Vercel keys first to enable Google Sign-In.', true);
        return;
      }
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      window.location.href = `${cloudConfig.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    });
  }

  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', async () => {
      const nextName = String(accountDisplayName?.value || '').trim();
      if (!nextName) return;
      btnSaveProfile.disabled = true;
      try {
        const res = await apiRequest('/api/me', {
          method: 'PATCH',
          body: { displayName: nextName }
        });
        if (!res.ok) throw new Error(res.data?.error || 'Could not update profile');
        userProfile = res.data.user;
        updateCloudUI();
        showFeedback('Display name saved.');
      } catch (err) {
        showFeedback(err?.message || 'Save failed', true);
      } finally {
        btnSaveProfile.disabled = false;
      }
    });
  }

  if (btnCloudSyncNow) {
    btnCloudSyncNow.addEventListener('click', async () => {
      await pushWorkspaceToCloud();
    });
  }

  if (btnCloudPull) {
    btnCloudPull.addEventListener('click', async () => {
      await pullFromCloud();
    });
  }

  if (btnSyncMerge) {
    btnSyncMerge.addEventListener('click', async () => {
      const bridge = window.PomodoroWorkspace;
      if (!bridge || !pendingConflictPayload) return;
      const merged = bridge.mergeSnapshots(bridge.exportSnapshot(), pendingConflictPayload);
      bridge.applySnapshot(merged);
      if (session?.user?.id && Number.isInteger(pendingConflictRevision)) {
        saveStoredRevision(session.user.id, pendingConflictRevision);
      }
      pendingConflictPayload = null;
      pendingConflictRevision = null;
      await pushWorkspaceToCloud({ force: true });
      showFeedback('Merged local and cloud workspaces.');
    });
  }

  if (btnSyncUseCloud) {
    btnSyncUseCloud.addEventListener('click', async () => {
      const bridge = window.PomodoroWorkspace;
      if (!bridge || !pendingConflictPayload) return;
      bridge.applySnapshot(pendingConflictPayload);
      if (session?.user?.id && Number.isInteger(pendingConflictRevision)) {
        saveStoredRevision(session.user.id, pendingConflictRevision);
      }
      savePendingFlag(session?.user?.id, false);
      pendingConflictPayload = null;
      pendingConflictRevision = null;
      syncStateLabel = 'Synced';
      updateCloudUI();
      showFeedback('Applied cloud workspace.');
    });
  }

  if (btnSyncKeepLocal) {
    btnSyncKeepLocal.addEventListener('click', async () => {
      pendingConflictPayload = null;
      pendingConflictRevision = null;
      await pushWorkspaceToCloud({ force: true });
      showFeedback('Uploaded local workspace to cloud.');
    });
  }

  if (btnAuthSignout) {
    btnAuthSignout.addEventListener('click', async () => {
      clearTimeout(syncDebounceTimer);
      if (cloudConfig.configured && session?.access_token) {
        try {
          await fetch(`${cloudConfig.supabaseUrl}/auth/v1/logout`, {
            method: 'POST',
            headers: {
              apikey: cloudConfig.supabaseAnonKey,
              Authorization: `Bearer ${session.access_token}`
            }
          });
        } catch {
          // Best-effort server logout
        }
      }
      saveStoredSession(null);
      syncStateLabel = 'Local only';
      lastSyncedAt = null;
      updateCloudUI();
      if (accountModal && !accountModal.classList.contains('hidden')) {
        renderGoogleSignInWidget();
      }
      showFeedback('Signed out. Local browser data remains safely here.');
    });
  }

  if (btnUpgradeCta) {
    btnUpgradeCta.addEventListener('click', () => {
      if (!session) {
        openAccountModal();
      } else {
        closeUpgradeModal();
        openAccountModal();
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      if (cloudConfig.configured && session && pendingUpload && !pendingConflictPayload) {
        pushWorkspaceToCloud();
      }
    });

    window.PomodoroCloud = {
      getEntitlement: () => ({ ...entitlement }),
      hasProAccess: () => Boolean(entitlement.hasProAccess),
      isSoftBetaMode: () => Boolean(entitlement.softBetaMode),
      openAccountModal,
      openUpgradeModal,
      closeTopModal,
      onWorkspaceChanged,
      syncNow: () => pushWorkspaceToCloud(),
      pullFromCloud,
      bootstrapCloudSession
    };
  }

  (async function startCloud() {
    await loadCloudConfig();
    extractSessionFromUrlHash();
    updateCloudUI();
    if (cloudConfig.configured && session) {
      await bootstrapCloudSession();
    }
  })();
})();
