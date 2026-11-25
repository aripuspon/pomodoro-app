// --- TIMER CONFIGURATION ---
const PRESETS = {
  1: { work: 25, shortBreak: 5, longBreak: 15 },
  2: { work: 50, shortBreak: 10, longBreak: 30 },
  3: { work: 75, shortBreak: 15, longBreak: 45 }
};

const DURATION_LIMITS = {
  work: { min: 1, max: 180 },
  shortBreak: { min: 1, max: 60 },
  longBreak: { min: 1, max: 90 },
  longBreakInterval: { min: 1, max: 12 },
  dailyGoal: { min: 1, max: 30 }
};

const VALID_PHASES = ['work', 'shortBreak', 'longBreak'];
const VALID_ANALYTICS_RANGES = ['today', 'week'];
const VALID_ALARM_SOUNDS = ['bell', 'digital', 'gong', 'marimba'];
const VALID_AMBIENT_SOUNDS = ['off', 'white', 'pink', 'rain', 'cafe'];
const PROJECT_COLORS = ['#d95550', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#16a085', '#e67e22'];
const NO_PROJECT_COLOR = '#95a5a6';

const ICONS = {
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>',
  pause: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4.5" height="16" rx="1"></rect><rect x="13.5" y="4" width="4.5" height="16" rx="1"></rect></svg>',
  playSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>',
  pauseSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4.5" height="16" rx="1"></rect><rect x="13.5" y="4" width="4.5" height="16" rx="1"></rect></svg>',
  moon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  sun: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  chevronUp: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>',
  chevronDown: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>',
  close: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
};

function clampVolume(value, fallback) {
  if (value === null || value === undefined || String(value).trim() === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0 || num > 1) return fallback;
  return num;
}

function safeGetStorage(key, fallback = null) {
  try {
    return localStorage.getItem(key);
  } catch {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. strict file:// privacy mode or quota exceeded)
  }
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const parts = String(dateKey || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => !Number.isInteger(n))) return null;
  const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function sanitizeSessionHistory(rawList) {
  if (!Array.isArray(rawList)) return [];
  const clean = [];
  rawList.forEach(item => {
    if (!item || typeof item !== 'object') return;
    const ts = Number(item.completedAt);
    if (!Number.isFinite(ts) || ts <= 0) return;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return;
    const mins = Number(item.minutes);
    if (!Number.isFinite(mins) || mins <= 0) return;
    clean.push({
      id: typeof item.id === 'string' && item.id ? item.id : `${ts}-${clean.length}`,
      completedAt: ts,
      dateKey: getLocalDateKey(d),
      hour: d.getHours(),
      minutes: Math.round(mins),
      taskId: typeof item.taskId === 'string' && item.taskId ? item.taskId : null,
      taskTitle: typeof item.taskTitle === 'string' && item.taskTitle.trim() ? item.taskTitle.trim() : 'Unassigned',
      project: typeof item.project === 'string' ? item.project.trim() : ''
    });
  });
  return clean;
}

function loadJSON(key, fallback) {
  try {
    const raw = safeGetStorage(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== typeof fallback) return fallback;
    if (Array.isArray(fallback) !== Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clampWholeNumber(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < min || num > max) return fallback;
  return num;
}

// --- APP STATE ---
const loadedTasks = loadJSON('tasks', []);
let tasks = Array.isArray(loadedTasks) ? loadedTasks : [];
let activeTaskId = safeGetStorage('activeTaskId') || null;
let editingTaskId = null; // Menyimpan ID tugas yang sedang di-edit
let selectedProjectFilter = '';
let theme = safeGetStorage('theme') || 'light';

let timerState = loadJSON('timerState', {
  phase: 'work', intensity: 1, remainingSeconds: null, isRunning: false, completedWorkSessions: 0
});

const defaultPreset = PRESETS[timerState.intensity] || PRESETS[1];
let appSettings = loadJSON('appSettings', {
  volume: 0.5,
  alarmSound: 'bell',
  tickingEnabled: false,
  tickingVolume: 0.3,
  ambientSound: 'off',
  ambientVolume: 0.35,
  ambientWorkOnly: false,
  notifications: false,
  autoStart: false,
  autoStartWork: false,
  autoSwitchTask: false,
  durations: { ...defaultPreset },
  longBreakInterval: 4,
  dailyGoal: 6
});

let dailyStats = loadJSON('dailyStats', {
  date: new Date().toDateString(), sessions: 0, minutes: 0
});
let sessionHistory = sanitizeSessionHistory(loadJSON('sessionHistory', []));
let analyticsRange = 'today';
let isSessionLogOpen = false;
let exportStatusTimeout = null;

let timerInterval = null;
let targetEndTime = null;
let audioCtx = null;
let ambientWanted = false;
let activeAmbient = null;
const ambientBufferCache = new Map();

function getPhaseSeconds(phase) {
  const mins = appSettings.durations[phase] || PRESETS[1][phase];
  return mins * 60;
}

function findMatchingPreset(durations) {
  for (const [id, preset] of Object.entries(PRESETS)) {
    if (
      durations.work === preset.work &&
      durations.shortBreak === preset.shortBreak &&
      durations.longBreak === preset.longBreak
    ) {
      return Number(id);
    }
  }
  return 'custom';
}

// --- AUDIO & NOTIFICATION ENGINE ---
function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function scheduleTone(ctx, { freq, startTime, duration, peakGain, type = 'sine', attack = 0.015, endFreq = null }) {
  const safeGain = Math.max(0.001, peakGain);
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (endFreq !== null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);
  }
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(safeGain, startTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

const ALARM_GENERATORS = {
  bell: (ctx, now, vol) => {
    [0, 0.38].forEach(offset => {
      const t = now + offset;
      scheduleTone(ctx, { freq: 880, startTime: t, duration: 1.25, peakGain: vol * 0.42, attack: 0.01 });
      scheduleTone(ctx, { freq: 1760, startTime: t, duration: 0.75, peakGain: vol * 0.14, attack: 0.01 });
      scheduleTone(ctx, { freq: 2637, startTime: t, duration: 0.45, peakGain: vol * 0.06, attack: 0.01 });
    });
  },
  digital: (ctx, now, vol) => {
    [0, 0.42].forEach(offset => {
      const t = now + offset;
      scheduleTone(ctx, { freq: 800, startTime: t, duration: 0.2, peakGain: vol * 0.45, attack: 0.008 });
      scheduleTone(ctx, { freq: 1000, startTime: t + 0.14, duration: 0.22, peakGain: vol * 0.45, attack: 0.008 });
    });
  },
  gong: (ctx, now, vol) => {
    scheduleTone(ctx, { freq: 196, startTime: now, duration: 2.4, peakGain: vol * 0.48, attack: 0.045 });
    scheduleTone(ctx, { freq: 200.5, startTime: now, duration: 2.1, peakGain: vol * 0.24, attack: 0.05 });
    scheduleTone(ctx, { freq: 293.66, startTime: now, duration: 1.6, peakGain: vol * 0.2, attack: 0.035 });
    scheduleTone(ctx, { freq: 392, startTime: now, duration: 1.1, peakGain: vol * 0.12, attack: 0.03 });
  },
  marimba: (ctx, now, vol) => {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.14;
      scheduleTone(ctx, { freq, startTime: t, duration: 0.34, peakGain: vol * 0.48, type: 'triangle', attack: 0.005 });
      scheduleTone(ctx, { freq: freq * 2, startTime: t, duration: 0.08, peakGain: vol * 0.18, type: 'sine', attack: 0.003 });
    });
  }
};

function playAlarmSound() {
  if (appSettings.volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const generator = ALARM_GENERATORS[appSettings.alarmSound] || ALARM_GENERATORS.bell;
  generator(ctx, ctx.currentTime, appSettings.volume);
}

function playTickSound(tickIndex = 0, ignoreToggle = false) {
  const vol = appSettings.tickingVolume;
  if ((!ignoreToggle && !appSettings.tickingEnabled) || vol <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const isEven = tickIndex % 2 === 0;
  const freq = isEven ? 1450 : 1180;
  scheduleTone(ctx, {
    freq,
    endFreq: freq * 0.65,
    startTime: ctx.currentTime,
    duration: 0.032,
    peakGain: vol * 0.14,
    type: 'triangle',
    attack: 0.002
  });
}

function getAmbientNoiseBuffer(ctx, kind) {
  const cacheKey = `${ctx.sampleRate}:${kind}`;
  if (ambientBufferCache.has(cacheKey)) return ambientBufferCache.get(cacheKey);

  const durationSec = 3;
  const length = ctx.sampleRate * durationSec;
  const fadeLen = Math.min(Math.floor(ctx.sampleRate * 0.1), Math.floor(length / 4));
  const totalLen = length + fadeLen;
  const raw = new Float32Array(totalLen);

  if (kind === 'white') {
    for (let i = 0; i < totalLen; i++) {
      raw[i] = (Math.random() * 2 - 1) * 0.5;
    }
  } else if (kind === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = -2000; i < totalLen; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
      if (i >= 0) raw[i] = Math.max(-1, Math.min(1, sample));
    }
  } else {
    let lastOut = 0;
    for (let i = -1000; i < totalLen; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      if (i >= 0) raw[i] = Math.max(-1, Math.min(1, lastOut * 2.8));
    }
  }

  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    if (i < fadeLen) {
      const t = i / fadeLen;
      channel[i] = raw[i] * t + raw[length + i] * (1 - t);
    } else {
      channel[i] = raw[i];
    }
  }

  ambientBufferCache.set(cacheKey, buffer);
  return buffer;
}

function addLoopingBufferLayer(ctx, session, kind, filterConfigs, layerGain) {
  const source = ctx.createBufferSource();
  source.buffer = getAmbientNoiseBuffer(ctx, kind);
  source.loop = true;

  let head = source;
  filterConfigs.forEach(cfg => {
    const filter = ctx.createBiquadFilter();
    filter.type = cfg.type;
    filter.frequency.setValueAtTime(cfg.frequency, ctx.currentTime);
    if (cfg.Q !== undefined) filter.Q.setValueAtTime(cfg.Q, ctx.currentTime);
    head.connect(filter);
    session.nodes.push(filter);
    head = filter;
  });

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(layerGain, ctx.currentTime);
  head.connect(gain);
  gain.connect(session.masterGain);
  source.start();
  session.sources.push(source);
  session.nodes.push(gain);
  return { source, gain };
}

const AMBIENT_BUILDERS = {
  white: (ctx, session) => {
    addLoopingBufferLayer(
      ctx,
      session,
      'white',
      [
        { type: 'highpass', frequency: 140, Q: 0.7 },
        { type: 'lowpass', frequency: 2100, Q: 0.6 }
      ],
      0.24
    );
  },
  pink: (ctx, session) => {
    addLoopingBufferLayer(
      ctx,
      session,
      'pink',
      [{ type: 'lowpass', frequency: 3200, Q: 0.7 }],
      0.52
    );
  },
  rain: (ctx, session) => {
    const washSource = ctx.createBufferSource();
    washSource.buffer = getAmbientNoiseBuffer(ctx, 'pink');
    washSource.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.setValueAtTime(950, ctx.currentTime);
    band.Q.setValueAtTime(0.45, ctx.currentTime);

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(3400, ctx.currentTime);

    const washGain = ctx.createGain();
    washGain.gain.setValueAtTime(0.46, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(band.frequency);

    washSource.connect(band);
    band.connect(low);
    low.connect(washGain);
    washGain.connect(session.masterGain);
    washSource.start();
    lfo.start();
    session.sources.push(washSource, lfo);
    session.nodes.push(band, low, washGain, lfoGain);

    addLoopingBufferLayer(
      ctx,
      session,
      'brown',
      [{ type: 'lowpass', frequency: 360, Q: 0.6 }],
      0.32
    );

    const dropTimer = setInterval(() => {
      if (activeAmbient !== session || ctx.state !== 'running' || Math.random() > 0.65) return;
      const t = ctx.currentTime + 0.02;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const startFreq = 1300 + Math.random() * 1600;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.55, t + 0.055);
      const dropAmp = 0.015 + Math.random() * 0.025;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(dropAmp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      osc.connect(g);
      g.connect(session.masterGain);
      osc.start(t);
      osc.stop(t + 0.07);
    }, 280);
    session.timers.push(dropTimer);
  },
  cafe: (ctx, session) => {
    addLoopingBufferLayer(
      ctx,
      session,
      'brown',
      [{ type: 'lowpass', frequency: 380, Q: 0.7 }],
      0.66
    );

    const chatter = addLoopingBufferLayer(
      ctx,
      session,
      'pink',
      [
        { type: 'bandpass', frequency: 760, Q: 1.7 },
        { type: 'lowpass', frequency: 1900, Q: 0.7 }
      ],
      0.16
    );

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.17, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(chatter.gain.gain);
    lfo.start();
    session.sources.push(lfo);
    session.nodes.push(lfoGain);

    const clinkTimer = setInterval(() => {
      if (activeAmbient !== session || ctx.state !== 'running' || Math.random() > 0.35) return;
      const t = ctx.currentTime + 0.03;
      [2350, 3680].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(idx === 0 ? 0.015 : 0.008, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
        osc.connect(g);
        g.connect(session.masterGain);
        osc.start(t);
        osc.stop(t + 0.13);
      });
    }, 2200);
    session.timers.push(clinkTimer);
  }
};

function stopAmbientAudio() {
  if (!activeAmbient) return;
  const old = activeAmbient;
  activeAmbient = null;

  old.timers.forEach(id => clearInterval(id));
  const ctx = old.ctx;
  try {
    const now = ctx.currentTime;
    old.masterGain.gain.cancelScheduledValues(now);
    old.masterGain.gain.setValueAtTime(Math.max(0.0001, old.masterGain.gain.value), now);
    old.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  } catch {
    // Ignore teardown scheduling errors if AudioContext is closed
  }

  setTimeout(() => {
    old.sources.forEach(src => {
      try { src.stop(); } catch {}
      try { src.disconnect(); } catch {}
    });
    old.nodes.forEach(node => {
      try { node.disconnect(); } catch {}
    });
    try { old.masterGain.disconnect(); } catch {}
  }, 170);
}

function startAmbientAudio(mode) {
  const builder = AMBIENT_BUILDERS[mode];
  if (!builder) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  stopAmbientAudio();

  const masterGain = ctx.createGain();
  const now = ctx.currentTime;
  const targetVol = Math.max(0.0001, appSettings.ambientVolume);
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(targetVol, now + 0.18);
  masterGain.connect(ctx.destination);

  const session = { mode, ctx, masterGain, sources: [], nodes: [], timers: [] };
  activeAmbient = session;
  builder(ctx, session);
}

function updateAmbientUI() {
  const hasSound = appSettings.ambientSound !== 'off';
  const isPlaying = Boolean(activeAmbient);
  const workOnlyWaiting = hasSound && appSettings.ambientWorkOnly && !(timerState.isRunning && timerState.phase === 'work');

  ambientSelect.value = appSettings.ambientSound;
  ambientVolumeSlider.value = appSettings.ambientVolume;
  btnAmbientToggle.disabled = !hasSound;
  btnAmbientToggle.classList.toggle('is-playing', isPlaying);
  ambientToggleIcon.innerHTML = isPlaying ? ICONS.pauseSm : ICONS.playSm;

  if (!hasSound) {
    ambientToggleLabel.textContent = 'Play';
    btnAmbientToggle.title = 'Choose a soundscape first';
  } else if (isPlaying) {
    ambientToggleLabel.textContent = 'Pause';
    btnAmbientToggle.title = 'Pause ambient soundscape';
  } else if (workOnlyWaiting) {
    ambientToggleLabel.textContent = ambientWanted ? 'On Work' : 'Play';
    btnAmbientToggle.title = 'Plays automatically when Work timer runs';
  } else {
    ambientToggleLabel.textContent = 'Play';
    btnAmbientToggle.title = 'Play selected ambient soundscape';
  }
}

function syncAmbientPlayback() {
  const hasSound = appSettings.ambientSound !== 'off';
  const workActive = timerState.isRunning && timerState.phase === 'work';
  const shouldPlay = hasSound && ambientWanted && (!appSettings.ambientWorkOnly || workActive);

  if (!shouldPlay) {
    stopAmbientAudio();
  } else if (!activeAmbient || activeAmbient.mode !== appSettings.ambientSound) {
    startAmbientAudio(appSettings.ambientSound);
  }
  updateAmbientUI();
}

function sendDesktopNotification(title, body) {
  if (!appSettings.notifications || !('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body });
  } catch {
    // Ignore environments/file:// contexts where Notification constructor throws
  }
}

// --- DOM ELEMENTS ---
const htmlDoc = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleLabel = document.getElementById('theme-toggle-label');
const modeBtns = document.querySelectorAll('.mode-btn');
const phaseTabBtns = document.querySelectorAll('.phase-tab');
const timerProgressBar = document.getElementById('timer-progress-bar');
const timeDisplay = document.getElementById('time-display');
const timerPhaseDisplay = document.getElementById('timer-phase');
const activeTaskBadge = document.getElementById('active-task-badge');
const activeTaskNameEl = document.getElementById('active-task-name');
const btnToggleTimer = document.getElementById('btn-toggle-timer');
const timerToggleIcon = document.getElementById('timer-toggle-icon');
const timerToggleLabel = document.getElementById('timer-toggle-label');
const btnSkip = document.getElementById('btn-skip');
const btnReset = document.getElementById('btn-reset');
const ambientSelect = document.getElementById('ambient-select');
const ambientVolumeSlider = document.getElementById('ambient-volume');
const btnAmbientToggle = document.getElementById('btn-ambient-toggle');
const ambientToggleIcon = document.getElementById('ambient-toggle-icon');
const ambientToggleLabel = document.getElementById('ambient-toggle-label');

// Tasks DOM
const taskList = document.getElementById('task-list');
const projectFilter = document.getElementById('project-filter');
const btnShowAddTask = document.getElementById('btn-show-add-task');
const addTaskContainer = document.getElementById('add-task-container');
const btnCancelTask = document.getElementById('btn-cancel-task');
const btnSaveTask = document.getElementById('btn-save-task');

// Task Form Fields (Add)
const inputTitle = document.getElementById('task-title');
const inputEst = document.getElementById('task-est');
const btnAddNote = document.getElementById('btn-add-note');
const btnAddProject = document.getElementById('btn-add-project');
const inputNote = document.getElementById('task-note');
const inputProject = document.getElementById('task-project');

// Dropdown DOM
const btnTaskOptions = document.getElementById('btn-task-options');
const taskDropdownMenu = document.getElementById('task-dropdown-menu');

const summaryPomos = document.getElementById('summary-pomos');
const summaryFinish = document.getElementById('summary-finish');

// Settings & Analytics DOM
const inputWorkMins = document.getElementById('setting-work-mins');
const inputShortMins = document.getElementById('setting-short-mins');
const inputLongMins = document.getElementById('setting-long-mins');
const inputLongInterval = document.getElementById('setting-long-interval');
const inputDailyGoal = document.getElementById('setting-daily-goal');
const inputAlarmSound = document.getElementById('setting-alarm-sound');
const volSlider = document.getElementById('volume-slider');
const btnTestSound = document.getElementById('btn-test-sound');
const toggleTicking = document.getElementById('toggle-ticking');
const tickingVolumeSlider = document.getElementById('ticking-volume-slider');
const btnTestTick = document.getElementById('btn-test-tick');
const toggleAmbientWorkOnly = document.getElementById('toggle-ambient-work-only');
const toggleNotif = document.getElementById('toggle-notif');
const toggleAutoStart = document.getElementById('toggle-autostart');
const toggleAutoStartWork = document.getElementById('toggle-autostart-work');
const toggleAutoSwitchTask = document.getElementById('toggle-autoswitch-task');

const analyticsRangeTabs = document.querySelectorAll('.range-tab');
const statSessions = document.getElementById('stat-sessions');
const statSessionsLabel = document.getElementById('stat-sessions-label');
const statMinutes = document.getElementById('stat-minutes');
const statMinutesLabel = document.getElementById('stat-minutes-label');
const statStreak = document.getElementById('stat-streak');
const statStreakLabel = document.getElementById('stat-streak-label');
const goalLabelText = document.getElementById('goal-label-text');
const goalStatusText = document.getElementById('goal-status-text');
const goalProgressBar = document.getElementById('goal-progress-bar');
const chartTitleEl = document.getElementById('chart-title');
const chartMetaEl = document.getElementById('chart-meta');
const analyticsChartEl = document.getElementById('analytics-chart');
const projectBreakdownMetaEl = document.getElementById('project-breakdown-meta');
const projectStackedBarEl = document.getElementById('project-stacked-bar');
const projectBreakdownListEl = document.getElementById('project-breakdown-list');
const btnToggleSessionLog = document.getElementById('btn-toggle-session-log');
const sessionLogLabel = document.getElementById('session-log-label');
const btnExportCsv = document.getElementById('btn-export-csv');
const btnExportJson = document.getElementById('btn-export-json');
const analyticsExportStatusEl = document.getElementById('analytics-export-status');
const sessionLogListEl = document.getElementById('session-log-list');

// --- INITIALIZATION ---
function init() {
  const fallbackPreset = PRESETS[timerState.intensity] || PRESETS[1];
  const rawDurations = appSettings.durations || {};
  appSettings.durations = {
    work: clampWholeNumber(rawDurations.work, DURATION_LIMITS.work.min, DURATION_LIMITS.work.max, fallbackPreset.work),
    shortBreak: clampWholeNumber(rawDurations.shortBreak, DURATION_LIMITS.shortBreak.min, DURATION_LIMITS.shortBreak.max, fallbackPreset.shortBreak),
    longBreak: clampWholeNumber(rawDurations.longBreak, DURATION_LIMITS.longBreak.min, DURATION_LIMITS.longBreak.max, fallbackPreset.longBreak)
  };
  appSettings.longBreakInterval = clampWholeNumber(
    appSettings.longBreakInterval,
    DURATION_LIMITS.longBreakInterval.min,
    DURATION_LIMITS.longBreakInterval.max,
    4
  );
  appSettings.dailyGoal = clampWholeNumber(
    appSettings.dailyGoal,
    DURATION_LIMITS.dailyGoal.min,
    DURATION_LIMITS.dailyGoal.max,
    6
  );
  if (!VALID_ALARM_SOUNDS.includes(appSettings.alarmSound)) appSettings.alarmSound = 'bell';
  if (!VALID_AMBIENT_SOUNDS.includes(appSettings.ambientSound)) appSettings.ambientSound = 'off';
  appSettings.volume = clampVolume(appSettings.volume, 0.5);
  appSettings.tickingVolume = clampVolume(appSettings.tickingVolume, 0.3);
  appSettings.ambientVolume = clampVolume(appSettings.ambientVolume, 0.35);
  appSettings.tickingEnabled = Boolean(appSettings.tickingEnabled);
  appSettings.ambientWorkOnly = Boolean(appSettings.ambientWorkOnly);
  if (appSettings.ambientSound !== 'off' && appSettings.ambientWorkOnly) {
    ambientWanted = true;
  }

  timerState.intensity = findMatchingPreset(appSettings.durations);
  if (!VALID_PHASES.includes(timerState.phase)) timerState.phase = 'work';
  if (typeof timerState.remainingSeconds !== 'number' || !Number.isFinite(timerState.remainingSeconds) || timerState.remainingSeconds <= 0) {
    timerState.remainingSeconds = getPhaseSeconds(timerState.phase);
  }
  if (typeof timerState.completedWorkSessions !== 'number' || timerState.completedWorkSessions < 0) {
    timerState.completedWorkSessions = 0;
  }
  if (activeTaskId && !tasks.some(t => t.id === activeTaskId)) {
    activeTaskId = null;
    safeSetStorage('activeTaskId', '');
  }

  checkDailyStatsReset();
  applyTheme(theme);
  loadSettings();
  updateAmbientUI();
  renderTasks();
  updateStatsDisplay();
  updateModeButtons();
  updatePhaseTabs();
  if (timerState.isRunning) {
    timerState.isRunning = false;
    saveTimerState();
  }
  updateDisplay();
}

function checkDailyStatsReset() {
  const today = new Date().toDateString();
  if (dailyStats.date !== today) {
    dailyStats = { date: today, sessions: 0, minutes: 0 };
    saveDailyStats();
  }
}

function saveDailyStats() {
  safeSetStorage('dailyStats', JSON.stringify(dailyStats));
  updateStatsDisplay();
}

function saveSessionHistory() {
  safeSetStorage('sessionHistory', JSON.stringify(sessionHistory));
}

function recordCompletedSession(minutes, task) {
  const now = new Date();
  sessionHistory.push({
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    completedAt: now.getTime(),
    dateKey: getLocalDateKey(now),
    hour: now.getHours(),
    minutes: Math.max(1, Math.round(minutes)),
    taskId: task ? task.id : null,
    taskTitle: task && task.title ? task.title : 'Unassigned',
    project: task && task.project ? task.project.trim() : ''
  });
  saveSessionHistory();
}

function deleteSessionLog(entryId) {
  const idx = sessionHistory.findIndex(e => e.id === entryId);
  if (idx === -1) return;
  if (!confirm('Remove this logged session from analytics history?')) return;
  const [removed] = sessionHistory.splice(idx, 1);
  saveSessionHistory();

  if (removed.dateKey === getLocalDateKey()) {
    checkDailyStatsReset();
    dailyStats.sessions = Math.max(0, dailyStats.sessions - 1);
    dailyStats.minutes = Math.max(0, dailyStats.minutes - removed.minutes);
    saveDailyStats();
  } else {
    renderAnalytics();
  }
}

function getProjectColor(projectName) {
  if (!projectName || projectName === 'No Project' || projectName === 'Earlier Today (Unlogged)') {
    return NO_PROJECT_COLOR;
  }
  let hash = 0;
  for (let i = 0; i < projectName.length; i++) {
    hash = ((hash << 5) - hash) + projectName.charCodeAt(i);
    hash |= 0;
  }
  return PROJECT_COLORS[Math.abs(hash) % PROJECT_COLORS.length];
}

function formatDurationSummary(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatClockTime(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function buildDailyTotals(today) {
  const dailyMap = new Map();
  sessionHistory.forEach(entry => {
    const bucket = dailyMap.get(entry.dateKey) || { sessions: 0, minutes: 0 };
    bucket.sessions += 1;
    bucket.minutes += entry.minutes;
    dailyMap.set(entry.dateKey, bucket);
  });

  const todayKey = getLocalDateKey(today);
  if (dailyStats.date === today.toDateString()) {
    const loggedToday = dailyMap.get(todayKey) || { sessions: 0, minutes: 0 };
    dailyMap.set(todayKey, {
      sessions: Math.max(loggedToday.sessions, dailyStats.sessions),
      minutes: Math.max(loggedToday.minutes, dailyStats.minutes)
    });
  }
  return dailyMap;
}

function computeStreaks(dailyMap, goal, today) {
  const todayKey = getLocalDateKey(today);
  let pastStreak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12, 0, 0);

  while (true) {
    const key = getLocalDateKey(cursor);
    const bucket = dailyMap.get(key);
    if (!bucket || bucket.sessions < goal) break;
    pastStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const todayMet = (dailyMap.get(todayKey)?.sessions || 0) >= goal;
  const current = pastStreak + (todayMet ? 1 : 0);

  const metKeys = [];
  dailyMap.forEach((bucket, key) => {
    if (bucket.sessions >= goal) metKeys.push(key);
  });
  metKeys.sort();

  let best = current;
  let run = 0;
  let prevDate = null;
  metKeys.forEach(key => {
    const d = parseDateKey(key);
    if (!d) return;
    if (prevDate) {
      const nextExpected = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() + 1, 12, 0, 0);
      run = getLocalDateKey(nextExpected) === key ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prevDate = d;
  });

  return { current, best, todayMet };
}

function getWeekDates(today) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset, 12, 0, 0);
    days.push({
      dateKey: getLocalDateKey(d),
      shortLabel: offset === 0 ? 'Today' : dayNames[d.getDay()],
      isToday: offset === 0
    });
  }
  return days;
}

function renderHourlyChart(logs, today) {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, sessions: 0, minutes: 0 }));
  logs.forEach(entry => {
    const h = Number(entry.hour);
    if (h >= 0 && h < 24) {
      buckets[h].sessions += 1;
      buckets[h].minutes += entry.minutes;
    }
  });

  const maxMinutes = Math.max(...buckets.map(b => b.minutes), 0);
  const currentHour = today.getHours();
  let peakBucket = null;
  buckets.forEach(b => {
    if (b.minutes > 0 && (!peakBucket || b.minutes > peakBucket.minutes)) {
      peakBucket = b;
    }
  });

  chartTitleEl.textContent = 'Hourly Focus';
  chartMetaEl.textContent = peakBucket
    ? `Peak: ${String(peakBucket.hour).padStart(2, '0')}:00 · ${formatDurationSummary(peakBucket.minutes)}`
    : 'No sessions logged yet';

  const barsHtml = buckets.map(b => {
    const heightPct = maxMinutes > 0 && b.minutes > 0 ? Math.max(14, Math.round((b.minutes / maxMinutes) * 100)) : 0;
    const heightStyle = heightPct > 0 ? `height: ${heightPct}%` : 'height: 3px';
    const hourStr = String(b.hour).padStart(2, '0');
    const tooltip = b.sessions > 0
      ? `${hourStr}:00–${hourStr}:59 · ${b.minutes}m (${b.sessions} sess)`
      : `${hourStr}:00 · No sessions`;
    return `
      <div class="hour-bar-col">
        <div class="hour-bar-fill ${b.minutes > 0 ? 'has-data' : ''} ${b.hour === currentHour ? 'is-current-hour' : ''}"
          style="${heightStyle}"
          title="${escapeHtml(tooltip)}"></div>
      </div>
    `;
  }).join('');

  analyticsChartEl.innerHTML = `
    <div class="hourly-bars">${barsHtml}</div>
    <div class="hourly-axis">
      <span>00</span>
      <span>06</span>
      <span>12</span>
      <span>18</span>
      <span>23</span>
    </div>
  `;
}

function renderWeekChart(weekDays, dailyMap, goal) {
  const enriched = weekDays.map(day => {
    const bucket = dailyMap.get(day.dateKey) || { sessions: 0, minutes: 0 };
    return { ...day, sessions: bucket.sessions, minutes: bucket.minutes };
  });

  const maxSessions = Math.max(...enriched.map(d => d.sessions), 0);
  const scaleMax = Math.max(goal, maxSessions, 1);
  const goalLinePct = Math.min(100, Math.round((goal / scaleMax) * 100));

  let bestDay = null;
  enriched.forEach(d => {
    if (d.sessions > 0 && (!bestDay || d.sessions > bestDay.sessions)) {
      bestDay = d;
    }
  });

  chartTitleEl.textContent = 'Last 7 Days';
  chartMetaEl.textContent = bestDay
    ? `Best: ${bestDay.shortLabel} · ${bestDay.sessions} sess (${formatDurationSummary(bestDay.minutes)})`
    : 'No sessions in last 7 days';

  const countsHtml = enriched.map(d => `<span class="week-bar-count">${d.sessions > 0 ? d.sessions : ''}</span>`).join('');
  const barsHtml = enriched.map(d => {
    const heightPct = d.sessions > 0 ? Math.max(12, Math.round((d.sessions / scaleMax) * 100)) : 0;
    const heightStyle = heightPct > 0 ? `height: ${heightPct}%` : 'height: 3px';
    const metClass = d.sessions >= goal ? 'goal-met' : (d.sessions > 0 ? 'has-data' : '');
    const tooltip = `${d.dateKey}: ${d.sessions} sess (${formatDurationSummary(d.minutes)})`;
    return `
      <div class="week-bar-col">
        <div class="week-bar-fill ${metClass}" style="${heightStyle}" title="${escapeHtml(tooltip)}"></div>
      </div>
    `;
  }).join('');
  const labelsHtml = enriched.map(d => `<span class="${d.isToday ? 'is-today' : ''}">${d.shortLabel}</span>`).join('');

  analyticsChartEl.innerHTML = `
    <div class="week-counts">${countsHtml}</div>
    <div class="week-chart-wrap">
      <div class="week-goal-line" style="bottom: ${goalLinePct}%" title="Daily goal: ${goal} sessions"></div>
      <div class="week-bars">${barsHtml}</div>
    </div>
    <div class="week-labels">${labelsHtml}</div>
  `;
}

function renderProjectBreakdown(logs, totalSessions, totalMinutes) {
  const projectMap = new Map();
  let loggedMinutes = 0;

  logs.forEach(entry => {
    const name = entry.project || 'No Project';
    const bucket = projectMap.get(name) || { name, minutes: 0, sessions: 0 };
    bucket.minutes += entry.minutes;
    bucket.sessions += 1;
    loggedMinutes += entry.minutes;
    projectMap.set(name, bucket);
  });

  const untrackedSessions = totalSessions - logs.length;
  const untrackedMinutes = Math.max(0, totalMinutes - loggedMinutes);
  if (untrackedSessions > 0) {
    const label = 'Earlier Today (Unlogged)';
    const existing = projectMap.get(label) || { name: label, minutes: 0, sessions: 0 };
    existing.sessions += untrackedSessions;
    existing.minutes += untrackedMinutes;
    projectMap.set(label, existing);
  }

  const items = Array.from(projectMap.values()).sort((a, b) => b.minutes - a.minutes || b.sessions - a.sessions);
  const sumMinutes = items.reduce((acc, item) => acc + item.minutes, 0);
  projectBreakdownMetaEl.textContent = `${formatDurationSummary(sumMinutes)} total`;

  if (items.length === 0 || sumMinutes === 0) {
    projectStackedBarEl.classList.add('hidden');
    projectStackedBarEl.innerHTML = '';
    projectBreakdownListEl.innerHTML = '<li class="project-breakdown-empty">Complete a work session to see your focus breakdown.</li>';
    return;
  }

  projectStackedBarEl.classList.remove('hidden');
  projectStackedBarEl.innerHTML = items.map(item => {
    const pct = Math.max(2, (item.minutes / sumMinutes) * 100);
    const color = getProjectColor(item.name);
    return `<div class="project-stack-segment" style="width: ${pct.toFixed(1)}%; background-color: ${color};" title="${escapeHtml(item.name)}: ${formatDurationSummary(item.minutes)}"></div>`;
  }).join('');

  projectBreakdownListEl.innerHTML = items.map(item => {
    const pct = Math.round((item.minutes / sumMinutes) * 100);
    const color = getProjectColor(item.name);
    return `
      <li class="project-breakdown-row">
        <div class="project-breakdown-left">
          <span class="project-color-dot" style="background-color: ${color};"></span>
          <span class="project-breakdown-name">${escapeHtml(item.name)}</span>
        </div>
        <span class="project-breakdown-stats">${pct}% · ${formatDurationSummary(item.minutes)} (${item.sessions})</span>
      </li>
    `;
  }).join('');
}

function renderSessionLogList(logs) {
  const ordered = [...logs].sort((a, b) => b.completedAt - a.completedAt);
  sessionLogLabel.textContent = `Session Log (${ordered.length})`;
  btnToggleSessionLog.setAttribute('aria-expanded', String(isSessionLogOpen));
  sessionLogListEl.classList.toggle('hidden', !isSessionLogOpen);

  if (!isSessionLogOpen) return;

  if (ordered.length === 0) {
    sessionLogListEl.innerHTML = '<li class="session-log-empty">No completed focus sessions in this range yet.</li>';
    return;
  }

  sessionLogListEl.innerHTML = ordered.map(entry => {
    const timeLabel = analyticsRange === 'week'
      ? `${entry.dateKey.slice(5)} ${formatClockTime(entry.completedAt)}`
      : formatClockTime(entry.completedAt);
    const projectHtml = entry.project
      ? `<span class="session-log-project">${escapeHtml(entry.project)}</span>`
      : '';
    return `
      <li class="session-log-item">
        <div class="session-log-main">
          <span class="session-log-time">${escapeHtml(timeLabel)}</span>
          <span class="session-log-title">${escapeHtml(entry.taskTitle)}</span>
          ${projectHtml}
        </div>
        <div class="session-log-right">
          <span class="session-log-mins">+${entry.minutes}m</span>
          <button type="button" class="session-log-delete" data-session-id="${escapeHtml(entry.id)}" title="Remove log entry" aria-label="Remove log entry">${ICONS.close}</button>
        </div>
      </li>
    `;
  }).join('');
}

function renderAnalytics() {
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const dailyMap = buildDailyTotals(today);
  const goal = appSettings.dailyGoal;
  const streaks = computeStreaks(dailyMap, goal, today);

  analyticsRangeTabs.forEach(tab => {
    const isActive = tab.dataset.range === analyticsRange;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  if (analyticsRange === 'today') {
    const logs = sessionHistory.filter(e => e.dateKey === todayKey);
    const totalSessions = Math.max(logs.length, dailyStats.date === today.toDateString() ? dailyStats.sessions : 0);
    const totalMinutes = Math.max(
      logs.reduce((acc, e) => acc + e.minutes, 0),
      dailyStats.date === today.toDateString() ? dailyStats.minutes : 0
    );

    statSessions.textContent = totalSessions;
    statSessionsLabel.textContent = 'Sessions Today';
    statMinutes.textContent = totalMinutes;
    statMinutesLabel.textContent = 'Focus Minutes';
    statStreak.textContent = `${streaks.current}d`;
    statStreakLabel.textContent = `Streak (Best ${streaks.best}d)`;

    const goalPct = Math.min(100, Math.round((totalSessions / goal) * 100));
    goalLabelText.textContent = 'Daily Goal';
    goalStatusText.textContent = totalSessions >= goal
      ? `${totalSessions} / ${goal} pomos · Goal met!`
      : `${totalSessions} / ${goal} pomos (${goalPct}%)`;
    goalProgressBar.style.width = `${goalPct}%`;
    goalProgressBar.classList.toggle('reached', totalSessions >= goal);

    renderHourlyChart(logs, today);
    renderProjectBreakdown(logs, totalSessions, totalMinutes);
    renderSessionLogList(logs);
  } else {
    const weekDays = getWeekDates(today);
    const weekKeys = new Set(weekDays.map(d => d.dateKey));
    const logs = sessionHistory.filter(e => weekKeys.has(e.dateKey));

    let totalSessions = 0;
    let totalMinutes = 0;
    let goalDaysMet = 0;
    weekDays.forEach(d => {
      const bucket = dailyMap.get(d.dateKey);
      if (bucket) {
        totalSessions += bucket.sessions;
        totalMinutes += bucket.minutes;
        if (bucket.sessions >= goal) goalDaysMet += 1;
      }
    });

    const avgSessions = (totalSessions / 7).toFixed(1);
    statSessions.textContent = totalSessions;
    statSessionsLabel.textContent = '7-Day Sessions';
    statMinutes.textContent = totalMinutes;
    statMinutesLabel.textContent = '7-Day Minutes';
    statStreak.textContent = `${goalDaysMet}/7`;
    statStreakLabel.textContent = `Goal Days (Streak ${streaks.current}d)`;

    const avgRatio = (totalSessions / 7) / goal;
    const goalPct = Math.min(100, Math.round(avgRatio * 100));
    goalLabelText.textContent = 'Weekly Goal Pace';
    goalStatusText.textContent = `${avgSessions} / ${goal} avg/day (${goalPct}%)`;
    goalProgressBar.style.width = `${goalPct}%`;
    goalProgressBar.classList.toggle('reached', (totalSessions / 7) >= goal);

    renderWeekChart(weekDays, dailyMap, goal);
    renderProjectBreakdown(logs, totalSessions, totalMinutes);
    renderSessionLogList(logs);
  }
}

function updateStatsDisplay() {
  renderAnalytics();
}

function showExportStatus(message) {
  analyticsExportStatusEl.textContent = message;
  analyticsExportStatusEl.classList.remove('hidden');
  clearTimeout(exportStatusTimeout);
  exportStatusTimeout = setTimeout(() => {
    analyticsExportStatusEl.classList.add('hidden');
  }, 3500);
}

function escapeCsvCell(value) {
  const str = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportSessionsCsv() {
  if (sessionHistory.length === 0) {
    showExportStatus('No completed work sessions logged yet.');
    return;
  }
  const ordered = [...sessionHistory].sort((a, b) => a.completedAt - b.completedAt);
  const rows = [
    ['id', 'date', 'time', 'completedAtISO', 'durationMinutes', 'taskTitle', 'project'].join(',')
  ];
  ordered.forEach(entry => {
    rows.push([
      escapeCsvCell(entry.id),
      escapeCsvCell(entry.dateKey),
      escapeCsvCell(formatClockTime(entry.completedAt)),
      escapeCsvCell(new Date(entry.completedAt).toISOString()),
      escapeCsvCell(entry.minutes),
      escapeCsvCell(entry.taskTitle),
      escapeCsvCell(entry.project || '')
    ].join(','));
  });
  downloadFile(`pomodoro-sessions-${getLocalDateKey()}.csv`, rows.join('\n'), 'text/csv;charset=utf-8;');
  showExportStatus(`Exported ${ordered.length} session(s) to CSV.`);
}

function exportAnalyticsJson() {
  const today = new Date();
  if (sessionHistory.length === 0 && dailyStats.sessions === 0) {
    showExportStatus('No completed work sessions logged yet.');
    return;
  }
  const dailyMap = buildDailyTotals(today);
  const dailySummary = [];
  Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([dateKey, bucket]) => {
    dailySummary.push({ date: dateKey, ...bucket });
  });
  const payload = {
    exportedAt: today.toISOString(),
    dailyGoal: appSettings.dailyGoal,
    todayStats: dailyStats,
    streaks: computeStreaks(dailyMap, appSettings.dailyGoal, today),
    dailySummary,
    sessions: [...sessionHistory].sort((a, b) => a.completedAt - b.completedAt)
  };
  downloadFile(`pomodoro-analytics-${getLocalDateKey(today)}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8;');
  showExportStatus(`Exported ${sessionHistory.length} session(s) to JSON.`);
}

function loadSettings() {
  inputWorkMins.value = appSettings.durations.work;
  inputShortMins.value = appSettings.durations.shortBreak;
  inputLongMins.value = appSettings.durations.longBreak;
  inputLongInterval.value = appSettings.longBreakInterval;
  inputDailyGoal.value = appSettings.dailyGoal;
  inputAlarmSound.value = appSettings.alarmSound;
  volSlider.value = appSettings.volume;
  toggleTicking.checked = Boolean(appSettings.tickingEnabled);
  tickingVolumeSlider.value = appSettings.tickingVolume;
  ambientSelect.value = appSettings.ambientSound;
  ambientVolumeSlider.value = appSettings.ambientVolume;
  toggleAmbientWorkOnly.checked = Boolean(appSettings.ambientWorkOnly);
  toggleNotif.checked = Boolean(appSettings.notifications);
  toggleAutoStart.checked = Boolean(appSettings.autoStart);
  toggleAutoStartWork.checked = Boolean(appSettings.autoStartWork);
  toggleAutoSwitchTask.checked = Boolean(appSettings.autoSwitchTask);
}

function saveSettings() {
  safeSetStorage('appSettings', JSON.stringify(appSettings));
}

function bindDurationInput(inputEl, phaseKey) {
  const { min, max } = DURATION_LIMITS[phaseKey];
  inputEl.addEventListener('change', () => {
    const oldSeconds = getPhaseSeconds(phaseKey);
    const nextMins = clampWholeNumber(inputEl.value.trim(), min, max, appSettings.durations[phaseKey]);
    inputEl.value = nextMins;
    appSettings.durations[phaseKey] = nextMins;
    timerState.intensity = findMatchingPreset(appSettings.durations);
    saveSettings();
    updateModeButtons();

    const newSeconds = nextMins * 60;
    if (
      timerState.phase === phaseKey &&
      !timerState.isRunning &&
      (timerState.remainingSeconds === oldSeconds || timerState.remainingSeconds > newSeconds)
    ) {
      timerState.remainingSeconds = newSeconds;
      updateDisplay();
    }
    saveTimerState();
    updateTaskSummary();
  });
}

// Settings Listeners
bindDurationInput(inputWorkMins, 'work');
bindDurationInput(inputShortMins, 'shortBreak');
bindDurationInput(inputLongMins, 'longBreak');

inputLongInterval.addEventListener('change', () => {
  const { min, max } = DURATION_LIMITS.longBreakInterval;
  const nextInterval = clampWholeNumber(inputLongInterval.value.trim(), min, max, appSettings.longBreakInterval);
  inputLongInterval.value = nextInterval;
  appSettings.longBreakInterval = nextInterval;
  saveSettings();
  updateDisplay();
  updateTaskSummary();
});

inputDailyGoal.addEventListener('change', () => {
  const { min, max } = DURATION_LIMITS.dailyGoal;
  const nextGoal = clampWholeNumber(inputDailyGoal.value.trim(), min, max, appSettings.dailyGoal);
  inputDailyGoal.value = nextGoal;
  appSettings.dailyGoal = nextGoal;
  saveSettings();
  renderAnalytics();
});

analyticsRangeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const nextRange = tab.dataset.range;
    if (!VALID_ANALYTICS_RANGES.includes(nextRange) || analyticsRange === nextRange) return;
    analyticsRange = nextRange;
    checkDailyStatsReset();
    renderAnalytics();
  });
});

btnToggleSessionLog.addEventListener('click', () => {
  isSessionLogOpen = !isSessionLogOpen;
  renderAnalytics();
});

sessionLogListEl.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.session-log-delete');
  if (!deleteBtn) return;
  deleteSessionLog(deleteBtn.dataset.sessionId);
});

btnExportCsv.addEventListener('click', exportSessionsCsv);
btnExportJson.addEventListener('click', exportAnalyticsJson);

inputAlarmSound.addEventListener('change', (e) => {
  const chosen = e.target.value;
  if (!VALID_ALARM_SOUNDS.includes(chosen)) return;
  appSettings.alarmSound = chosen;
  saveSettings();
  playAlarmSound();
});

volSlider.addEventListener('input', (e) => {
  appSettings.volume = clampVolume(e.target.value, 0.5);
  saveSettings();
});
btnTestSound.addEventListener('click', playAlarmSound);

toggleTicking.addEventListener('change', (e) => {
  appSettings.tickingEnabled = e.target.checked;
  saveSettings();
  if (appSettings.tickingEnabled) playTickSound(0, true);
});

tickingVolumeSlider.addEventListener('input', (e) => {
  appSettings.tickingVolume = clampVolume(e.target.value, 0.3);
  saveSettings();
});

btnTestTick.addEventListener('click', () => {
  playTickSound(0, true);
  setTimeout(() => playTickSound(1, true), 220);
});

ambientSelect.addEventListener('change', (e) => {
  const chosen = e.target.value;
  if (!VALID_AMBIENT_SOUNDS.includes(chosen)) return;
  appSettings.ambientSound = chosen;
  ambientWanted = chosen !== 'off';
  saveSettings();
  syncAmbientPlayback();
});

ambientVolumeSlider.addEventListener('input', (e) => {
  const nextVol = clampVolume(e.target.value, 0.35);
  appSettings.ambientVolume = nextVol;
  saveSettings();
  if (activeAmbient) {
    try {
      activeAmbient.masterGain.gain.setTargetAtTime(Math.max(0.0001, nextVol), activeAmbient.ctx.currentTime, 0.03);
    } catch {}
  }
});

btnAmbientToggle.addEventListener('click', () => {
  if (appSettings.ambientSound === 'off') return;
  ambientWanted = !ambientWanted;
  syncAmbientPlayback();
});

toggleAmbientWorkOnly.addEventListener('change', (e) => {
  appSettings.ambientWorkOnly = e.target.checked;
  if (appSettings.ambientWorkOnly && appSettings.ambientSound !== 'off') {
    ambientWanted = true;
  } else if (!appSettings.ambientWorkOnly && !activeAmbient) {
    ambientWanted = false;
  }
  saveSettings();
  syncAmbientPlayback();
});
toggleNotif.addEventListener('change', (e) => {
  if (!e.target.checked) {
    appSettings.notifications = false;
    saveSettings();
    return;
  }
  if (!('Notification' in window)) {
    e.target.checked = false;
    appSettings.notifications = false;
    saveSettings();
    alert('Desktop notifications are not supported in this browser.');
    return;
  }
  Promise.resolve(Notification.requestPermission()).then(perm => {
    if (perm === 'granted') {
      appSettings.notifications = true;
      new Notification('Permission Granted', { body: 'Notifications are ready!' });
    } else {
      e.target.checked = false;
      appSettings.notifications = false;
      alert('Notification permission denied by browser.');
    }
    saveSettings();
  }).catch(() => {
    e.target.checked = false;
    appSettings.notifications = false;
    saveSettings();
  });
});
toggleAutoStart.addEventListener('change', (e) => {
  appSettings.autoStart = e.target.checked;
  saveSettings();
});
toggleAutoStartWork.addEventListener('change', (e) => {
  appSettings.autoStartWork = e.target.checked;
  saveSettings();
});
toggleAutoSwitchTask.addEventListener('change', (e) => {
  appSettings.autoSwitchTask = e.target.checked;
  saveSettings();
});

function applyTheme(selectedTheme) {
  theme = selectedTheme === 'dark' ? 'dark' : 'light';
  htmlDoc.setAttribute('data-theme', theme);
  themeToggleIcon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  themeToggleLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  safeSetStorage('theme', theme);
}
themeToggleBtn.addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));

function updateTimerToggleButton() {
  const totalSeconds = getPhaseSeconds(timerState.phase);
  const isMidway = !timerState.isRunning && timerState.remainingSeconds > 0 && timerState.remainingSeconds < totalSeconds;

  btnToggleTimer.classList.toggle('is-running', timerState.isRunning);
  btnToggleTimer.setAttribute('aria-pressed', String(timerState.isRunning));
  if (timerState.isRunning) {
    btnToggleTimer.title = 'Pause Timer (Space)';
    timerToggleIcon.innerHTML = ICONS.pause;
    timerToggleLabel.textContent = 'Pause';
  } else {
    btnToggleTimer.title = isMidway ? 'Resume Timer (Space)' : 'Start Timer (Space)';
    timerToggleIcon.innerHTML = ICONS.play;
    timerToggleLabel.textContent = isMidway ? 'Resume' : 'Start';
  }
}

function updateActiveTaskBadge() {
  const activeTask = tasks.find(t => t.id === activeTaskId);
  if (activeTask) {
    activeTaskBadge.classList.remove('is-empty');
    activeTaskBadge.classList.toggle('is-completed', Boolean(activeTask.isCompleted));
    activeTaskNameEl.textContent = activeTask.title;
    activeTaskBadge.title = activeTask.project
      ? `Focusing on: ${activeTask.title} (${activeTask.project})`
      : `Focusing on: ${activeTask.title}`;
  } else {
    activeTaskBadge.classList.add('is-empty');
    activeTaskBadge.classList.remove('is-completed');
    activeTaskNameEl.textContent = tasks.length > 0 ? 'Select a task below' : 'No task selected';
    activeTaskBadge.title = tasks.length > 0 ? 'Click to jump to tasks' : 'Click to add a task';
  }
}

activeTaskBadge.addEventListener('click', () => {
  if (tasks.length === 0) {
    btnShowAddTask.click();
    return;
  }
  const activeEl = taskList.querySelector('.task-item.active');
  const target = activeEl || document.querySelector('.task-section');
  if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (activeEl) {
    activeEl.classList.remove('pulse-highlight');
    void activeEl.offsetWidth;
    activeEl.classList.add('pulse-highlight');
  }
});

// --- TIMER LOGIC ---
function startTimer() {
  if (timerState.isRunning) return;
  checkDailyStatsReset();
  getAudioContext();
  timerState.isRunning = true;
  targetEndTime = Date.now() + (timerState.remainingSeconds * 1000);
  updateTimerToggleButton();
  syncAmbientPlayback();
  timerInterval = setInterval(() => {
    const secondsLeft = Math.ceil((targetEndTime - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerState.remainingSeconds = 0;
      handleTimerComplete(false);
    } else if (secondsLeft !== timerState.remainingSeconds) {
      timerState.remainingSeconds = secondsLeft;
      saveTimerState();
      updateDisplay();
      if (timerState.phase === 'work') playTickSound(secondsLeft);
    }
  }, 200);
  saveTimerState();
}

function pauseTimer() {
  if (!timerState.isRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerState.isRunning = false;
  saveTimerState();
  updateDisplay();
  syncAmbientPlayback();
}

function skipTimer() {
  pauseTimer();
  handleTimerComplete(true);
}

function resetTimer() {
  pauseTimer();
  timerState.remainingSeconds = getPhaseSeconds(timerState.phase);
  saveTimerState();
  updateDisplay();
  syncAmbientPlayback();
}

function switchPhase(phase) {
  if (!VALID_PHASES.includes(phase)) return;
  pauseTimer();
  timerState.phase = phase;
  timerState.remainingSeconds = getPhaseSeconds(phase);
  updatePhaseTabs();
  saveTimerState();
  updateDisplay();
  syncAmbientPlayback();
}

function handleTimerComplete(isSkipped = false) {
  timerState.isRunning = false;
  if (!isSkipped) playAlarmSound();

  let notifBody = '';
  let isEnteringBreak = false;

  if (timerState.phase === 'work') {
    if (!isSkipped) {
      checkDailyStatsReset();
      const workMins = appSettings.durations.work;
      const activeTask = tasks.find(t => t.id === activeTaskId);
      recordCompletedSession(workMins, activeTask);
      dailyStats.sessions++;
      dailyStats.minutes += workMins;
      saveDailyStats();
      timerState.completedWorkSessions++;

      if (activeTask) {
        activeTask.completedPomodoros = (activeTask.completedPomodoros || 0) + 1;
        saveTasks();
        // Avoid wiping unsaved text if user is actively editing a task inline
        if (!editingTaskId) {
          renderTasks();
        } else {
          if (editingTaskId === activeTask.id) {
            const openActInput = taskList.querySelector('.task-act-input');
            if (openActInput) openActInput.value = activeTask.completedPomodoros;
          }
          updateTaskSummary();
        }
      }

      const interval = appSettings.longBreakInterval;
      timerState.phase = timerState.completedWorkSessions % interval === 0 ? 'longBreak' : 'shortBreak';
    } else {
      timerState.phase = 'shortBreak';
    }
    notifBody = 'Work done! Time for a break.';
    isEnteringBreak = true;
  } else {
    timerState.phase = 'work';
    notifBody = "Break is over! Let's focus.";
  }

  if (!isSkipped) sendDesktopNotification('Pomodoro Timer', notifBody);

  timerState.remainingSeconds = getPhaseSeconds(timerState.phase);
  updatePhaseTabs();
  saveTimerState();
  updateDisplay();
  updateTaskSummary();
  syncAmbientPlayback();

  if (isEnteringBreak && appSettings.autoStart) {
    startTimer();
  } else if (!isEnteringBreak && appSettings.autoStartWork) {
    startTimer();
  }
}

function setIntensityMode(intensity) {
  const preset = PRESETS[intensity];
  if (!preset) return;
  pauseTimer();
  timerState.intensity = intensity;
  appSettings.durations = { ...preset };
  saveSettings();
  loadSettings();

  timerState.remainingSeconds = getPhaseSeconds(timerState.phase);
  updateModeButtons();
  updatePhaseTabs();
  saveTimerState();
  updateDisplay();
  updateTaskSummary();
}

function updateModeButtons() {
  modeBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.intensity, 10) === timerState.intensity);
  });
}

function updatePhaseTabs() {
  htmlDoc.setAttribute('data-phase', timerState.phase);
  phaseTabBtns.forEach(btn => {
    const isActive = btn.dataset.phase === timerState.phase;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
}

function updateDisplay() {
  const mins = Math.floor(timerState.remainingSeconds / 60);
  const secs = timerState.remainingSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  timeDisplay.textContent = timeString;

  const interval = appSettings.longBreakInterval;
  let phaseText = '';
  let shortPhaseTitle = 'Work';
  if (timerState.phase === 'work') {
    const cyclePos = (timerState.completedWorkSessions % interval) + 1;
    phaseText = `Work Phase (Session ${timerState.completedWorkSessions + 1} · ${cyclePos}/${interval})`;
    shortPhaseTitle = 'Work';
  } else if (timerState.phase === 'shortBreak') {
    const cyclePos = timerState.completedWorkSessions > 0 ? ((timerState.completedWorkSessions - 1) % interval) + 1 : 0;
    phaseText = cyclePos > 0 ? `Short Break (${cyclePos}/${interval})` : 'Short Break';
    shortPhaseTitle = 'Short Break';
  } else {
    const isFullCycle = timerState.completedWorkSessions > 0 && timerState.completedWorkSessions % interval === 0;
    phaseText = isFullCycle ? `Long Break (${interval}/${interval})` : 'Long Break';
    shortPhaseTitle = 'Long Break';
  }

  timerPhaseDisplay.textContent = phaseText;

  const totalSeconds = getPhaseSeconds(timerState.phase);
  const elapsedPct = totalSeconds > 0
    ? Math.min(100, Math.max(0, ((totalSeconds - timerState.remainingSeconds) / totalSeconds) * 100))
    : 0;
  timerProgressBar.style.width = `${elapsedPct}%`;

  updateTimerToggleButton();
  document.title = `(${timeString}) ${shortPhaseTitle} · Pomodoro`;
}

function saveTimerState() {
  safeSetStorage('timerState', JSON.stringify(timerState));
}

btnToggleTimer.addEventListener('click', () => {
  if (timerState.isRunning) pauseTimer();
  else startTimer();
});
btnSkip.addEventListener('click', skipTimer);
btnReset.addEventListener('click', resetTimer);
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => setIntensityMode(parseInt(btn.dataset.intensity, 10)));
});
phaseTabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchPhase(btn.dataset.phase));
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!taskDropdownMenu.classList.contains('hidden')) {
      taskDropdownMenu.classList.add('hidden');
    } else if (editingTaskId) {
      cancelEdit();
    } else if (!addTaskContainer.classList.contains('hidden')) {
      resetTaskForm();
    }
    return;
  }

  if (e.code === 'Space' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const activeEl = document.activeElement;
    const tag = activeEl ? activeEl.tagName : '';
    const isInteractive = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'SUMMARY', 'A'].includes(tag) || Boolean(activeEl && activeEl.isContentEditable);
    if (isInteractive) return;
    e.preventDefault();
    if (timerState.isRunning) pauseTimer();
    else startTimer();
  }
});

// --- TASK MANAGEMENT ---
function parseWholeNumberInput(rawValue, minValue, fieldName, emptyValue) {
  const trimmed = String(rawValue).trim();
  if (!trimmed) return { valid: true, value: emptyValue };
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < minValue) {
    alert(`${fieldName} must be a whole number of at least ${minValue}.`);
    return { valid: false, value: emptyValue };
  }
  return { valid: true, value: parsed };
}

function getUniqueProjects() {
  const projects = [];
  tasks.forEach(t => {
    const project = (t.project || '').trim();
    if (project && !projects.includes(project)) projects.push(project);
  });
  return projects;
}

function getVisibleTasks() {
  if (!selectedProjectFilter) return tasks;
  return tasks.filter(t => (t.project || '').trim() === selectedProjectFilter);
}

function syncProjectFilter() {
  const projects = getUniqueProjects();
  if (selectedProjectFilter && !projects.includes(selectedProjectFilter)) {
    selectedProjectFilter = '';
  }

  projectFilter.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All Projects';
  projectFilter.appendChild(allOption);

  projects.forEach(proj => {
    const opt = document.createElement('option');
    opt.value = proj;
    opt.textContent = proj;
    projectFilter.appendChild(opt);
  });

  projectFilter.value = selectedProjectFilter;
  projectFilter.classList.toggle('hidden', projects.length === 0);
}

projectFilter.addEventListener('change', () => {
  selectedProjectFilter = projectFilter.value;
  editingTaskId = null;
  renderTasks();
});

function moveTask(id, direction) {
  const visibleTasks = getVisibleTasks();
  const visibleIdx = visibleTasks.findIndex(t => t.id === id);
  const targetVisibleIdx = visibleIdx + direction;
  if (visibleIdx === -1 || targetVisibleIdx < 0 || targetVisibleIdx >= visibleTasks.length) return;

  const fromIdx = tasks.findIndex(t => t.id === visibleTasks[visibleIdx].id);
  const toIdx = tasks.findIndex(t => t.id === visibleTasks[targetVisibleIdx].id);
  if (fromIdx === -1 || toIdx === -1) return;

  [tasks[fromIdx], tasks[toIdx]] = [tasks[toIdx], tasks[fromIdx]];
  saveTasks();
  renderTasks();
}

function bindExtraFieldToggle(toggleBtn, fieldEl) {
  toggleBtn.addEventListener('click', () => {
    fieldEl.classList.remove('hidden');
    toggleBtn.classList.add('hidden');
    fieldEl.focus();
  });
}

function bindFormEnterSubmit(inputs, onSubmit) {
  inputs.forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    });
  });
}

// 1. Dropdown Menu Logic
btnTaskOptions.addEventListener('click', (e) => {
  e.stopPropagation();
  taskDropdownMenu.classList.toggle('hidden');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown-wrapper')) {
    taskDropdownMenu.classList.add('hidden');
  }
});

const MENU_ACTIONS = {
  'menu-clear-finished': {
    prompt: 'Delete all finished tasks?',
    run: () => {
      tasks = tasks.filter(t => !t.isCompleted);
      saveTasks();
      renderTasks();
    }
  },
  'menu-clear-act': {
    prompt: 'Reset pomodoro count for all tasks?',
    run: () => {
      tasks.forEach(t => { t.completedPomodoros = 0; });
      saveTasks();
      renderTasks();
    }
  },
  'menu-uncheck-all': {
    prompt: 'Uncheck all completed tasks?',
    run: () => {
      tasks.forEach(t => { t.isCompleted = false; });
      saveTasks();
      renderTasks();
    }
  },
  'menu-delete-all': {
    prompt: 'Are you sure you want to delete ALL tasks?',
    run: () => {
      tasks = [];
      activeTaskId = null;
      editingTaskId = null;
      selectedProjectFilter = '';
      saveTasks();
      renderTasks();
    }
  },
  'menu-reset-all': {
    prompt: 'Reset ALL tasks, session, and stats?',
    run: () => {
      tasks = [];
      activeTaskId = null;
      editingTaskId = null;
      selectedProjectFilter = '';
      saveTasks();
      renderTasks();
      dailyStats = { date: new Date().toDateString(), sessions: 0, minutes: 0 };
      sessionHistory = [];
      saveSessionHistory();
      saveDailyStats();
      pauseTimer();
      timerState.phase = 'work';
      timerState.completedWorkSessions = 0;
      timerState.remainingSeconds = getPhaseSeconds('work');
      updatePhaseTabs();
      saveTimerState();
      updateDisplay();
      updateTaskSummary();
      syncAmbientPlayback();
    }
  }
};

taskDropdownMenu.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (!item) return;
  taskDropdownMenu.classList.add('hidden');
  const action = MENU_ACTIONS[item.id];
  if (action && confirm(action.prompt)) {
    action.run();
  }
});

// 2. Add Task Logic
btnShowAddTask.addEventListener('click', () => {
  if (editingTaskId) {
    editingTaskId = null;
    renderTasks();
  }
  btnShowAddTask.classList.add('hidden');
  addTaskContainer.classList.remove('hidden');
  if (selectedProjectFilter) {
    inputProject.value = selectedProjectFilter;
    inputProject.classList.remove('hidden');
    btnAddProject.classList.add('hidden');
  }
  inputTitle.focus();
});
btnCancelTask.addEventListener('click', () => {
  resetTaskForm();
});
bindExtraFieldToggle(btnAddNote, inputNote);
bindExtraFieldToggle(btnAddProject, inputProject);

function resetTaskForm() {
  inputTitle.value = '';
  inputEst.value = '';
  inputNote.value = '';
  inputProject.value = '';
  inputNote.classList.add('hidden');
  inputProject.classList.add('hidden');
  btnAddNote.classList.remove('hidden');
  btnAddProject.classList.remove('hidden');
  addTaskContainer.classList.add('hidden');
  btnShowAddTask.classList.remove('hidden');
}

function submitNewTask() {
  const titleVal = inputTitle.value.trim();
  if (!titleVal) {
    alert('Task title cannot be empty!');
    return;
  }
  const estResult = parseWholeNumberInput(inputEst.value, 1, 'Est Pomodoros', null);
  if (!estResult.valid) return;

  const projectVal = inputProject.value.trim();
  const newTask = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: titleVal,
    estPomodoros: estResult.value,
    completedPomodoros: 0,
    isCompleted: false,
    note: inputNote.value.trim(),
    project: projectVal
  };
  tasks.push(newTask);
  if (!activeTaskId) activeTaskId = newTask.id;
  if (selectedProjectFilter && projectVal !== selectedProjectFilter) {
    selectedProjectFilter = '';
  }
  saveTasks();
  renderTasks();
  resetTaskForm();
}

btnSaveTask.addEventListener('click', submitNewTask);
bindFormEnterSubmit([inputTitle, inputEst, inputProject], submitNewTask);

// 3. Render Tasks (Dengan Fitur Inline Edit)
function renderTasks() {
  syncProjectFilter();
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  visibleTasks.forEach((task, visibleIdx) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.id === activeTaskId ? 'active' : ''} ${task.isCompleted ? 'completed' : ''}`;

    if (editingTaskId === task.id) {
      li.classList.add('add-task-container', 'edit-mode-card');
      li.classList.remove('task-item');

      li.innerHTML = `
        <input type="text" class="task-title-input" required autocomplete="off">
        <div class="task-form-details">
          <div class="pomo-numbers-row">
            <div class="est-pomo-wrapper">
              <label>Act</label>
              <input type="number" class="task-est-input task-act-input" min="0" step="1">
            </div>
            <span class="pomo-slash">/</span>
            <div class="est-pomo-wrapper">
              <label>Est Pomodoros</label>
              <input type="number" class="task-est-input task-edit-est-input" min="1" step="1">
            </div>
          </div>
          <div class="extra-fields-toggles">
            <button type="button" class="link-btn btn-edit-note ${task.note ? 'hidden' : ''}">+ Add Note</button>
            <button type="button" class="link-btn btn-edit-project ${task.project ? 'hidden' : ''}">+ Add Project</button>
          </div>
          <textarea class="task-extra-input edit-note-input ${task.note ? '' : 'hidden'}" placeholder="Some notes..."></textarea>
          <input type="text" class="task-extra-input edit-project-input ${task.project ? '' : 'hidden'}" placeholder="Project name (e.g. Work)">
        </div>
        <div class="task-form-actions">
          <button type="button" class="text-btn danger-text btn-edit-delete">${ICONS.trash}<span>Delete</span></button>
          <div class="action-right-group">
            <button type="button" class="text-btn btn-edit-cancel">Cancel</button>
            <button type="button" class="solid-btn btn-edit-save">Save</button>
          </div>
        </div>
      `;

      const editTitleInput = li.querySelector('.task-title-input');
      const editActInput = li.querySelector('.task-act-input');
      const editEstInput = li.querySelector('.task-edit-est-input');
      const editNoteBtn = li.querySelector('.btn-edit-note');
      const editProjectBtn = li.querySelector('.btn-edit-project');
      const editNoteInput = li.querySelector('.edit-note-input');
      const editProjectInput = li.querySelector('.edit-project-input');

      editTitleInput.value = task.title;
      editActInput.value = task.completedPomodoros || 0;
      editEstInput.value = task.estPomodoros !== null ? task.estPomodoros : '';
      editNoteInput.value = task.note || '';
      editProjectInput.value = task.project || '';

      const submitEdit = () => saveEdit(task.id, editTitleInput, editActInput, editEstInput, editNoteInput, editProjectInput);

      bindExtraFieldToggle(editNoteBtn, editNoteInput);
      bindExtraFieldToggle(editProjectBtn, editProjectInput);
      bindFormEnterSubmit([editTitleInput, editActInput, editEstInput, editProjectInput], submitEdit);
      li.querySelector('.btn-edit-delete').addEventListener('click', () => deleteTask(task.id));
      li.querySelector('.btn-edit-cancel').addEventListener('click', cancelEdit);
      li.querySelector('.btn-edit-save').addEventListener('click', submitEdit);
    } else {
      li.addEventListener('click', (e) => {
        if (e.target.closest('.custom-checkbox') || e.target.closest('.task-actions-group')) return;
        if (activeTaskId === task.id && !editingTaskId) return;
        activeTaskId = task.id;
        editingTaskId = null;
        saveTasks();
        renderTasks();
      });

      const completedCount = task.completedPomodoros || 0;
      let countDisplay = '';
      if (task.estPomodoros) {
        countDisplay = `<span class="task-pomo-count">${completedCount} / ${task.estPomodoros}</span>`;
      } else if (completedCount > 0) {
        countDisplay = `<span class="task-pomo-count">${completedCount}</span>`;
      }

      const checkIcon = task.isCompleted ? ICONS.check : '';
      const checkLabel = task.isCompleted ? 'Mark as incomplete' : 'Mark as done';
      const projectTag = task.project ? `<span class="task-project-tag">${escapeHtml(task.project)}</span>` : '';

      let htmlContent = `
        <div class="task-main-row">
          <div class="task-info-group">
            <button type="button" class="custom-checkbox" title="${checkLabel}" aria-label="${checkLabel}" aria-pressed="${task.isCompleted ? 'true' : 'false'}">${checkIcon}</button>
            <span class="task-title-text">${escapeHtml(task.title)} ${projectTag}</span>
          </div>
          <div class="task-right-group">
            ${countDisplay}
            <div class="task-actions-group">
              <button type="button" class="task-icon-btn btn-move-up" title="Move up" aria-label="Move task up" ${visibleIdx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
              <button type="button" class="task-icon-btn btn-move-down" title="Move down" aria-label="Move task down" ${visibleIdx === visibleTasks.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
              <button type="button" class="task-icon-btn btn-open-edit" title="Edit task" aria-label="Edit task">${ICONS.edit}</button>
            </div>
          </div>
        </div>
      `;

      if (task.note) {
        htmlContent += `<div class="task-note-box">${escapeHtml(task.note).replace(/\n/g, '<br>')}</div>`;
      }
      li.innerHTML = htmlContent;
      li.querySelector('.custom-checkbox').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(task.id);
      });
      li.querySelector('.btn-move-up').addEventListener('click', (e) => {
        e.stopPropagation();
        moveTask(task.id, -1);
      });
      li.querySelector('.btn-move-down').addEventListener('click', (e) => {
        e.stopPropagation();
        moveTask(task.id, 1);
      });
      li.querySelector('.btn-open-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        resetTaskForm();
        activeTaskId = task.id;
        editingTaskId = task.id;
        saveTasks();
        renderTasks();
      });
    }
    taskList.appendChild(li);
  });

  updateActiveTaskBadge();
  updateTaskSummary();
}

function cancelEdit() {
  editingTaskId = null;
  renderTasks();
}

function saveEdit(id, titleEl, actEl, estEl, noteEl, projectEl) {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    const titleVal = titleEl.value.trim();
    if (!titleVal) {
      alert('Task title cannot be empty!');
      return;
    }
    const actResult = parseWholeNumberInput(actEl.value, 0, 'Act Pomodoros', 0);
    if (!actResult.valid) return;
    const estResult = parseWholeNumberInput(estEl.value, 1, 'Est Pomodoros', null);
    if (!estResult.valid) return;

    const projectVal = projectEl.value.trim();
    tasks[taskIndex].title = titleVal;
    tasks[taskIndex].completedPomodoros = actResult.value;
    tasks[taskIndex].estPomodoros = estResult.value;
    tasks[taskIndex].note = noteEl.value.trim();
    tasks[taskIndex].project = projectVal;

    if (selectedProjectFilter && projectVal !== selectedProjectFilter) {
      selectedProjectFilter = '';
    }
  }
  editingTaskId = null;
  saveTasks();
  renderTasks();
}

function toggleTaskComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.isCompleted = !task.isCompleted;

  if (appSettings.autoSwitchTask) {
    if (task.isCompleted && id === activeTaskId) {
      const visibleTasks = getVisibleTasks();
      const idx = visibleTasks.findIndex(t => t.id === id);
      const nextTask = idx !== -1
        ? (visibleTasks.slice(idx + 1).find(t => !t.isCompleted) || visibleTasks.slice(0, idx).find(t => !t.isCompleted))
        : tasks.find(t => !t.isCompleted);
      activeTaskId = nextTask ? nextTask.id : null;
    } else if (!task.isCompleted && !activeTaskId) {
      activeTaskId = task.id;
    }
  }

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(t => t.id !== id);
    if (activeTaskId === id) {
      if (appSettings.autoSwitchTask) {
        const visibleTasks = getVisibleTasks();
        const nextTask = visibleTasks.find(t => !t.isCompleted) || tasks.find(t => !t.isCompleted);
        activeTaskId = nextTask ? nextTask.id : null;
      } else {
        activeTaskId = null;
      }
    }
    if (editingTaskId === id) editingTaskId = null;
    saveTasks();
    renderTasks();
  }
}

function updateTaskSummary() {
  const visibleTasks = getVisibleTasks();
  let totalEst = 0;
  let completedPomos = 0;
  let remainingEst = 0;

  visibleTasks.forEach(t => {
    const est = t.estPomodoros || 0;
    const done = t.completedPomodoros || 0;
    totalEst += est;
    completedPomos += t.isCompleted && est > 0 ? Math.max(est, done) : done;
    if (est > 0 && !t.isCompleted) {
      remainingEst += Math.max(0, est - done);
    }
  });

  summaryPomos.innerHTML = `Pomos: <strong>${completedPomos} / ${totalEst}</strong>`;

  if (remainingEst > 0) {
    const workSecs = getPhaseSeconds('work');
    const shortBreakSecs = getPhaseSeconds('shortBreak');
    const longBreakSecs = getPhaseSeconds('longBreak');
    const interval = appSettings.longBreakInterval;
    let totalSecs = 0;

    // If currently running in a work phase for an active unfinished task, subtract already elapsed seconds
    const activeTask = tasks.find(t => t.id === activeTaskId);
    const activeIsCounted = activeTask && !activeTask.isCompleted && (activeTask.estPomodoros || 0) > 0;
    const elapsedInCurrentSession = (timerState.isRunning && timerState.phase === 'work' && activeIsCounted)
      ? Math.max(0, workSecs - (timerState.remainingSeconds || 0))
      : 0;

    for (let i = 0; i < remainingEst; i++) {
      totalSecs += workSecs;
      if (i < remainingEst - 1) {
        const sessionNum = timerState.completedWorkSessions + i + 1;
        totalSecs += sessionNum % interval === 0 ? longBreakSecs : shortBreakSecs;
      }
    }
    totalSecs = Math.max(0, totalSecs - elapsedInCurrentSession);
    const finishDate = new Date(Date.now() + totalSecs * 1000);
    const hours = finishDate.getHours().toString().padStart(2, '0');
    const mins = finishDate.getMinutes().toString().padStart(2, '0');
    const durationH = (totalSecs / 3600).toFixed(1);

    summaryFinish.innerHTML = `Finish At: <strong>${hours}:${mins}</strong> (${durationH}h)`;
  } else {
    summaryFinish.innerHTML = `Finish At: <strong>--:--</strong> (0h)`;
  }
}

// Background sync on tab focus or wake-up from sleep
function handleVisibilityOrFocusSync() {
  checkDailyStatsReset();

  if (timerState.isRunning && targetEndTime) {
    const secondsLeft = Math.ceil((targetEndTime - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerState.remainingSeconds = 0;
      handleTimerComplete(false);
    } else {
      timerState.remainingSeconds = secondsLeft;
      saveTimerState();
      updateDisplay();
      updateTaskSummary();
    }
  } else {
    updateDisplay();
    updateTaskSummary();
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    handleVisibilityOrFocusSync();
  }
});

window.addEventListener('focus', handleVisibilityOrFocusSync);

// Preserve accurate elapsed time if page unloads while running
window.addEventListener('pagehide', () => {
  if (timerState.isRunning && targetEndTime) {
    timerState.remainingSeconds = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
    saveTimerState();
  }
});

function saveTasks() {
  if (activeTaskId && !tasks.some(t => t.id === activeTaskId)) activeTaskId = null;
  if (editingTaskId && !tasks.some(t => t.id === editingTaskId)) editingTaskId = null;
  safeSetStorage('tasks', JSON.stringify(tasks));
  safeSetStorage('activeTaskId', activeTaskId || '');
}

init();
