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
const VALID_ANALYTICS_RANGES = ['today', 'week', 'month', 'year', 'custom'];
const VALID_TASK_BUCKETS = ['today', 'backlog', 'all'];
const VALID_RECURRENCES = ['none', 'daily', 'weekdays', 'weekly'];
const RECURRENCE_LABELS = { daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly' };
const VALID_ALARM_SOUNDS = ['bell', 'digital', 'gong', 'marimba'];
const SOUND_TRACKS = [
  { id: 'rain', label: 'Gentle Rain', defaultLevel: 0.7 },
  { id: 'cafe', label: 'Cafe Murmur', defaultLevel: 0.65 },
  { id: 'fireplace', label: 'Cozy Fireplace', defaultLevel: 0.65 },
  { id: 'forest', label: 'Forest Wind', defaultLevel: 0.65 },
  { id: 'brown', label: 'Deep Brown', defaultLevel: 0.65 },
  { id: 'pink', label: 'Pink Noise', defaultLevel: 0.6 },
  { id: 'white', label: 'Lo-fi White', defaultLevel: 0.55 },
  { id: 'binaural', label: 'Alpha Hum', defaultLevel: 0.45 }
];
const SOUND_TRACK_MAP = Object.fromEntries(SOUND_TRACKS.map(t => [t.id, t]));
const VALID_AMBIENT_SOUNDS = ['off', 'custom', ...SOUND_TRACKS.map(t => t.id)];
const BUILT_IN_SOUND_PRESETS = [
  { id: 'deep-code', name: 'Deep Code', mix: { brown: 0.65, rain: 0.35 } },
  { id: 'cozy-study', name: 'Cozy Study', mix: { fireplace: 0.6, rain: 0.45 } },
  { id: 'coffee-shop', name: 'Coffee Shop', mix: { cafe: 0.65, rain: 0.25 } },
  { id: 'forest-zen', name: 'Forest Zen', mix: { forest: 0.65, binaural: 0.3 } }
];
const FOCUS_RATINGS = {
  locked: { label: 'Locked In', score: 100 },
  okay: { label: 'Okay', score: 65 },
  distracted: { label: 'Distracted', score: 25 }
};
const DISTRACTION_TAGS = ['Notifications', 'Context Switch', 'Fatigue', 'Meetings', 'Social / Web'];
const BREATHING_PHASES = [
  { key: 'inhale', label: 'Inhale', seconds: 4 },
  { key: 'hold', label: 'Hold', seconds: 7 },
  { key: 'exhale', label: 'Exhale', seconds: 8 }
];
const DESK_STRETCHES = [
  { name: 'Shoulder Rolls', tip: 'Roll both shoulders slowly back 5 times, then drop them away from your ears.' },
  { name: 'Neck Release', tip: 'Gently tilt your right ear toward your right shoulder for 15 seconds, then switch sides.' },
  { name: 'Chest Opener', tip: 'Clasp hands behind your back, lift your chest slightly, and take 3 slow deep breaths.' },
  { name: 'Wrist & Forearm Flex', tip: 'Extend one arm forward palm-up and gently pull fingers down with the other hand for 15s.' }
];
const PROJECT_COLORS = ['#d95550', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#16a085', '#e67e22'];
const NO_PROJECT_COLOR = '#95a5a6';

const VALID_VISUAL_PALETTES = ['classic', 'nordic', 'matcha', 'sunset', 'mono'];
const VALID_TIMER_LAYOUTS = ['clean', 'ring'];
const VALID_TIMER_FONTS = ['sans', 'mono', 'serif'];
const VALID_BACKDROP_STYLES = ['glow', 'aurora', 'minimal'];
const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * 106;
const ZEN_RING_CIRCUMFERENCE = 2 * Math.PI * 146;

const VISUAL_PALETTES = {
  classic: {
    light: {
      work: { accent: '#d95550', fg: '#ffffff', bg: '#faf6f5', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#e6e2e2', soft: 'rgba(217,85,80,0.12)' },
      shortBreak: { accent: '#38858a', fg: '#ffffff', bg: '#f3f9f9', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dce7e8', soft: 'rgba(56,133,138,0.12)' },
      longBreak: { accent: '#397097', fg: '#ffffff', bg: '#f3f7fb', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dce4ee', soft: 'rgba(57,112,151,0.12)' }
    },
    dark: {
      work: { accent: '#eb6a65', fg: '#ffffff', bg: '#141213', card: '#1d1a1b', text: '#f1f2f5', muted: '#9da4b2', border: '#2f2a2c', soft: 'rgba(235,106,101,0.17)' },
      shortBreak: { accent: '#4caeb5', fg: '#ffffff', bg: '#101617', card: '#172022', text: '#f1f2f5', muted: '#9da4b2', border: '#263538', soft: 'rgba(76,174,181,0.17)' },
      longBreak: { accent: '#5b9bd5', fg: '#ffffff', bg: '#10151b', card: '#171f28', text: '#f1f2f5', muted: '#9da4b2', border: '#263444', soft: 'rgba(91,155,213,0.17)' }
    }
  },
  nordic: {
    light: {
      work: { accent: '#4f46e5', fg: '#ffffff', bg: '#f4f6fc', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dde2ef', soft: 'rgba(79,70,229,0.12)' },
      shortBreak: { accent: '#0284c7', fg: '#ffffff', bg: '#f1f7fc', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#d6e4f0', soft: 'rgba(2,132,199,0.12)' },
      longBreak: { accent: '#7c3aed', fg: '#ffffff', bg: '#f6f3fc', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#e1d9f0', soft: 'rgba(124,58,237,0.12)' }
    },
    dark: {
      work: { accent: '#818cf8', fg: '#10121b', bg: '#10121b', card: '#171a27', text: '#f1f2f5', muted: '#9da4b2', border: '#2a3046', soft: 'rgba(129,140,248,0.18)' },
      shortBreak: { accent: '#38bdf8', fg: '#0b141c', bg: '#0e171f', card: '#15212c', text: '#f1f2f5', muted: '#9da4b2', border: '#25384a', soft: 'rgba(56,189,248,0.17)' },
      longBreak: { accent: '#a78bfa', fg: '#130f1e', bg: '#15121f', card: '#1d192b', text: '#f1f2f5', muted: '#9da4b2', border: '#342d4a', soft: 'rgba(167,139,250,0.18)' }
    }
  },
  matcha: {
    light: {
      work: { accent: '#2d8a61', fg: '#ffffff', bg: '#f4f8f5', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#d9e5dd', soft: 'rgba(45,138,97,0.12)' },
      shortBreak: { accent: '#0f766e', fg: '#ffffff', bg: '#f1f8f7', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#d4e4e2', soft: 'rgba(15,118,110,0.12)' },
      longBreak: { accent: '#475569', fg: '#ffffff', bg: '#f3f5f8', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dadfe7', soft: 'rgba(71,85,105,0.12)' }
    },
    dark: {
      work: { accent: '#3fb37f', fg: '#0b140f', bg: '#0f1612', card: '#16201a', text: '#f1f2f5', muted: '#9da4b2', border: '#27382d', soft: 'rgba(63,179,127,0.18)' },
      shortBreak: { accent: '#2dd4bf', fg: '#091514', bg: '#0e1717', card: '#152222', text: '#f1f2f5', muted: '#9da4b2', border: '#253b3b', soft: 'rgba(45,212,191,0.17)' },
      longBreak: { accent: '#94a3b8', fg: '#0f1318', bg: '#111418', card: '#181d22', text: '#f1f2f5', muted: '#9da4b2', border: '#2b343e', soft: 'rgba(148,163,184,0.18)' }
    }
  },
  sunset: {
    light: {
      work: { accent: '#c25e00', fg: '#ffffff', bg: '#fcf7f2', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#eadfd3', soft: 'rgba(194,94,0,0.12)' },
      shortBreak: { accent: '#be123c', fg: '#ffffff', bg: '#fcf3f5', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#ead7dd', soft: 'rgba(190,18,60,0.12)' },
      longBreak: { accent: '#4338ca', fg: '#ffffff', bg: '#f4f4fc', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dbdcf0', soft: 'rgba(67,56,202,0.12)' }
    },
    dark: {
      work: { accent: '#f59e0b', fg: '#181108', bg: '#17120e', card: '#201a15', text: '#f1f2f5', muted: '#9da4b2', border: '#362c24', soft: 'rgba(245,158,11,0.18)' },
      shortBreak: { accent: '#fb7185', fg: '#1c0d13', bg: '#181014', card: '#22171c', text: '#f1f2f5', muted: '#9da4b2', border: '#392730', soft: 'rgba(251,113,133,0.18)' },
      longBreak: { accent: '#818cf8', fg: '#10121b', bg: '#11121c', card: '#181a28', text: '#f1f2f5', muted: '#9da4b2', border: '#2b2f47', soft: 'rgba(129,140,248,0.18)' }
    }
  },
  mono: {
    light: {
      work: { accent: '#1f242c', fg: '#ffffff', bg: '#f4f4f6', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dedee3', soft: 'rgba(31,36,44,0.1)' },
      shortBreak: { accent: '#374151', fg: '#ffffff', bg: '#f3f5f6', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dedee3', soft: 'rgba(55,65,81,0.11)' },
      longBreak: { accent: '#4b5563', fg: '#ffffff', bg: '#f2f4f7', card: '#ffffff', text: '#1f242c', muted: '#667080', border: '#dedee3', soft: 'rgba(75,85,99,0.11)' }
    },
    dark: {
      work: { accent: '#e4e4e7', fg: '#111113', bg: '#101012', card: '#17171a', text: '#f1f2f5', muted: '#9da4b2', border: '#29292e', soft: 'rgba(228,228,231,0.15)' },
      shortBreak: { accent: '#cbd5e1', fg: '#0f1215', bg: '#101214', card: '#17191c', text: '#f1f2f5', muted: '#9da4b2', border: '#29292e', soft: 'rgba(203,213,225,0.16)' },
      longBreak: { accent: '#b8c2d0', fg: '#101217', bg: '#111216', card: '#181a20', text: '#f1f2f5', muted: '#9da4b2', border: '#29292e', soft: 'rgba(184,194,208,0.16)' }
    }
  }
};

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
  close: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  bucketSwap: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>'
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
    const rating = typeof item.focusRating === 'string' && FOCUS_RATINGS[item.focusRating] ? item.focusRating : null;
    clean.push({
      id: typeof item.id === 'string' && item.id ? item.id : `${ts}-${clean.length}`,
      completedAt: ts,
      dateKey: getLocalDateKey(d),
      hour: d.getHours(),
      minutes: Math.round(mins),
      taskId: typeof item.taskId === 'string' && item.taskId ? item.taskId : null,
      taskTitle: typeof item.taskTitle === 'string' && item.taskTitle.trim() ? item.taskTitle.trim() : 'Unassigned',
      project: typeof item.project === 'string' ? item.project.trim() : '',
      intent: typeof item.intent === 'string' ? item.intent.trim() : '',
      focusRating: rating,
      distractionTag: typeof item.distractionTag === 'string' ? item.distractionTag.trim() : ''
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

function sanitizeSubtasks(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter(s => s && typeof s.text === 'string' && s.text.trim())
    .slice(0, 30)
    .map((s, idx) => ({
      id: typeof s.id === 'string' && s.id ? s.id : `sub-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      text: s.text.trim().slice(0, 120),
      done: Boolean(s.done)
    }));
}

function sanitizeTasks(rawTasks) {
  if (!Array.isArray(rawTasks)) return [];
  return rawTasks
    .filter(t => t && typeof t === 'object' && typeof t.title === 'string' && t.title.trim())
    .map((t, idx) => {
      const est = Number(t.estPomodoros);
      const act = Number(t.completedPomodoros);
      const bucket = t.bucket === 'backlog' ? 'backlog' : 'today';
      const recurrence = VALID_RECURRENCES.includes(t.recurrence) ? t.recurrence : 'none';
      const recurWeekday = Number.isInteger(Number(t.recurWeekday)) && Number(t.recurWeekday) >= 0 && Number(t.recurWeekday) <= 6
        ? Number(t.recurWeekday)
        : new Date().getDay();
      return {
        id: typeof t.id === 'string' && t.id ? t.id : `task-${Date.now()}-${idx}`,
        title: t.title.trim(),
        estPomodoros: Number.isInteger(est) && est >= 1 ? est : null,
        completedPomodoros: Number.isInteger(act) && act >= 0 ? act : 0,
        isCompleted: Boolean(t.isCompleted),
        note: typeof t.note === 'string' ? t.note.trim() : '',
        project: typeof t.project === 'string' ? t.project.trim() : '',
        bucket,
        recurrence,
        recurWeekday,
        lastCompletedDate: typeof t.lastCompletedDate === 'string' ? t.lastCompletedDate : '',
        lastRecurredDate: typeof t.lastRecurredDate === 'string' ? t.lastRecurredDate : '',
        subtasks: sanitizeSubtasks(t.subtasks)
      };
    });
}

// --- APP STATE ---
const loadedTasks = loadJSON('tasks', []);
let tasks = sanitizeTasks(loadedTasks);
let activeTaskId = safeGetStorage('activeTaskId') || null;
let editingTaskId = null; // Menyimpan ID tugas yang sedang di-edit
let selectedProjectFilter = '';
let activeTaskBucket = 'today';
let isTimelineOpen = false;
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
  ambientFade: true,
  ambientAutoDuck: true,
  soundMix: {},
  soundPresets: [],
  activeAudioPreset: 'off',
  notifications: false,
  autoStart: false,
  autoStartWork: false,
  autoSwitchTask: false,
  guidedBreaks: true,
  restDays: [],
  streakFreezeEnabled: true,
  blockedBreak: { enabled: false, startTime: '12:00', minutes: 45 },
  visualPalette: 'classic',
  timerLayout: 'clean',
  timerFont: 'sans',
  backdropStyle: 'glow',
  compactUi: false,
  reducedMotion: false,
  durations: { ...defaultPreset },
  longBreakInterval: 4,
  dailyGoal: 6
});

let dailyStats = loadJSON('dailyStats', {
  date: new Date().toDateString(), sessions: 0, minutes: 0
});
let sessionHistory = sanitizeSessionHistory(loadJSON('sessionHistory', []));
let analyticsRange = 'today';
let customDateRange = { from: '', to: '' };
let isSessionLogOpen = false;
let exportStatusTimeout = null;
let currentSessionIntent = safeGetStorage('currentSessionIntent') || '';
let pendingCheckinSessionId = null;
let checkinStatusMessage = '';

let isZenOpen = false;
let pipWindow = null;
let pipVideoEl = null;
let pipCanvasEl = null;
let pipStream = null;
let pipInfoTimeout = null;
let lastFaviconKey = '';

let recoveryMode = 'breathing';
let breathingRunning = false;
let breathingPhaseIdx = 0;
let breathingStepLeft = BREATHING_PHASES[0].seconds;
let breathingInterval = null;
let eyeRestRunning = false;
let eyeRestLeft = 20;
let eyeRestInterval = null;
let stretchIdx = 0;

let isSoundStudioOpen = false;
let isStudioSaveFormOpen = false;
let timerInterval = null;
let targetEndTime = null;
let audioCtx = null;
let ambientWanted = false;
let activeAmbient = null;
let duckRestoreTimer = null;
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

  duckAmbientForAlarm();
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

function addLoopingBufferLayer(ctx, session, kind, filterConfigs, layerGain, outputNode = null) {
  const source = ctx.createBufferSource();
  source.buffer = getAmbientNoiseBuffer(ctx, kind);
  source.loop = true;

  let head = source;
  filterConfigs.forEach(cfg => {
    const filter = ctx.createBiquadFilter();
    filter.type = cfg.type;
    filter.frequency.setValueAtTime(cfg.frequency, ctx.currentTime);
    if (cfg.Q !== undefined) filter.Q.setValueAtTime(cfg.Q, ctx.currentTime);
    if (cfg.gain !== undefined && filter.gain) filter.gain.setValueAtTime(cfg.gain, ctx.currentTime);
    head.connect(filter);
    session.nodes.push(filter);
    head = filter;
  });

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(layerGain, ctx.currentTime);
  head.connect(gain);
  gain.connect(outputNode || session.masterGain);
  source.start();
  session.sources.push(source);
  session.nodes.push(gain);
  return { source, gain };
}

function isLayerAlive(session, layer) {
  return activeAmbient === session && session.layers.get(layer.id) === layer && session.ctx.state === 'running';
}

const AMBIENT_BUILDERS = {
  white: (ctx, session, layer) => {
    addLoopingBufferLayer(
      ctx,
      layer,
      'white',
      [
        { type: 'highpass', frequency: 140, Q: 0.7 },
        { type: 'lowpass', frequency: 2100, Q: 0.6 }
      ],
      0.24,
      layer.outputGain
    );
  },
  pink: (ctx, session, layer) => {
    addLoopingBufferLayer(
      ctx,
      layer,
      'pink',
      [{ type: 'lowpass', frequency: 3200, Q: 0.7 }],
      0.52,
      layer.outputGain
    );
  },
  brown: (ctx, session, layer) => {
    addLoopingBufferLayer(
      ctx,
      layer,
      'brown',
      [
        { type: 'lowpass', frequency: 480, Q: 0.6 },
        { type: 'lowshelf', frequency: 120, gain: 3.5 }
      ],
      0.72,
      layer.outputGain
    );
  },
  rain: (ctx, session, layer) => {
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
    washGain.connect(layer.outputGain);
    washSource.start();
    lfo.start();
    layer.sources.push(washSource, lfo);
    layer.nodes.push(band, low, washGain, lfoGain);

    addLoopingBufferLayer(
      ctx,
      layer,
      'brown',
      [{ type: 'lowpass', frequency: 360, Q: 0.6 }],
      0.32,
      layer.outputGain
    );

    const dropTimer = setInterval(() => {
      if (!isLayerAlive(session, layer) || Math.random() > 0.65) return;
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
      g.connect(layer.outputGain);
      osc.start(t);
      osc.stop(t + 0.07);
    }, 280);
    layer.timers.push(dropTimer);
  },
  cafe: (ctx, session, layer) => {
    addLoopingBufferLayer(
      ctx,
      layer,
      'brown',
      [{ type: 'lowpass', frequency: 380, Q: 0.7 }],
      0.66,
      layer.outputGain
    );

    const chatter = addLoopingBufferLayer(
      ctx,
      layer,
      'pink',
      [
        { type: 'bandpass', frequency: 760, Q: 1.7 },
        { type: 'lowpass', frequency: 1900, Q: 0.7 }
      ],
      0.16,
      layer.outputGain
    );

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.17, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(chatter.gain.gain);
    lfo.start();
    layer.sources.push(lfo);
    layer.nodes.push(lfoGain);

    const clinkTimer = setInterval(() => {
      if (!isLayerAlive(session, layer) || Math.random() > 0.35) return;
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
        g.connect(layer.outputGain);
        osc.start(t);
        osc.stop(t + 0.13);
      });
    }, 2200);
    layer.timers.push(clinkTimer);
  },
  fireplace: (ctx, session, layer) => {
    const rumble = addLoopingBufferLayer(
      ctx,
      layer,
      'brown',
      [{ type: 'lowpass', frequency: 280, Q: 0.7 }],
      0.56,
      layer.outputGain
    );

    const flickerLfo = ctx.createOscillator();
    const flickerGain = ctx.createGain();
    flickerLfo.frequency.setValueAtTime(0.32, ctx.currentTime);
    flickerGain.gain.setValueAtTime(0.12, ctx.currentTime);
    flickerLfo.connect(flickerGain);
    flickerGain.connect(rumble.gain.gain);
    flickerLfo.start();
    layer.sources.push(flickerLfo);
    layer.nodes.push(flickerGain);

    const crackleTimer = setInterval(() => {
      if (!isLayerAlive(session, layer) || Math.random() > 0.52) return;
      const t = ctx.currentTime + 0.01;
      const pops = Math.random() > 0.7 ? 2 : 1;
      for (let i = 0; i < pops; i++) {
        const pt = t + i * (0.04 + Math.random() * 0.05);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = 1400 + Math.random() * 2400;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, pt);
        osc.frequency.exponentialRampToValueAtTime(320, pt + 0.025);
        const amp = 0.02 + Math.random() * 0.035;
        g.gain.setValueAtTime(0.0001, pt);
        g.gain.linearRampToValueAtTime(amp, pt + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, pt + 0.028);
        osc.connect(g);
        g.connect(layer.outputGain);
        osc.start(pt);
        osc.stop(pt + 0.035);
      }
    }, 240);
    layer.timers.push(crackleTimer);
  },
  forest: (ctx, session, layer) => {
    const breeze = ctx.createBufferSource();
    breeze.buffer = getAmbientNoiseBuffer(ctx, 'pink');
    breeze.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.setValueAtTime(520, ctx.currentTime);
    band.Q.setValueAtTime(0.85, ctx.currentTime);

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(2200, ctx.currentTime);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.45, ctx.currentTime);

    const windLfo = ctx.createOscillator();
    const windGain = ctx.createGain();
    windLfo.frequency.setValueAtTime(0.09, ctx.currentTime);
    windGain.gain.setValueAtTime(210, ctx.currentTime);
    windLfo.connect(windGain);
    windGain.connect(band.frequency);

    breeze.connect(band);
    band.connect(low);
    low.connect(breezeGain);
    breezeGain.connect(layer.outputGain);
    breeze.start();
    windLfo.start();
    layer.sources.push(breeze, windLfo);
    layer.nodes.push(band, low, breezeGain, windGain);

    const chirpTimer = setInterval(() => {
      if (!isLayerAlive(session, layer) || Math.random() > 0.28) return;
      const t = ctx.currentTime + 0.03;
      const baseFreq = 1900 + Math.random() * 900;
      [0, 0.11].forEach((off, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const f = idx === 0 ? baseFreq : baseFreq * 1.18;
        osc.frequency.setValueAtTime(f, t + off);
        osc.frequency.exponentialRampToValueAtTime(f * 0.9, t + off + 0.08);
        g.gain.setValueAtTime(0.0001, t + off);
        g.gain.linearRampToValueAtTime(0.011, t + off + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.09);
        osc.connect(g);
        g.connect(layer.outputGain);
        osc.start(t + off);
        osc.stop(t + off + 0.11);
      });
    }, 2600);
    layer.timers.push(chirpTimer);
  },
  binaural: (ctx, session, layer) => {
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(420, ctx.currentTime);
    low.connect(layer.outputGain);
    layer.nodes.push(low);

    // 10 Hz Alpha focus beat (200 Hz + 210 Hz) plus subtle warm fifth
    [
      { freq: 200, gain: 0.08 },
      { freq: 210, gain: 0.08 },
      { freq: 300, gain: 0.03 }
    ].forEach(cfg => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);
      g.gain.setValueAtTime(cfg.gain, ctx.currentTime);
      osc.connect(g);
      g.connect(low);
      osc.start();
      layer.sources.push(osc);
      layer.nodes.push(g);
    });
  }
};

function teardownLayer(layer, immediate = false) {
  layer.timers.forEach(id => clearInterval(id));
  layer.timers = [];
  const delayMs = immediate ? 0 : 170;
  if (!immediate) {
    try {
      const now = layer.ctx.currentTime;
      layer.outputGain.gain.cancelScheduledValues(now);
      layer.outputGain.gain.setValueAtTime(Math.max(0.0001, layer.outputGain.gain.value), now);
      layer.outputGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    } catch {}
  }
  const cleanup = () => {
    layer.sources.forEach(src => {
      try { src.stop(); } catch {}
      try { src.disconnect(); } catch {}
    });
    layer.nodes.forEach(node => {
      try { node.disconnect(); } catch {}
    });
    try { layer.outputGain.disconnect(); } catch {}
  };
  if (delayMs === 0) cleanup();
  else setTimeout(cleanup, delayMs);
}

function startLayerInSession(session, trackId, level) {
  const builder = AMBIENT_BUILDERS[trackId];
  if (!builder) return;
  const ctx = session.ctx;
  const outputGain = ctx.createGain();
  const now = ctx.currentTime;
  const targetLevel = Math.max(0.0001, clampVolume(level, 0.5));
  outputGain.gain.setValueAtTime(0.0001, now);
  outputGain.gain.linearRampToValueAtTime(targetLevel, now + 0.16);
  outputGain.connect(session.masterGain);

  const layer = { id: trackId, ctx, outputGain, sources: [], nodes: [], timers: [] };
  session.layers.set(trackId, layer);
  builder(ctx, session, layer);
}

function stopAmbientAudio() {
  if (!activeAmbient) return;
  const old = activeAmbient;
  activeAmbient = null;
  if (duckRestoreTimer) {
    clearTimeout(duckRestoreTimer);
    duckRestoreTimer = null;
  }

  const fadeOutSec = appSettings.ambientFade !== false ? 0.45 : 0.14;
  const ctx = old.ctx;
  try {
    const now = ctx.currentTime;
    old.masterGain.gain.cancelScheduledValues(now);
    old.masterGain.gain.setValueAtTime(Math.max(0.0001, old.masterGain.gain.value), now);
    old.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutSec);
  } catch {
    // Ignore teardown scheduling errors if AudioContext is closed
  }

  old.layers.forEach(layer => layer.timers.forEach(id => clearInterval(id)));
  setTimeout(() => {
    old.layers.forEach(layer => teardownLayer(layer, true));
    old.layers.clear();
    try { old.masterGain.disconnect(); } catch {}
  }, Math.round((fadeOutSec + 0.05) * 1000));
}

function duckAmbientForAlarm() {
  if (!activeAmbient || appSettings.ambientAutoDuck === false) return;
  const session = activeAmbient;
  const ctx = session.ctx;
  const fullVol = Math.max(0.0001, appSettings.ambientVolume);
  const duckedVol = Math.max(0.0001, fullVol * 0.2);

  try {
    const now = ctx.currentTime;
    session.masterGain.gain.cancelScheduledValues(now);
    session.masterGain.gain.setValueAtTime(Math.max(0.0001, session.masterGain.gain.value), now);
    session.masterGain.gain.linearRampToValueAtTime(duckedVol, now + 0.14);
    if (duckRestoreTimer) clearTimeout(duckRestoreTimer);
    duckRestoreTimer = setTimeout(() => {
      duckRestoreTimer = null;
      if (activeAmbient !== session) return;
      try {
        const restoreNow = ctx.currentTime;
        session.masterGain.gain.cancelScheduledValues(restoreNow);
        session.masterGain.gain.setValueAtTime(Math.max(0.0001, session.masterGain.gain.value), restoreNow);
        session.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, appSettings.ambientVolume), restoreNow + 0.75);
      } catch {}
    }, 1700);
  } catch {}
}

function getActiveMixTracks() {
  const active = [];
  SOUND_TRACKS.forEach(track => {
    const level = clampVolume(appSettings.soundMix?.[track.id], 0);
    if (level > 0) active.push({ id: track.id, level });
  });
  return active;
}

function normalizeMixObject(rawMix) {
  const normalized = {};
  SOUND_TRACKS.forEach(track => {
    normalized[track.id] = clampVolume(rawMix?.[track.id], 0);
  });
  return normalized;
}

function areMixesEqual(mixA, mixB) {
  return SOUND_TRACKS.every(track => Math.abs((mixA[track.id] || 0) - (mixB[track.id] || 0)) < 0.01);
}

function getAllAudioPresets() {
  const custom = Array.isArray(appSettings.soundPresets) ? appSettings.soundPresets : [];
  return [
    ...BUILT_IN_SOUND_PRESETS.map(p => ({ ...p, builtIn: true })),
    ...custom.map(p => ({ ...p, builtIn: false }))
  ];
}

function resolveMixDescriptor() {
  const activeTracks = getActiveMixTracks();
  if (activeTracks.length === 0) {
    return { key: 'off', label: 'Off', activeCount: 0 };
  }

  const presets = getAllAudioPresets();
  const currentMix = normalizeMixObject(appSettings.soundMix);
  const matchedPreset = presets.find(p => areMixesEqual(currentMix, normalizeMixObject(p.mix)));
  if (matchedPreset) {
    return { key: `preset:${matchedPreset.id}`, label: matchedPreset.name, activeCount: activeTracks.length };
  }

  if (activeTracks.length === 1) {
    const singleId = activeTracks[0].id;
    return { key: singleId, label: SOUND_TRACK_MAP[singleId]?.label || singleId, activeCount: 1 };
  }

  return { key: 'custom', label: `${activeTracks.length} Layers`, activeCount: activeTracks.length };
}

function startOrUpdateAmbientSession() {
  const activeTracks = getActiveMixTracks();
  if (activeTracks.length === 0) {
    stopAmbientAudio();
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  if (!activeAmbient) {
    const masterGain = ctx.createGain();
    const now = ctx.currentTime;
    const fadeInSec = appSettings.ambientFade !== false ? 0.45 : 0.14;
    const targetVol = Math.max(0.0001, appSettings.ambientVolume);
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(targetVol, now + fadeInSec);
    masterGain.connect(ctx.destination);

    const session = { ctx, masterGain, layers: new Map() };
    activeAmbient = session;
    activeTracks.forEach(({ id, level }) => startLayerInSession(session, id, level));
    return;
  }

  const session = activeAmbient;
  const activeMap = new Map(activeTracks.map(item => [item.id, item.level]));

  // Remove deactivated layers
  Array.from(session.layers.entries()).forEach(([trackId, layer]) => {
    if (!activeMap.has(trackId)) {
      session.layers.delete(trackId);
      teardownLayer(layer, false);
    }
  });

  // Update active layers or spin up newly added layers
  activeMap.forEach((level, trackId) => {
    const existing = session.layers.get(trackId);
    if (existing) {
      try {
        existing.outputGain.gain.setTargetAtTime(Math.max(0.0001, level), ctx.currentTime, 0.035);
      } catch {}
    } else {
      startLayerInSession(session, trackId, level);
    }
  });
}

function updateAmbientUI() {
  const activeTracks = getActiveMixTracks();
  const hasSound = activeTracks.length > 0;
  const isPlaying = Boolean(activeAmbient);
  const workOnlyWaiting = hasSound && appSettings.ambientWorkOnly && !(timerState.isRunning && timerState.phase === 'work');
  const descriptor = resolveMixDescriptor();

  appSettings.ambientSound = descriptor.key === 'off' ? 'off' : (descriptor.activeCount === 1 && !descriptor.key.startsWith('preset:') ? descriptor.key : 'custom');
  syncAmbientSelectOptions(descriptor);

  ambientSelect.value = descriptor.key;
  ambientVolumeSlider.value = appSettings.ambientVolume;
  btnAmbientToggle.disabled = !hasSound;
  btnAmbientToggle.classList.toggle('is-playing', isPlaying);
  ambientToggleIcon.innerHTML = isPlaying ? ICONS.pauseSm : ICONS.playSm;

  if (!hasSound) {
    ambientToggleLabel.textContent = 'Play';
    btnAmbientToggle.title = 'Choose a sound or open Studio mixer first';
  } else if (isPlaying) {
    ambientToggleLabel.textContent = 'Pause';
    btnAmbientToggle.title = 'Pause Sound Studio audio';
  } else if (workOnlyWaiting) {
    ambientToggleLabel.textContent = ambientWanted ? 'On Work' : 'Play';
    btnAmbientToggle.title = 'Plays automatically when Work timer runs';
  } else {
    ambientToggleLabel.textContent = 'Play';
    btnAmbientToggle.title = 'Play selected Sound Studio mix';
  }

  if (studioLayerBadge) {
    studioLayerBadge.textContent = String(descriptor.activeCount);
    studioLayerBadge.classList.toggle('hidden', descriptor.activeCount === 0);
  }
  if (btnSoundStudio) {
    btnSoundStudio.classList.toggle('is-active', isSoundStudioOpen || descriptor.activeCount > 1);
    btnSoundStudio.setAttribute('aria-expanded', String(isSoundStudioOpen));
  }

  if (zenBtnAmbient && zenAmbientLabel) {
    zenBtnAmbient.classList.toggle('is-active', isPlaying);
    zenAmbientLabel.textContent = !hasSound
      ? 'Sound: Off'
      : (isPlaying ? `${descriptor.label}: On` : `${descriptor.label}: Paused`);
  }

  renderSoundStudioState();
}

function syncAmbientPlayback() {
  const hasSound = getActiveMixTracks().length > 0;
  const workActive = timerState.isRunning && timerState.phase === 'work';
  const shouldPlay = hasSound && ambientWanted && (!appSettings.ambientWorkOnly || workActive);

  if (!shouldPlay) {
    stopAmbientAudio();
  } else {
    startOrUpdateAmbientSession();
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
const appFaviconLink = document.getElementById('app-favicon');
const btnPipTimer = document.getElementById('btn-pip-timer');
const btnZenMode = document.getElementById('btn-zen-mode');
const pipStatusMsgEl = document.getElementById('pip-status-msg');
const sessionIntentWrap = document.getElementById('session-intent-wrap');
const sessionIntentInput = document.getElementById('session-intent-input');
const btnClearIntent = document.getElementById('btn-clear-intent');
const focusCheckinBanner = document.getElementById('focus-checkin-banner');
const breakRecoveryCard = document.getElementById('break-recovery-card');
const btnAppearance = document.getElementById('btn-appearance');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleLabel = document.getElementById('theme-toggle-label');
const modeBtns = document.querySelectorAll('.mode-btn');
const phaseTabBtns = document.querySelectorAll('.phase-tab');
const timerProgressBar = document.getElementById('timer-progress-bar');
const timerRingProgress = document.getElementById('timer-ring-progress');
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
const btnSoundStudio = document.getElementById('btn-sound-studio');
const studioLayerBadge = document.getElementById('studio-layer-badge');
const soundStudioPanel = document.getElementById('sound-studio-panel');
const btnStudioSavePreset = document.getElementById('btn-studio-save-preset');
const btnStudioClear = document.getElementById('btn-studio-clear');
const studioSaveRow = document.getElementById('studio-save-row');
const studioPresetNameInput = document.getElementById('studio-preset-name');
const btnStudioConfirmSave = document.getElementById('btn-studio-confirm-save');
const btnStudioCancelSave = document.getElementById('btn-studio-cancel-save');
const studioPresetsRow = document.getElementById('studio-presets-row');
const studioMixerGrid = document.getElementById('studio-mixer-grid');

// Tasks DOM
const taskBucketTabs = document.querySelectorAll('.task-bucket-tab');
const bucketCountTodayEl = document.getElementById('bucket-count-today');
const bucketCountBacklogEl = document.getElementById('bucket-count-backlog');
const taskList = document.getElementById('task-list');
const projectFilter = document.getElementById('project-filter');
const btnShowAddTask = document.getElementById('btn-show-add-task');
const addTaskContainer = document.getElementById('add-task-container');
const btnCancelTask = document.getElementById('btn-cancel-task');
const btnSaveTask = document.getElementById('btn-save-task');

// Task Form Fields (Add)
const inputTitle = document.getElementById('task-title');
const inputEst = document.getElementById('task-est');
const inputBucket = document.getElementById('task-bucket');
const inputRecurrence = document.getElementById('task-recurrence');
const btnAddSubtasks = document.getElementById('btn-add-subtasks');
const btnAddNote = document.getElementById('btn-add-note');
const btnAddProject = document.getElementById('btn-add-project');
const inputSubtasks = document.getElementById('task-subtasks');
const inputNote = document.getElementById('task-note');
const inputProject = document.getElementById('task-project');

// Dropdown DOM
const btnTaskOptions = document.getElementById('btn-task-options');
const taskDropdownMenu = document.getElementById('task-dropdown-menu');

const summaryPomos = document.getElementById('summary-pomos');
const summaryFinish = document.getElementById('summary-finish');
const btnToggleTimeline = document.getElementById('btn-toggle-timeline');
const dayTimelinePanel = document.getElementById('day-timeline-panel');
const toggleBreakBlock = document.getElementById('toggle-break-block');
const breakBlockStart = document.getElementById('break-block-start');
const breakBlockMins = document.getElementById('break-block-mins');
const dayTimelineList = document.getElementById('day-timeline-list');

// Settings & Analytics DOM
const settingsAccordion = document.getElementById('settings-accordion');
const appearanceSettingsGroup = document.getElementById('appearance-settings-group');
const paletteBtns = document.querySelectorAll('.palette-btn');
const timerLayoutBtns = document.querySelectorAll('#timer-layout-picker .choice-btn');
const timerFontBtns = document.querySelectorAll('#timer-font-picker .choice-btn');
const backdropStyleBtns = document.querySelectorAll('#backdrop-style-picker .choice-btn');
const toggleCompactUi = document.getElementById('toggle-compact-ui');
const toggleReducedMotion = document.getElementById('toggle-reduced-motion');
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
const toggleAmbientFade = document.getElementById('toggle-ambient-fade');
const toggleAmbientDuck = document.getElementById('toggle-ambient-duck');
const toggleNotif = document.getElementById('toggle-notif');
const toggleAutoStart = document.getElementById('toggle-autostart');
const toggleAutoStartWork = document.getElementById('toggle-autostart-work');
const toggleAutoSwitchTask = document.getElementById('toggle-autoswitch-task');
const toggleGuidedBreaks = document.getElementById('toggle-guided-breaks');
const toggleStreakFreeze = document.getElementById('toggle-streak-freeze');
const restDayBtns = document.querySelectorAll('.rest-day-btn');

const zenOverlay = document.getElementById('zen-overlay');
const zenProgressBar = document.getElementById('zen-progress-bar');
const zenRingProgress = document.getElementById('zen-ring-progress');
const zenPhaseTabBtns = document.querySelectorAll('.zen-phase-tab');
const zenBtnAmbient = document.getElementById('zen-btn-ambient');
const zenAmbientLabel = document.getElementById('zen-ambient-label');
const zenBtnPip = document.getElementById('zen-btn-pip');
const zenBtnFullscreen = document.getElementById('zen-btn-fullscreen');
const zenFullscreenLabel = document.getElementById('zen-fullscreen-label');
const zenBtnExit = document.getElementById('zen-btn-exit');
const zenPhaseLabel = document.getElementById('zen-phase-label');
const zenTimeDisplay = document.getElementById('zen-time-display');
const zenTaskPill = document.getElementById('zen-task-pill');
const zenTaskNameEl = document.getElementById('zen-task-name');
const zenIntentDisplay = document.getElementById('zen-intent-display');
const zenBtnReset = document.getElementById('zen-btn-reset');
const zenBtnToggle = document.getElementById('zen-btn-toggle');
const zenToggleIcon = document.getElementById('zen-toggle-icon');
const zenToggleLabel = document.getElementById('zen-toggle-label');
const zenBtnSkip = document.getElementById('zen-btn-skip');
const zenCheckinBanner = document.getElementById('zen-checkin-banner');
const zenBreakGuide = document.getElementById('zen-break-guide');

const analyticsRangeTabs = document.querySelectorAll('.range-tab');
const customRangeBar = document.getElementById('custom-range-bar');
const analyticsDateFrom = document.getElementById('analytics-date-from');
const analyticsDateTo = document.getElementById('analytics-date-to');
const statSessions = document.getElementById('stat-sessions');
const statSessionsLabel = document.getElementById('stat-sessions-label');
const statMinutes = document.getElementById('stat-minutes');
const statMinutesLabel = document.getElementById('stat-minutes-label');
const statStreak = document.getElementById('stat-streak');
const statStreakLabel = document.getElementById('stat-streak-label');
const goalLabelText = document.getElementById('goal-label-text');
const goalStatusText = document.getElementById('goal-status-text');
const goalProgressBar = document.getElementById('goal-progress-bar');
const focusQualityBarEl = document.getElementById('focus-quality-bar');
const proInsightsBarEl = document.getElementById('pro-insights-bar');
const chartTitleEl = document.getElementById('chart-title');
const chartMetaEl = document.getElementById('chart-meta');
const analyticsChartEl = document.getElementById('analytics-chart');
const projectBreakdownMetaEl = document.getElementById('project-breakdown-meta');
const projectStackedBarEl = document.getElementById('project-stacked-bar');
const projectBreakdownListEl = document.getElementById('project-breakdown-list');
const btnToggleSessionLog = document.getElementById('btn-toggle-session-log');
const sessionLogLabel = document.getElementById('session-log-label');
const btnExportTimesheet = document.getElementById('btn-export-timesheet');
const btnExportCsv = document.getElementById('btn-export-csv');
const btnExportJson = document.getElementById('btn-export-json');
const analyticsExportStatusEl = document.getElementById('analytics-export-status');
const sessionLogListEl = document.getElementById('session-log-list');

// --- INITIALIZATION ---
let suppressCloudSync = false;

function notifyWorkspaceChanged(reason = 'update') {
  if (suppressCloudSync) return;
  if (typeof window !== 'undefined' && window.PomodoroCloud && typeof window.PomodoroCloud.onWorkspaceChanged === 'function') {
    window.PomodoroCloud.onWorkspaceChanged(reason);
  }
}

function init() {
  suppressCloudSync = true;
  try {
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
  appSettings.ambientFade = appSettings.ambientFade !== false;
  appSettings.ambientAutoDuck = appSettings.ambientAutoDuck !== false;
  appSettings.guidedBreaks = appSettings.guidedBreaks !== false;
  appSettings.streakFreezeEnabled = appSettings.streakFreezeEnabled !== false;
  const rawRestDays = Array.isArray(appSettings.restDays) ? appSettings.restDays : [];
  appSettings.restDays = [...new Set(rawRestDays.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n <= 6))];

  const rawBlock = appSettings.blockedBreak || {};
  appSettings.blockedBreak = {
    enabled: Boolean(rawBlock.enabled),
    startTime: /^\d{2}:\d{2}$/.test(String(rawBlock.startTime || '')) ? rawBlock.startTime : '12:00',
    minutes: clampWholeNumber(rawBlock.minutes, 5, 240, 45)
  };
  if (!VALID_VISUAL_PALETTES.includes(appSettings.visualPalette)) appSettings.visualPalette = 'classic';
  if (!VALID_TIMER_LAYOUTS.includes(appSettings.timerLayout)) appSettings.timerLayout = 'clean';
  if (!VALID_TIMER_FONTS.includes(appSettings.timerFont)) appSettings.timerFont = 'sans';
  if (!VALID_BACKDROP_STYLES.includes(appSettings.backdropStyle)) appSettings.backdropStyle = 'glow';
  appSettings.compactUi = Boolean(appSettings.compactUi);
  appSettings.reducedMotion = Boolean(appSettings.reducedMotion);

  const defaultToday = new Date();
  const monthAgo = new Date(defaultToday.getFullYear(), defaultToday.getMonth(), defaultToday.getDate() - 29, 12, 0, 0);
  customDateRange.from = getLocalDateKey(monthAgo);
  customDateRange.to = getLocalDateKey(defaultToday);
  if (analyticsDateFrom) analyticsDateFrom.value = customDateRange.from;
  if (analyticsDateTo) analyticsDateTo.value = customDateRange.to;

  appSettings.soundMix = normalizeMixObject(appSettings.soundMix);
  const rawPresets = Array.isArray(appSettings.soundPresets) ? appSettings.soundPresets : [];
  appSettings.soundPresets = rawPresets
    .filter(p => p && typeof p.id === 'string' && typeof p.name === 'string' && p.name.trim())
    .slice(0, 8)
    .map(p => ({ id: p.id, name: p.name.trim().slice(0, 28), mix: normalizeMixObject(p.mix) }));

  // Migrate legacy single-track selection into soundMix if no mix layers are set yet
  if (getActiveMixTracks().length === 0 && SOUND_TRACK_MAP[appSettings.ambientSound]) {
    appSettings.soundMix[appSettings.ambientSound] = SOUND_TRACK_MAP[appSettings.ambientSound].defaultLevel;
  }

  if (getActiveMixTracks().length > 0 && appSettings.ambientWorkOnly) {
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
  processRecurringTasks();
  applyVisualSettings();
  applyTheme(theme);
  loadSettings();
  syncSessionIntentUI();
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
  renderBreakRecoveryContainers();
  } finally {
    suppressCloudSync = false;
  }
}

function checkDailyStatsReset() {
  const today = new Date().toDateString();
  if (dailyStats.date !== today) {
    dailyStats = { date: today, sessions: 0, minutes: 0 };
    saveDailyStats();
    processRecurringTasks();
  }
}

function saveDailyStats() {
  safeSetStorage('dailyStats', JSON.stringify(dailyStats));
  updateStatsDisplay();
  notifyWorkspaceChanged('stats');
}

function saveSessionHistory() {
  safeSetStorage('sessionHistory', JSON.stringify(sessionHistory));
  notifyWorkspaceChanged('sessions');
}

function recordCompletedSession(minutes, task, intentText = '') {
  const now = new Date();
  const entry = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    completedAt: now.getTime(),
    dateKey: getLocalDateKey(now),
    hour: now.getHours(),
    minutes: Math.max(1, Math.round(minutes)),
    taskId: task ? task.id : null,
    taskTitle: task && task.title ? task.title : 'Unassigned',
    project: task && task.project ? task.project.trim() : '',
    intent: String(intentText || '').trim(),
    focusRating: null,
    distractionTag: ''
  };
  sessionHistory.push(entry);
  saveSessionHistory();
  return entry;
}

function deleteSessionLog(entryId) {
  const idx = sessionHistory.findIndex(e => e.id === entryId);
  if (idx === -1) return;
  if (!confirm('Remove this logged session from analytics history?')) return;
  const [removed] = sessionHistory.splice(idx, 1);
  saveSessionHistory();
  if (pendingCheckinSessionId === removed.id) {
    pendingCheckinSessionId = null;
    checkinStatusMessage = '';
    renderCheckinContainers();
  }

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
  const restSet = new Set(Array.isArray(appSettings.restDays) ? appSettings.restDays : []);
  const restEnabled = restSet.size > 0 && restSet.size < 7;
  const freezeEnabled = appSettings.streakFreezeEnabled !== false;
  const todayKey = getLocalDateKey(today);
  const isTodayRest = restEnabled && restSet.has(today.getDay());
  const todayMet = (dailyMap.get(todayKey)?.sessions || 0) >= goal;

  if (dailyMap.size === 0) {
    return { current: 0, best: 0, todayMet, isTodayRest, freezesUsed: 0 };
  }

  let earliestKey = todayKey;
  dailyMap.forEach((bucket, key) => {
    if (bucket.sessions > 0 && key < earliestKey) earliestKey = key;
  });
  const startDate = parseDateKey(earliestKey) || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  const todayNoon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);

  let run = 0;
  let best = 0;
  let freezesUsed = 0;
  let daysSinceLastFreeze = 7;

  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0);
  while (cursor.getTime() < todayNoon.getTime()) {
    const key = getLocalDateKey(cursor);
    const sessions = dailyMap.get(key)?.sessions || 0;
    const met = sessions >= goal;
    const isRest = restEnabled && restSet.has(cursor.getDay());

    if (met) {
      run += 1;
      if (daysSinceLastFreeze < 7) daysSinceLastFreeze += 1;
    } else if (isRest) {
      if (daysSinceLastFreeze < 7) daysSinceLastFreeze += 1;
    } else if (freezeEnabled && run > 0 && daysSinceLastFreeze >= 7) {
      freezesUsed += 1;
      daysSinceLastFreeze = 0;
    } else {
      run = 0;
      freezesUsed = 0;
      daysSinceLastFreeze = 7;
    }

    if (run > best) best = run;
    cursor.setDate(cursor.getDate() + 1);
  }

  const current = todayMet ? run + 1 : run;
  if (current > best) best = current;
  return { current, best, todayMet, isTodayRest, freezesUsed };
}

function getDateRangeDays(numDays, today) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const restSet = new Set(Array.isArray(appSettings.restDays) ? appSettings.restDays : []);
  const days = [];
  for (let offset = numDays - 1; offset >= 0; offset--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset, 12, 0, 0);
    days.push({
      dateKey: getLocalDateKey(d),
      dayOfWeek: d.getDay(),
      shortLabel: offset === 0 ? 'Today' : dayNames[d.getDay()],
      isToday: offset === 0,
      isRest: restSet.size < 7 && restSet.has(d.getDay())
    });
  }
  return days;
}

function getCustomRangeDays(fromKey, toKey, today) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const restSet = new Set(Array.isArray(appSettings.restDays) ? appSettings.restDays : []);
  const todayKey = getLocalDateKey(today);
  let start = parseDateKey(fromKey) || new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29, 12, 0, 0);
  let end = parseDateKey(toKey) || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  if (start.getTime() > end.getTime()) [start, end] = [end, start];

  // Cap display grid to at most 366 days to stay snappy
  const maxSpanMs = 365 * 86400000;
  if (end.getTime() - start.getTime() > maxSpanMs) {
    start = new Date(end.getTime() - maxSpanMs);
  }

  const days = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 12, 0, 0);
  while (cursor.getTime() <= end.getTime()) {
    const key = getLocalDateKey(cursor);
    days.push({
      dateKey: key,
      dayOfWeek: cursor.getDay(),
      shortLabel: key === todayKey ? 'Today' : `${key.slice(5)}`,
      isToday: key === todayKey,
      isRest: restSet.size < 7 && restSet.has(cursor.getDay())
    });
    cursor.setDate(cursor.getDate() + 1);
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

function renderDailyBarsChart(days, dailyMap, goal, titleLabel) {
  const enriched = days.map(day => {
    const bucket = dailyMap.get(day.dateKey) || { sessions: 0, minutes: 0 };
    return { ...day, sessions: bucket.sessions, minutes: bucket.minutes };
  });

  const maxSessions = Math.max(...enriched.map(d => d.sessions), 0);
  const scaleMax = Math.max(goal, maxSessions, 1);
  const goalLinePct = Math.min(100, Math.round((goal / scaleMax) * 100));

  let bestDay = null;
  enriched.forEach(d => {
    if (d.sessions > 0 && (!bestDay || d.sessions > bestDay.sessions)) bestDay = d;
  });

  chartTitleEl.textContent = titleLabel;
  chartMetaEl.textContent = bestDay
    ? `Best: ${bestDay.shortLabel} · ${bestDay.sessions} sess (${formatDurationSummary(bestDay.minutes)})`
    : 'No sessions in this range';

  const isCompact = enriched.length > 14;
  if (!isCompact) {
    const countsHtml = enriched.map(d => `<span class="week-bar-count">${d.sessions > 0 ? d.sessions : ''}</span>`).join('');
    const barsHtml = enriched.map(d => {
      const heightPct = d.sessions > 0 ? Math.max(12, Math.round((d.sessions / scaleMax) * 100)) : 0;
      const heightStyle = heightPct > 0 ? `height: ${heightPct}%` : 'height: 3px';
      const metClass = d.sessions >= goal ? 'goal-met' : (d.sessions > 0 ? 'has-data' : (d.isRest ? 'is-rest' : ''));
      const tooltip = `${d.dateKey}${d.isRest ? ' (Rest)' : ''}: ${d.sessions} sess (${formatDurationSummary(d.minutes)})`;
      return `
        <div class="week-bar-col">
          <div class="week-bar-fill ${metClass}" style="${heightStyle}" title="${escapeHtml(tooltip)}"></div>
        </div>
      `;
    }).join('');
    const labelsHtml = enriched.map(d => `<span class="${d.isToday ? 'is-today' : ''}">${escapeHtml(d.shortLabel)}</span>`).join('');

    analyticsChartEl.innerHTML = `
      <div class="week-counts" style="grid-template-columns: repeat(${enriched.length}, 1fr);">${countsHtml}</div>
      <div class="week-chart-wrap">
        <div class="week-goal-line" style="bottom: ${goalLinePct}%" title="Daily goal: ${goal} sessions"></div>
        <div class="week-bars" style="grid-template-columns: repeat(${enriched.length}, 1fr);">${barsHtml}</div>
      </div>
      <div class="week-labels" style="grid-template-columns: repeat(${enriched.length}, 1fr);">${labelsHtml}</div>
    `;
    return;
  }

  const barsHtml = enriched.map(d => {
    const heightPct = d.sessions > 0 ? Math.max(12, Math.round((d.sessions / scaleMax) * 100)) : 0;
    const heightStyle = heightPct > 0 ? `height: ${heightPct}%` : 'height: 3px';
    const metClass = d.sessions >= goal ? 'goal-met' : (d.sessions > 0 ? 'has-data' : (d.isRest ? 'is-rest' : ''));
    const tooltip = `${d.dateKey}${d.isRest ? ' (Rest)' : ''}: ${d.sessions} sess (${formatDurationSummary(d.minutes)})`;
    return `
      <div class="week-bar-col">
        <div class="month-bar-fill ${metClass}" style="${heightStyle}" title="${escapeHtml(tooltip)}"></div>
      </div>
    `;
  }).join('');

  const startLabel = enriched[0]?.dateKey.slice(5) || '';
  const midLabel = enriched[Math.floor(enriched.length / 2)]?.dateKey.slice(5) || '';
  const endLabel = enriched[enriched.length - 1]?.isToday ? 'Today' : (enriched[enriched.length - 1]?.dateKey.slice(5) || '');

  analyticsChartEl.innerHTML = `
    <div class="week-chart-wrap">
      <div class="week-goal-line" style="bottom: ${goalLinePct}%" title="Daily goal: ${goal} sessions"></div>
      <div class="month-bars" style="grid-template-columns: repeat(${enriched.length}, 1fr);">${barsHtml}</div>
    </div>
    <div class="hourly-axis">
      <span>${escapeHtml(startLabel)}</span>
      <span>${escapeHtml(midLabel)}</span>
      <span>${escapeHtml(endLabel)}</span>
    </div>
  `;
}

function getHeatmapLevel(sessions, goal) {
  if (sessions <= 0) return 0;
  if (sessions >= goal) return 4;
  const ratio = sessions / Math.max(1, goal);
  if (ratio >= 0.66) return 3;
  if (ratio >= 0.33) return 2;
  return 1;
}

function renderYearHeatmap(days, dailyMap, goal, titleLabel) {
  const padCount = days[0] ? days[0].dayOfWeek : 0;
  const padded = [];
  for (let i = 0; i < padCount; i++) padded.push(null);
  days.forEach(d => padded.push(d));

  let activeDays = 0;
  days.forEach(d => {
    if ((dailyMap.get(d.dateKey)?.sessions || 0) > 0) activeDays += 1;
  });

  chartTitleEl.textContent = titleLabel;
  chartMetaEl.textContent = `${activeDays} active day${activeDays === 1 ? '' : 's'} of ${days.length}`;

  const cellsHtml = padded.map(d => {
    if (!d) return '<div class="heatmap-cell" style="opacity:0;pointer-events:none;"></div>';
    const bucket = dailyMap.get(d.dateKey) || { sessions: 0, minutes: 0 };
    const lvl = getHeatmapLevel(bucket.sessions, goal);
    const cls = [
      'heatmap-cell',
      lvl > 0 ? `level-${lvl}` : (d.isRest ? 'is-rest-empty' : ''),
      d.isToday ? 'is-today' : ''
    ].filter(Boolean).join(' ');
    const tooltip = `${d.dateKey}${d.isRest ? ' (Rest)' : ''}: ${bucket.sessions} sess (${formatDurationSummary(bucket.minutes)})`;
    return `<div class="${cls}" title="${escapeHtml(tooltip)}"></div>`;
  }).join('');

  const startStr = days[0]?.dateKey || '';
  const endStr = days[days.length - 1]?.dateKey || '';
  analyticsChartEl.innerHTML = `
    <div class="year-heatmap-scroll">
      <div class="year-heatmap-grid">${cellsHtml}</div>
    </div>
    <div class="heatmap-footer">
      <span>${escapeHtml(startStr)} – ${escapeHtml(endStr)}</span>
      <div class="heatmap-legend">
        <span>Less</span>
        <span class="heatmap-cell"></span>
        <span class="heatmap-cell level-1"></span>
        <span class="heatmap-cell level-2"></span>
        <span class="heatmap-cell level-3"></span>
        <span class="heatmap-cell level-4"></span>
        <span>More</span>
      </div>
    </div>
  `;
}

function renderProInsights(logs, streaks) {
  if (!proInsightsBarEl) return;
  const pills = [];

  // 1. Peak productivity hour across visible logs
  if (logs.length >= 2) {
    const hourMins = new Array(24).fill(0);
    logs.forEach(e => {
      const h = Number(e.hour);
      if (h >= 0 && h < 24) hourMins[h] += e.minutes;
    });
    let bestH = -1;
    let bestM = 0;
    hourMins.forEach((m, h) => {
      if (m > bestM) {
        bestM = m;
        bestH = h;
      }
    });
    if (bestH >= 0) {
      const hh = String(bestH).padStart(2, '0');
      pills.push(`<span class="insight-pill">Peak Hour: <strong>${hh}:00</strong> (${formatDurationSummary(bestM)})</span>`);
    }
  }

  // 2. Estimation accuracy across tracked tasks
  const trackedTasks = tasks.filter(t => t.estPomodoros > 0 && (t.completedPomodoros > 0 || t.isCompleted));
  if (trackedTasks.length > 0) {
    const sumEst = trackedTasks.reduce((acc, t) => acc + t.estPomodoros, 0);
    const sumAct = trackedTasks.reduce((acc, t) => acc + Math.max(t.completedPomodoros || 0, t.isCompleted ? t.estPomodoros : 0), 0);
    if (sumEst > 0 && sumAct > 0) {
      const ratio = sumAct / sumEst;
      const pct = Math.max(10, Math.round((1 - Math.abs(1 - ratio)) * 100));
      const note = ratio > 1.1 ? `${ratio.toFixed(1)}x est` : (ratio < 0.9 ? `${ratio.toFixed(1)}x est` : 'On target');
      pills.push(`<span class="insight-pill">Est. Accuracy: <strong>${pct}%</strong> (${note})</span>`);
    }
  }

  // 3. Human-friendly streak status
  if (streaks.isTodayRest) {
    pills.push(`<span class="insight-pill"><strong>Rest Day</strong> · Streak safe</span>`);
  } else if (streaks.freezesUsed > 0) {
    pills.push(`<span class="insight-pill">Streak Freeze: <strong>${streaks.freezesUsed} used</strong></span>`);
  }

  if (pills.length === 0) {
    proInsightsBarEl.classList.add('hidden');
    proInsightsBarEl.innerHTML = '';
    return;
  }
  proInsightsBarEl.classList.remove('hidden');
  proInsightsBarEl.innerHTML = pills.join('');
}

function getAnalyticsScopeData(today = new Date()) {
  const todayKey = getLocalDateKey(today);
  const dailyMap = buildDailyTotals(today);

  if (analyticsRange === 'today') {
    const logs = sessionHistory.filter(e => e.dateKey === todayKey);
    const totalSessions = Math.max(logs.length, dailyStats.date === today.toDateString() ? dailyStats.sessions : 0);
    const totalMinutes = Math.max(
      logs.reduce((acc, e) => acc + e.minutes, 0),
      dailyStats.date === today.toDateString() ? dailyStats.minutes : 0
    );
    return { range: 'today', days: null, logs, totalSessions, totalMinutes, dailyMap, label: 'today' };
  }

  let days;
  let label;
  if (analyticsRange === 'week') {
    days = getDateRangeDays(7, today);
    label = '7d';
  } else if (analyticsRange === 'month') {
    days = getDateRangeDays(30, today);
    label = '30d';
  } else if (analyticsRange === 'year') {
    days = getDateRangeDays(365, today);
    label = '365d';
  } else {
    days = getCustomRangeDays(customDateRange.from, customDateRange.to, today);
    label = `${days[0]?.dateKey || ''}_to_${days[days.length - 1]?.dateKey || ''}`;
  }

  const keySet = new Set(days.map(d => d.dateKey));
  const logs = sessionHistory.filter(e => keySet.has(e.dateKey));
  let totalSessions = 0;
  let totalMinutes = 0;
  days.forEach(d => {
    const bucket = dailyMap.get(d.dateKey);
    if (bucket) {
      totalSessions += bucket.sessions;
      totalMinutes += bucket.minutes;
    }
  });
  return { range: analyticsRange, days, logs, totalSessions, totalMinutes, dailyMap, label };
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
    const timeLabel = analyticsRange !== 'today'
      ? `${entry.dateKey.slice(5)} ${formatClockTime(entry.completedAt)}`
      : formatClockTime(entry.completedAt);
    const projectHtml = entry.project
      ? `<span class="session-log-project">${escapeHtml(entry.project)}</span>`
      : '';
    const ratingInfo = entry.focusRating && FOCUS_RATINGS[entry.focusRating]
      ? FOCUS_RATINGS[entry.focusRating]
      : null;
    const ratingHtml = ratingInfo
      ? `<span class="session-log-rating rating-${escapeHtml(entry.focusRating)}"${entry.distractionTag ? ` title="Distraction: ${escapeHtml(entry.distractionTag)}"` : ''}>${escapeHtml(ratingInfo.label)}${entry.distractionTag ? ` · ${escapeHtml(entry.distractionTag)}` : ''}</span>`
      : '';
    const intentTitle = entry.intent ? ` title="Intent: ${escapeHtml(entry.intent)}"` : '';
    return `
      <li class="session-log-item"${intentTitle}>
        <div class="session-log-main">
          <span class="session-log-time">${escapeHtml(timeLabel)}</span>
          <span class="session-log-title">${escapeHtml(entry.taskTitle)}</span>
          ${projectHtml}
          ${ratingHtml}
        </div>
        <div class="session-log-right">
          <span class="session-log-mins">+${entry.minutes}m</span>
          <button type="button" class="session-log-delete" data-session-id="${escapeHtml(entry.id)}" title="Remove log entry" aria-label="Remove log entry">${ICONS.close}</button>
        </div>
      </li>
    `;
  }).join('');
}

function renderFocusQualitySummary(logs) {
  if (!focusQualityBarEl) return;
  const rated = logs.filter(e => e.focusRating && FOCUS_RATINGS[e.focusRating]);
  if (rated.length === 0) {
    focusQualityBarEl.classList.add('hidden');
    focusQualityBarEl.innerHTML = '';
    return;
  }

  const avgScore = Math.round(rated.reduce((sum, e) => sum + FOCUS_RATINGS[e.focusRating].score, 0) / rated.length);
  const lockedCount = rated.filter(e => e.focusRating === 'locked').length;
  const tagCounts = new Map();
  rated.forEach(e => {
    if (e.distractionTag) tagCounts.set(e.distractionTag, (tagCounts.get(e.distractionTag) || 0) + 1);
  });
  let topTag = '';
  let topCount = 0;
  tagCounts.forEach((cnt, tag) => {
    if (cnt > topCount) {
      topTag = tag;
      topCount = cnt;
    }
  });

  const metaText = topTag
    ? `${lockedCount}/${rated.length} locked in · Top pull: ${topTag}`
    : `${lockedCount}/${rated.length} sessions locked in`;

  focusQualityBarEl.classList.remove('hidden');
  focusQualityBarEl.innerHTML = `
    <span class="focus-quality-score">Focus Quality: <strong>${avgScore}%</strong></span>
    <span class="focus-quality-meta">${escapeHtml(metaText)}</span>
  `;
}

function renderAnalytics() {
  const today = new Date();
  const goal = appSettings.dailyGoal;
  const scope = getAnalyticsScopeData(today);
  const streaks = computeStreaks(scope.dailyMap, goal, today);

  analyticsRangeTabs.forEach(tab => {
    const isActive = tab.dataset.range === analyticsRange;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  if (customRangeBar) {
    customRangeBar.classList.toggle('hidden', analyticsRange !== 'custom');
  }

  if (analyticsRange === 'today') {
    statSessions.textContent = scope.totalSessions;
    statSessionsLabel.textContent = 'Sessions Today';
    statMinutes.textContent = scope.totalMinutes;
    statMinutesLabel.textContent = 'Focus Minutes';
    statStreak.textContent = `${streaks.current}d`;
    statStreakLabel.textContent = streaks.isTodayRest
      ? `Rest Day (Best ${streaks.best}d)`
      : `Streak (Best ${streaks.best}d)`;

    const goalPct = Math.min(100, Math.round((scope.totalSessions / goal) * 100));
    goalLabelText.textContent = streaks.isTodayRest ? 'Daily Goal (Rest Day)' : 'Daily Goal';
    goalStatusText.textContent = scope.totalSessions >= goal
      ? `${scope.totalSessions} / ${goal} pomos · Goal met!`
      : `${scope.totalSessions} / ${goal} pomos (${goalPct}%)`;
    goalProgressBar.style.width = `${goalPct}%`;
    goalProgressBar.classList.toggle('reached', scope.totalSessions >= goal);

    renderFocusQualitySummary(scope.logs);
    renderProInsights(scope.logs, streaks);
    renderHourlyChart(scope.logs, today);
    renderProjectBreakdown(scope.logs, scope.totalSessions, scope.totalMinutes);
    renderSessionLogList(scope.logs);
    return;
  }

  const days = scope.days;
  const activeGoalDays = days.filter(d => !d.isRest);
  const goalDenom = Math.max(1, activeGoalDays.length);
  let goalDaysMet = 0;
  days.forEach(d => {
    const bucket = scope.dailyMap.get(d.dateKey);
    if (bucket && bucket.sessions >= goal) goalDaysMet += 1;
  });

  const prefixMap = { week: '7-Day', month: '30-Day', year: 'Year', custom: `${days.length}d` };
  const prefix = prefixMap[analyticsRange] || `${days.length}d`;
  const avgSessions = (scope.totalSessions / goalDenom).toFixed(1);

  statSessions.textContent = scope.totalSessions;
  statSessionsLabel.textContent = `${prefix} Sessions`;
  statMinutes.textContent = scope.totalMinutes;
  statMinutesLabel.textContent = `${prefix} Minutes`;
  statStreak.textContent = `${goalDaysMet}/${goalDenom}`;
  statStreakLabel.textContent = `Goal Days (Streak ${streaks.current}d)`;

  const avgRatio = (scope.totalSessions / goalDenom) / goal;
  const goalPct = Math.min(100, Math.round(avgRatio * 100));
  goalLabelText.textContent = `${prefix} Goal Pace`;
  goalStatusText.textContent = `${avgSessions} / ${goal} avg workday (${goalPct}%)`;
  goalProgressBar.style.width = `${goalPct}%`;
  goalProgressBar.classList.toggle('reached', (scope.totalSessions / goalDenom) >= goal);

  renderFocusQualitySummary(scope.logs);
  renderProInsights(scope.logs, streaks);

  if (analyticsRange === 'year' || days.length > 45) {
    const heading = analyticsRange === 'year' ? '365-Day Focus Heatmap' : `${days.length}-Day Heatmap`;
    renderYearHeatmap(days, scope.dailyMap, goal, heading);
  } else {
    const heading = analyticsRange === 'week' ? 'Last 7 Days' : (analyticsRange === 'month' ? 'Last 30 Days' : `${days.length}-Day Focus`);
    renderDailyBarsChart(days, scope.dailyMap, goal, heading);
  }

  renderProjectBreakdown(scope.logs, scope.totalSessions, scope.totalMinutes);
  renderSessionLogList(scope.logs);
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

function exportTimesheetCsv() {
  const scope = getAnalyticsScopeData(new Date());
  if (scope.logs.length === 0) {
    showExportStatus('No logged sessions in selected range to build timesheet.');
    return;
  }

  const byProject = new Map();
  scope.logs.forEach(entry => {
    const proj = entry.project || 'No Project';
    const bucket = byProject.get(proj) || {
      project: proj,
      sessions: 0,
      minutes: 0,
      ratingSum: 0,
      ratingCount: 0,
      tasks: new Set()
    };
    bucket.sessions += 1;
    bucket.minutes += entry.minutes;
    if (entry.focusRating && FOCUS_RATINGS[entry.focusRating]) {
      bucket.ratingSum += FOCUS_RATINGS[entry.focusRating].score;
      bucket.ratingCount += 1;
    }
    if (entry.taskTitle) bucket.tasks.add(entry.taskTitle);
    byProject.set(proj, bucket);
  });

  const rows = [
    ['range', 'project', 'sessions', 'totalMinutes', 'totalHours', 'avgFocusScorePct', 'tasks'].join(',')
  ];
  Array.from(byProject.values())
    .sort((a, b) => b.minutes - a.minutes)
    .forEach(b => {
      const avgFocus = b.ratingCount > 0 ? `${Math.round(b.ratingSum / b.ratingCount)}%` : '';
      rows.push([
        escapeCsvCell(scope.label),
        escapeCsvCell(b.project),
        escapeCsvCell(b.sessions),
        escapeCsvCell(b.minutes),
        escapeCsvCell((b.minutes / 60).toFixed(2)),
        escapeCsvCell(avgFocus),
        escapeCsvCell(Array.from(b.tasks).join('; '))
      ].join(','));
    });

  downloadFile(`pomodoro-timesheet-${scope.label}.csv`, rows.join('\n'), 'text/csv;charset=utf-8;');
  showExportStatus(`Exported timesheet (${byProject.size} project(s), ${scope.label}).`);
}

function exportSessionsCsv() {
  if (sessionHistory.length === 0) {
    showExportStatus('No completed work sessions logged yet.');
    return;
  }
  const ordered = [...sessionHistory].sort((a, b) => a.completedAt - b.completedAt);
  const rows = [
    ['id', 'date', 'time', 'completedAtISO', 'durationMinutes', 'taskTitle', 'project', 'intent', 'focusRating', 'distractionTag'].join(',')
  ];
  ordered.forEach(entry => {
    rows.push([
      escapeCsvCell(entry.id),
      escapeCsvCell(entry.dateKey),
      escapeCsvCell(formatClockTime(entry.completedAt)),
      escapeCsvCell(new Date(entry.completedAt).toISOString()),
      escapeCsvCell(entry.minutes),
      escapeCsvCell(entry.taskTitle),
      escapeCsvCell(entry.project || ''),
      escapeCsvCell(entry.intent || ''),
      escapeCsvCell(entry.focusRating || ''),
      escapeCsvCell(entry.distractionTag || '')
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
  if (toggleAmbientFade) toggleAmbientFade.checked = appSettings.ambientFade !== false;
  if (toggleAmbientDuck) toggleAmbientDuck.checked = appSettings.ambientAutoDuck !== false;
  toggleNotif.checked = Boolean(appSettings.notifications);
  toggleAutoStart.checked = Boolean(appSettings.autoStart);
  toggleAutoStartWork.checked = Boolean(appSettings.autoStartWork);
  if (toggleAutoSwitchTask) toggleAutoSwitchTask.checked = Boolean(appSettings.autoSwitchTask);
  if (toggleGuidedBreaks) toggleGuidedBreaks.checked = appSettings.guidedBreaks !== false;
  if (toggleStreakFreeze) toggleStreakFreeze.checked = appSettings.streakFreezeEnabled !== false;
  if (toggleBreakBlock) toggleBreakBlock.checked = Boolean(appSettings.blockedBreak?.enabled);
  if (breakBlockStart) breakBlockStart.value = appSettings.blockedBreak?.startTime || '12:00';
  if (breakBlockMins) breakBlockMins.value = appSettings.blockedBreak?.minutes || 45;
  if (toggleCompactUi) toggleCompactUi.checked = Boolean(appSettings.compactUi);
  if (toggleReducedMotion) toggleReducedMotion.checked = Boolean(appSettings.reducedMotion);
  syncRestDayButtons();
  syncAppearanceControls();
}

function syncRestDayButtons() {
  const restSet = new Set(Array.isArray(appSettings.restDays) ? appSettings.restDays : []);
  restDayBtns.forEach(btn => {
    const day = Number(btn.dataset.day);
    const active = restSet.has(day);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function saveSettings() {
  safeSetStorage('appSettings', JSON.stringify(appSettings));
  notifyWorkspaceChanged('settings');
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

if (toggleStreakFreeze) {
  toggleStreakFreeze.addEventListener('change', (e) => {
    appSettings.streakFreezeEnabled = e.target.checked;
    saveSettings();
    renderAnalytics();
  });
}
restDayBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const day = Number(btn.dataset.day);
    if (!Number.isInteger(day) || day < 0 || day > 6) return;
    const set = new Set(Array.isArray(appSettings.restDays) ? appSettings.restDays : []);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    appSettings.restDays = [...set].sort((a, b) => a - b);
    saveSettings();
    syncRestDayButtons();
    renderAnalytics();
  });
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

function handleCustomDateChange() {
  if (!analyticsDateFrom || !analyticsDateTo) return;
  if (analyticsDateFrom.value) customDateRange.from = analyticsDateFrom.value;
  if (analyticsDateTo.value) customDateRange.to = analyticsDateTo.value;
  renderAnalytics();
}
if (analyticsDateFrom) analyticsDateFrom.addEventListener('change', handleCustomDateChange);
if (analyticsDateTo) analyticsDateTo.addEventListener('change', handleCustomDateChange);

btnToggleSessionLog.addEventListener('click', () => {
  isSessionLogOpen = !isSessionLogOpen;
  renderAnalytics();
});

sessionLogListEl.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.session-log-delete');
  if (!deleteBtn) return;
  deleteSessionLog(deleteBtn.dataset.sessionId);
});

if (btnExportTimesheet) btnExportTimesheet.addEventListener('click', exportTimesheetCsv);
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

let lastSelectOptionsSig = '';

function syncAmbientSelectOptions(descriptor) {
  if (!ambientSelect) return;
  const presets = getAllAudioPresets();
  const sig = `${presets.map(p => `${p.id}:${p.name}`).join('|')}:${descriptor.key === 'custom' ? descriptor.label : ''}`;
  if (sig === lastSelectOptionsSig) return;
  lastSelectOptionsSig = sig;

  const opts = ['<option value="off">Off</option>'];
  if (descriptor.key === 'custom') {
    opts.push(`<option value="custom">${escapeHtml(descriptor.label)} (Mix)</option>`);
  }
  opts.push('<optgroup label="Presets">');
  presets.forEach(p => {
    opts.push(`<option value="preset:${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`);
  });
  opts.push('</optgroup>');
  opts.push('<optgroup label="Single Sounds">');
  SOUND_TRACKS.forEach(t => {
    opts.push(`<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`);
  });
  opts.push('</optgroup>');
  ambientSelect.innerHTML = opts.join('');
}

function ensureStudioMixerGrid() {
  if (!studioMixerGrid || studioMixerGrid.children.length > 0) return;
  studioMixerGrid.innerHTML = SOUND_TRACKS.map(track => `
    <div class="studio-channel" data-track-id="${escapeHtml(track.id)}">
      <div class="studio-channel-top">
        <button type="button" class="studio-channel-toggle" data-toggle-track="${escapeHtml(track.id)}" aria-pressed="false">
          <span class="studio-channel-dot" aria-hidden="true"></span>
          <span>${escapeHtml(track.label)}</span>
        </button>
        <span class="studio-channel-pct">0%</span>
      </div>
      <input type="range" class="studio-channel-slider" data-slider-track="${escapeHtml(track.id)}" min="0" max="1" step="0.05" value="0" aria-label="${escapeHtml(track.label)} volume">
    </div>
  `).join('');
}

function renderSoundStudioState() {
  if (!soundStudioPanel) return;
  soundStudioPanel.classList.toggle('hidden', !isSoundStudioOpen);
  if (studioSaveRow) {
    studioSaveRow.classList.toggle('hidden', !isStudioSaveFormOpen);
  }

  ensureStudioMixerGrid();
  const currentMix = normalizeMixObject(appSettings.soundMix);
  const activeCount = getActiveMixTracks().length;
  if (btnStudioSavePreset) btnStudioSavePreset.disabled = activeCount === 0;
  if (btnStudioClear) btnStudioClear.disabled = activeCount === 0;

  if (studioPresetsRow) {
    const presets = getAllAudioPresets();
    studioPresetsRow.innerHTML = presets.map(preset => {
      const isMatch = activeCount > 0 && areMixesEqual(currentMix, normalizeMixObject(preset.mix));
      const deleteHtml = preset.builtIn
        ? ''
        : `<button type="button" class="studio-preset-delete" data-delete-preset="${escapeHtml(preset.id)}" title="Delete preset" aria-label="Delete ${escapeHtml(preset.name)}">${ICONS.close}</button>`;
      return `
        <div class="studio-preset-pill ${isMatch ? 'active' : ''}">
          <button type="button" class="studio-preset-apply" data-apply-preset="${escapeHtml(preset.id)}">${escapeHtml(preset.name)}</button>
          ${deleteHtml}
        </div>
      `;
    }).join('');
  }

  if (studioMixerGrid) {
    const channels = studioMixerGrid.querySelectorAll('.studio-channel');
    channels.forEach(ch => {
      const id = ch.dataset.trackId;
      const val = clampVolume(currentMix[id], 0);
      const isActive = val > 0;
      ch.classList.toggle('is-active', isActive);
      const toggleBtn = ch.querySelector('.studio-channel-toggle');
      const pctEl = ch.querySelector('.studio-channel-pct');
      const sliderEl = ch.querySelector('.studio-channel-slider');
      if (toggleBtn) toggleBtn.setAttribute('aria-pressed', String(isActive));
      if (pctEl) pctEl.textContent = `${Math.round(val * 100)}%`;
      if (sliderEl && Number(sliderEl.value) !== val) sliderEl.value = String(val);
    });
  }
}

function applyAudioSelection(selectionKey) {
  if (selectionKey === 'off') {
    appSettings.soundMix = normalizeMixObject({});
    ambientWanted = false;
  } else if (selectionKey.startsWith('preset:')) {
    const presetId = selectionKey.slice(7);
    const preset = getAllAudioPresets().find(p => p.id === presetId);
    if (!preset) return;
    appSettings.soundMix = normalizeMixObject(preset.mix);
    ambientWanted = getActiveMixTracks().length > 0;
  } else if (SOUND_TRACK_MAP[selectionKey]) {
    appSettings.soundMix = normalizeMixObject({ [selectionKey]: SOUND_TRACK_MAP[selectionKey].defaultLevel });
    ambientWanted = true;
  } else {
    return;
  }
  saveSettings();
  syncAmbientPlayback();
}

function setTrackMixLevel(trackId, nextLevel, autoStartIfAdding = true) {
  if (!SOUND_TRACK_MAP[trackId]) return;
  const clamped = clampVolume(nextLevel, 0);
  const prev = clampVolume(appSettings.soundMix?.[trackId], 0);
  appSettings.soundMix = normalizeMixObject({ ...appSettings.soundMix, [trackId]: clamped });

  const hasAny = getActiveMixTracks().length > 0;
  if (!hasAny) {
    ambientWanted = false;
  } else if (autoStartIfAdding && prev === 0 && clamped > 0 && !appSettings.ambientWorkOnly) {
    ambientWanted = true;
  } else if (autoStartIfAdding && prev === 0 && clamped > 0 && appSettings.ambientWorkOnly) {
    ambientWanted = true;
  }
  saveSettings();
  syncAmbientPlayback();
}

ambientSelect.addEventListener('change', (e) => {
  applyAudioSelection(e.target.value);
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
  if (getActiveMixTracks().length === 0) return;
  ambientWanted = !ambientWanted;
  syncAmbientPlayback();
});

if (btnSoundStudio) {
  btnSoundStudio.addEventListener('click', () => {
    isSoundStudioOpen = !isSoundStudioOpen;
    if (!isSoundStudioOpen) isStudioSaveFormOpen = false;
    updateAmbientUI();
  });
}

if (btnStudioClear) {
  btnStudioClear.addEventListener('click', () => {
    applyAudioSelection('off');
  });
}

if (btnStudioSavePreset) {
  btnStudioSavePreset.addEventListener('click', () => {
    if (getActiveMixTracks().length === 0) return;
    isStudioSaveFormOpen = !isStudioSaveFormOpen;
    renderSoundStudioState();
    if (isStudioSaveFormOpen && studioPresetNameInput) {
      studioPresetNameInput.value = '';
      studioPresetNameInput.focus();
    }
  });
}

function confirmSaveCustomPreset() {
  if (!studioPresetNameInput) return;
  const name = studioPresetNameInput.value.trim().slice(0, 28);
  if (!name) return;
  if (getActiveMixTracks().length === 0) return;

  const newPreset = {
    id: `custom-${Date.now()}`,
    name,
    mix: normalizeMixObject(appSettings.soundMix)
  };
  const existing = Array.isArray(appSettings.soundPresets) ? appSettings.soundPresets : [];
  appSettings.soundPresets = [newPreset, ...existing.filter(p => p.name.toLowerCase() !== name.toLowerCase())].slice(0, 8);
  isStudioSaveFormOpen = false;
  saveSettings();
  updateAmbientUI();
}

if (btnStudioConfirmSave) btnStudioConfirmSave.addEventListener('click', confirmSaveCustomPreset);
if (btnStudioCancelSave) {
  btnStudioCancelSave.addEventListener('click', () => {
    isStudioSaveFormOpen = false;
    renderSoundStudioState();
  });
}
if (studioPresetNameInput) {
  studioPresetNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmSaveCustomPreset();
    } else if (e.key === 'Escape') {
      isStudioSaveFormOpen = false;
      renderSoundStudioState();
    }
  });
}

if (studioPresetsRow) {
  studioPresetsRow.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-delete-preset]');
    if (deleteBtn) {
      e.stopPropagation();
      const delId = deleteBtn.dataset.deletePreset;
      appSettings.soundPresets = (appSettings.soundPresets || []).filter(p => p.id !== delId);
      saveSettings();
      updateAmbientUI();
      return;
    }
    const presetBtn = e.target.closest('[data-apply-preset]');
    if (presetBtn) {
      applyAudioSelection(`preset:${presetBtn.dataset.applyPreset}`);
    }
  });
}

if (studioMixerGrid) {
  studioMixerGrid.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-toggle-track]');
    if (!toggleBtn) return;
    const trackId = toggleBtn.dataset.toggleTrack;
    const current = clampVolume(appSettings.soundMix?.[trackId], 0);
    const next = current > 0 ? 0 : (SOUND_TRACK_MAP[trackId]?.defaultLevel || 0.6);
    setTrackMixLevel(trackId, next, true);
  });

  studioMixerGrid.addEventListener('input', (e) => {
    const slider = e.target.closest('[data-slider-track]');
    if (!slider) return;
    setTrackMixLevel(slider.dataset.sliderTrack, slider.value, true);
  });
}

toggleAmbientWorkOnly.addEventListener('change', (e) => {
  appSettings.ambientWorkOnly = e.target.checked;
  if (appSettings.ambientWorkOnly && getActiveMixTracks().length > 0) {
    ambientWanted = true;
  } else if (!appSettings.ambientWorkOnly && !activeAmbient) {
    ambientWanted = false;
  }
  saveSettings();
  syncAmbientPlayback();
});
if (toggleAmbientFade) {
  toggleAmbientFade.addEventListener('change', (e) => {
    appSettings.ambientFade = e.target.checked;
    saveSettings();
  });
}
if (toggleAmbientDuck) {
  toggleAmbientDuck.addEventListener('change', (e) => {
    appSettings.ambientAutoDuck = e.target.checked;
    saveSettings();
  });
}
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
if (toggleGuidedBreaks) {
  toggleGuidedBreaks.addEventListener('change', (e) => {
    appSettings.guidedBreaks = e.target.checked;
    saveSettings();
    if (!appSettings.guidedBreaks) clearBreakRecoveryTimers();
    renderBreakRecoveryContainers();
  });
}

function getActiveVisualTokens(phaseOverride = timerState.phase) {
  const paletteObj = VISUAL_PALETTES[appSettings.visualPalette] || VISUAL_PALETTES.classic;
  const modeObj = paletteObj[theme === 'dark' ? 'dark' : 'light'] || paletteObj.light;
  return modeObj[phaseOverride] || modeObj.work;
}

function syncButtonChoiceGroup(btns, datasetKey, activeValue) {
  btns.forEach(btn => {
    const isActive = btn.dataset[datasetKey] === activeValue;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function syncAppearanceControls() {
  syncButtonChoiceGroup(paletteBtns, 'palette', appSettings.visualPalette);
  syncButtonChoiceGroup(timerLayoutBtns, 'timerLayout', appSettings.timerLayout);
  syncButtonChoiceGroup(timerFontBtns, 'timerFont', appSettings.timerFont);
  syncButtonChoiceGroup(backdropStyleBtns, 'backdrop', appSettings.backdropStyle);
  if (toggleCompactUi) toggleCompactUi.checked = Boolean(appSettings.compactUi);
  if (toggleReducedMotion) toggleReducedMotion.checked = Boolean(appSettings.reducedMotion);
}

function applyVisualSettings() {
  const palette = VALID_VISUAL_PALETTES.includes(appSettings.visualPalette) ? appSettings.visualPalette : 'classic';
  const layout = VALID_TIMER_LAYOUTS.includes(appSettings.timerLayout) ? appSettings.timerLayout : 'clean';
  const font = VALID_TIMER_FONTS.includes(appSettings.timerFont) ? appSettings.timerFont : 'sans';
  const backdrop = VALID_BACKDROP_STYLES.includes(appSettings.backdropStyle) ? appSettings.backdropStyle : 'glow';
  const density = appSettings.compactUi ? 'compact' : 'comfortable';
  const motion = appSettings.reducedMotion ? 'reduced' : 'full';

  htmlDoc.setAttribute('data-palette', palette);
  htmlDoc.setAttribute('data-timer-layout', layout);
  htmlDoc.setAttribute('data-timer-font', font);
  htmlDoc.setAttribute('data-backdrop', backdrop);
  htmlDoc.setAttribute('data-density', density);
  htmlDoc.setAttribute('data-motion', motion);

  lastFaviconKey = '';
  updateTabFavicon();
  syncPipThemeAndPhase();
  if (pipCanvasEl && document.pictureInPictureElement === pipVideoEl) {
    drawCanvasPipFrame();
  }
  notifyWorkspaceChanged('theme');
}

function bindButtonChoiceGroup(btns, datasetKey, validValues, settingKey) {
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset[datasetKey];
      if (!validValues.includes(val) || appSettings[settingKey] === val) return;
      appSettings[settingKey] = val;
      saveSettings();
      applyVisualSettings();
      syncAppearanceControls();
    });
  });
}

bindButtonChoiceGroup(paletteBtns, 'palette', VALID_VISUAL_PALETTES, 'visualPalette');
bindButtonChoiceGroup(timerLayoutBtns, 'timerLayout', VALID_TIMER_LAYOUTS, 'timerLayout');
bindButtonChoiceGroup(timerFontBtns, 'timerFont', VALID_TIMER_FONTS, 'timerFont');
bindButtonChoiceGroup(backdropStyleBtns, 'backdrop', VALID_BACKDROP_STYLES, 'backdropStyle');

if (toggleCompactUi) {
  toggleCompactUi.addEventListener('change', (e) => {
    appSettings.compactUi = e.target.checked;
    saveSettings();
    applyVisualSettings();
  });
}
if (toggleReducedMotion) {
  toggleReducedMotion.addEventListener('change', (e) => {
    appSettings.reducedMotion = e.target.checked;
    saveSettings();
    applyVisualSettings();
  });
}

if (btnAppearance && settingsAccordion) {
  btnAppearance.addEventListener('click', () => {
    settingsAccordion.open = true;
    btnAppearance.classList.add('is-active');
    if (appearanceSettingsGroup) {
      appearanceSettingsGroup.classList.remove('pulse-highlight');
      void appearanceSettingsGroup.offsetWidth;
      appearanceSettingsGroup.classList.add('pulse-highlight');
      appearanceSettingsGroup.scrollIntoView({ behavior: appSettings.reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  });
  settingsAccordion.addEventListener('toggle', () => {
    btnAppearance.classList.toggle('is-active', Boolean(settingsAccordion.open));
  });
}

function applyTheme(selectedTheme) {
  theme = selectedTheme === 'dark' ? 'dark' : 'light';
  htmlDoc.setAttribute('data-theme', theme);
  themeToggleIcon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  themeToggleLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  safeSetStorage('theme', theme);
  lastFaviconKey = '';
  updateTabFavicon();
  syncPipThemeAndPhase();
  if (pipCanvasEl && document.pictureInPictureElement === pipVideoEl) {
    drawCanvasPipFrame();
  }
  notifyWorkspaceChanged('theme');
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
  if (zenBtnToggle && zenToggleIcon && zenToggleLabel) {
    zenBtnToggle.classList.toggle('is-running', timerState.isRunning);
    zenBtnToggle.setAttribute('aria-pressed', String(timerState.isRunning));
    zenBtnToggle.title = btnToggleTimer.title;
    zenToggleIcon.innerHTML = timerToggleIcon.innerHTML;
    zenToggleLabel.textContent = timerToggleLabel.textContent;
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
  syncZenTaskAndIntent();
  updatePipWindow();
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

// --- KILLER FOCUS EXPERIENCES (INTENT, CHECK-IN, BREATHING BREAKS, ZEN, PIP, FAVICON) ---
function setSessionIntent(val) {
  currentSessionIntent = String(val || '').slice(0, 90);
  safeSetStorage('currentSessionIntent', currentSessionIntent);
  syncSessionIntentUI();
  updatePipWindow();
}

function syncSessionIntentUI() {
  if (!sessionIntentWrap || !sessionIntentInput) return;
  const isWork = timerState.phase === 'work';
  sessionIntentWrap.classList.toggle('hidden', !isWork);
  if (sessionIntentInput.value !== currentSessionIntent) {
    sessionIntentInput.value = currentSessionIntent;
  }
  if (btnClearIntent) {
    btnClearIntent.classList.toggle('hidden', !currentSessionIntent.trim());
  }
  syncZenTaskAndIntent();
}

function syncZenTaskAndIntent() {
  if (!zenTaskPill || !zenTaskNameEl) return;
  const activeTask = tasks.find(t => t.id === activeTaskId);
  if (activeTask) {
    zenTaskPill.classList.remove('is-empty');
    zenTaskPill.classList.toggle('is-completed', Boolean(activeTask.isCompleted));
    zenTaskNameEl.textContent = activeTask.title;
  } else {
    zenTaskPill.classList.add('is-empty');
    zenTaskPill.classList.remove('is-completed');
    zenTaskNameEl.textContent = tasks.length > 0 ? 'Select a task in dashboard' : 'Deep Focus';
  }
  if (zenIntentDisplay) {
    const trimmed = currentSessionIntent.trim();
    zenIntentDisplay.textContent = trimmed ? `"${trimmed}"` : '';
    zenIntentDisplay.classList.toggle('hidden', !trimmed || timerState.phase !== 'work');
  }
}

if (sessionIntentInput) {
  sessionIntentInput.addEventListener('input', (e) => {
    setSessionIntent(e.target.value);
  });
  sessionIntentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sessionIntentInput.blur();
    }
  });
}
if (btnClearIntent) {
  btnClearIntent.addEventListener('click', () => {
    setSessionIntent('');
    if (sessionIntentInput) sessionIntentInput.focus();
  });
}

function renderCheckinContainers() {
  const containers = [focusCheckinBanner, zenCheckinBanner].filter(Boolean);
  const entry = pendingCheckinSessionId
    ? sessionHistory.find(s => s.id === pendingCheckinSessionId)
    : null;

  if (!entry) {
    pendingCheckinSessionId = null;
    checkinStatusMessage = '';
    containers.forEach(el => {
      el.classList.add('hidden');
      el.innerHTML = '';
    });
    return;
  }

  const intentHtml = entry.intent
    ? `<div class="checkin-intent-note">Intent: "${escapeHtml(entry.intent)}"</div>`
    : '';
  const ratingChipsHtml = Object.entries(FOCUS_RATINGS).map(([key, info]) => {
    const active = entry.focusRating === key ? 'active' : '';
    return `<button type="button" class="checkin-chip ${active}" data-checkin-rating="${key}">${escapeHtml(info.label)}</button>`;
  }).join('');

  const showTags = entry.focusRating === 'okay' || entry.focusRating === 'distracted';
  const tagsHtml = showTags
    ? `
      <div class="checkin-tags-row">
        <span class="checkin-tags-label">Pull:</span>
        ${DISTRACTION_TAGS.map(tag => {
          const active = entry.distractionTag === tag ? 'active' : '';
          return `<button type="button" class="checkin-chip checkin-tag-chip ${active}" data-checkin-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
        }).join('')}
      </div>
    `
    : '';

  const titleText = checkinStatusMessage || 'Session logged! How was your focus?';
  const html = `
    <div class="checkin-header">
      <span class="checkin-title">${escapeHtml(titleText)}</span>
      <button type="button" class="checkin-close-btn" data-checkin-dismiss="1" title="Dismiss check-in" aria-label="Dismiss check-in">${ICONS.close}</button>
    </div>
    ${intentHtml}
    <div class="checkin-ratings-row">${ratingChipsHtml}</div>
    ${tagsHtml}
  `;

  containers.forEach(el => {
    el.classList.remove('hidden');
    el.innerHTML = html;
  });
}

function handleCheckinContainerClick(e) {
  const dismissBtn = e.target.closest('[data-checkin-dismiss]');
  if (dismissBtn) {
    pendingCheckinSessionId = null;
    checkinStatusMessage = '';
    renderCheckinContainers();
    return;
  }

  if (!pendingCheckinSessionId) return;
  const entry = sessionHistory.find(s => s.id === pendingCheckinSessionId);
  if (!entry) return;

  const ratingBtn = e.target.closest('[data-checkin-rating]');
  if (ratingBtn) {
    const chosen = ratingBtn.dataset.checkinRating;
    if (!FOCUS_RATINGS[chosen]) return;
    entry.focusRating = chosen;
    if (chosen === 'locked') entry.distractionTag = '';
    checkinStatusMessage = chosen === 'locked'
      ? 'Nice! Marked as Locked In.'
      : 'Saved! Optional: tag what pulled your focus.';
    saveSessionHistory();
    renderAnalytics();
    renderCheckinContainers();
    return;
  }

  const tagBtn = e.target.closest('[data-checkin-tag]');
  if (tagBtn) {
    const chosenTag = tagBtn.dataset.checkinTag;
    entry.distractionTag = entry.distractionTag === chosenTag ? '' : chosenTag;
    checkinStatusMessage = entry.distractionTag
      ? `Saved reflection (${entry.distractionTag})`
      : 'Saved reflection';
    saveSessionHistory();
    renderAnalytics();
    renderCheckinContainers();
  }
}

[focusCheckinBanner, zenCheckinBanner].filter(Boolean).forEach(el => {
  el.addEventListener('click', handleCheckinContainerClick);
});

function clearBreakRecoveryTimers() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
  if (eyeRestInterval) {
    clearInterval(eyeRestInterval);
    eyeRestInterval = null;
  }
  breathingRunning = false;
  eyeRestRunning = false;
  breathingPhaseIdx = 0;
  breathingStepLeft = BREATHING_PHASES[0].seconds;
  eyeRestLeft = 20;
}

function toggleBreathingExercise() {
  if (breathingRunning) {
    clearInterval(breathingInterval);
    breathingInterval = null;
    breathingRunning = false;
    breathingPhaseIdx = 0;
    breathingStepLeft = BREATHING_PHASES[0].seconds;
    renderBreakRecoveryContainers();
    return;
  }
  breathingRunning = true;
  breathingPhaseIdx = 0;
  breathingStepLeft = BREATHING_PHASES[0].seconds;
  renderBreakRecoveryContainers();
  breathingInterval = setInterval(() => {
    breathingStepLeft -= 1;
    if (breathingStepLeft <= 0) {
      breathingPhaseIdx = (breathingPhaseIdx + 1) % BREATHING_PHASES.length;
      breathingStepLeft = BREATHING_PHASES[breathingPhaseIdx].seconds;
    }
    renderBreakRecoveryContainers();
  }, 1000);
}

function toggleEyeRestExercise() {
  if (eyeRestRunning) {
    clearInterval(eyeRestInterval);
    eyeRestInterval = null;
    eyeRestRunning = false;
    eyeRestLeft = 20;
    renderBreakRecoveryContainers();
    return;
  }
  eyeRestRunning = true;
  eyeRestLeft = 20;
  renderBreakRecoveryContainers();
  eyeRestInterval = setInterval(() => {
    eyeRestLeft -= 1;
    if (eyeRestLeft <= 0) {
      clearInterval(eyeRestInterval);
      eyeRestInterval = null;
      eyeRestRunning = false;
      eyeRestLeft = 0;
    }
    renderBreakRecoveryContainers();
  }, 1000);
}

function renderBreakRecoveryContainers() {
  const containers = [breakRecoveryCard, zenBreakGuide].filter(Boolean);
  const shouldShow = (timerState.phase === 'shortBreak' || timerState.phase === 'longBreak') && appSettings.guidedBreaks !== false;
  if (!shouldShow) {
    containers.forEach(el => {
      el.classList.add('hidden');
      el.innerHTML = '';
    });
    return;
  }

  let bodyHtml = '';
  if (recoveryMode === 'breathing') {
    const phase = BREATHING_PHASES[breathingPhaseIdx];
    const orbClass = breathingRunning ? `phase-${phase.key}` : '';
    const cueLabel = breathingRunning ? phase.label : '4-7-8';
    const secsLabel = breathingRunning ? `${breathingStepLeft}s` : 'Ready';
    bodyHtml = `
      <div class="breathing-stage">
        <div class="breathing-orb ${orbClass}">
          <span class="breathing-cue">${cueLabel}</span>
          <span class="breathing-secs">${secsLabel}</span>
        </div>
      </div>
      <div class="recovery-subtext">Inhale 4s · Hold 7s · Exhale 8s to reset nervous system</div>
      <button type="button" class="small-btn" data-recovery-action="toggle-breathing">${breathingRunning ? 'Stop Breathing' : 'Start Breathing'}</button>
    `;
  } else if (recoveryMode === 'eye') {
    const badgeText = eyeRestLeft === 0 ? 'Done!' : `${eyeRestLeft}s`;
    bodyHtml = `
      <div class="eye-countdown-badge">${badgeText}</div>
      <div class="recovery-prompt">20-20-20 Rule: Look at least 20 feet away</div>
      <div class="recovery-subtext">Soften your gaze and blink slowly to relieve screen strain.</div>
      <button type="button" class="small-btn" data-recovery-action="toggle-eye">${eyeRestRunning ? 'Reset 20s' : (eyeRestLeft === 0 ? 'Restart 20s' : 'Start 20s Rest')}</button>
    `;
  } else {
    const stretch = DESK_STRETCHES[stretchIdx % DESK_STRETCHES.length];
    bodyHtml = `
      <div class="recovery-prompt">${escapeHtml(stretch.name)}</div>
      <div class="recovery-subtext">${escapeHtml(stretch.tip)}</div>
      <button type="button" class="small-btn" data-recovery-action="next-stretch">Next Stretch</button>
    `;
  }

  const html = `
    <div class="recovery-header">
      <span class="recovery-title">Guided Break Recovery</span>
      <div class="recovery-tabs" role="tablist" aria-label="Break Recovery Mode">
        <button type="button" class="recovery-tab ${recoveryMode === 'breathing' ? 'active' : ''}" data-recovery-mode="breathing">Breathe</button>
        <button type="button" class="recovery-tab ${recoveryMode === 'eye' ? 'active' : ''}" data-recovery-mode="eye">Eye Rest</button>
        <button type="button" class="recovery-tab ${recoveryMode === 'stretch' ? 'active' : ''}" data-recovery-mode="stretch">Stretch</button>
      </div>
    </div>
    <div class="recovery-body">${bodyHtml}</div>
  `;

  containers.forEach(el => {
    el.classList.remove('hidden');
    el.innerHTML = html;
  });
}

function handleRecoveryContainerClick(e) {
  const modeBtn = e.target.closest('[data-recovery-mode]');
  if (modeBtn) {
    const nextMode = modeBtn.dataset.recoveryMode;
    if (['breathing', 'eye', 'stretch'].includes(nextMode) && recoveryMode !== nextMode) {
      clearBreakRecoveryTimers();
      recoveryMode = nextMode;
      renderBreakRecoveryContainers();
    }
    return;
  }

  const actionBtn = e.target.closest('[data-recovery-action]');
  if (!actionBtn) return;
  const action = actionBtn.dataset.recoveryAction;
  if (action === 'toggle-breathing') toggleBreathingExercise();
  else if (action === 'toggle-eye') toggleEyeRestExercise();
  else if (action === 'next-stretch') {
    stretchIdx = (stretchIdx + 1) % DESK_STRETCHES.length;
    renderBreakRecoveryContainers();
  }
}

[breakRecoveryCard, zenBreakGuide].filter(Boolean).forEach(el => {
  el.addEventListener('click', handleRecoveryContainerClick);
});

function openZenMode() {
  if (!zenOverlay || isZenOpen) return;
  isZenOpen = true;
  zenOverlay.classList.remove('hidden');
  if (btnZenMode) {
    btnZenMode.classList.add('is-active');
    btnZenMode.setAttribute('aria-pressed', 'true');
  }
  syncZenModeView();
  syncZenTaskAndIntent();
  updateAmbientUI();
  renderCheckinContainers();
  renderBreakRecoveryContainers();
}

function closeZenMode() {
  if (!zenOverlay || !isZenOpen) return;
  isZenOpen = false;
  zenOverlay.classList.add('hidden');
  if (btnZenMode) {
    btnZenMode.classList.remove('is-active');
    btnZenMode.setAttribute('aria-pressed', 'false');
  }
  if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
    document.exitFullscreen().catch(() => {});
  }
}

function toggleZenMode() {
  if (isZenOpen) closeZenMode();
  else openZenMode();
}

function setRingProgress(ringEl, circumference, elapsedPct) {
  if (!ringEl) return;
  const clamped = Math.max(0, Math.min(100, Number(elapsedPct) || 0));
  ringEl.style.strokeDasharray = circumference.toFixed(2);
  ringEl.style.strokeDashoffset = (circumference * (clamped / 100)).toFixed(2);
}

function syncZenModeView(timeString, phaseText, elapsedPct) {
  if (!zenOverlay) return;
  if (timeString !== undefined && zenTimeDisplay) zenTimeDisplay.textContent = timeString;
  if (phaseText !== undefined && zenPhaseLabel) zenPhaseLabel.textContent = phaseText;
  if (elapsedPct !== undefined && zenProgressBar) zenProgressBar.style.width = `${elapsedPct}%`;
  if (elapsedPct !== undefined) setRingProgress(zenRingProgress, ZEN_RING_CIRCUMFERENCE, elapsedPct);
  zenPhaseTabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.phase === timerState.phase);
  });
}

if (btnZenMode) btnZenMode.addEventListener('click', toggleZenMode);
if (zenBtnExit) zenBtnExit.addEventListener('click', closeZenMode);
if (zenBtnToggle) {
  zenBtnToggle.addEventListener('click', () => {
    if (timerState.isRunning) pauseTimer();
    else startTimer();
  });
}
if (zenBtnReset) zenBtnReset.addEventListener('click', resetTimer);
if (zenBtnSkip) zenBtnSkip.addEventListener('click', skipTimer);
zenPhaseTabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchPhase(btn.dataset.phase));
});
if (zenBtnAmbient) {
  zenBtnAmbient.addEventListener('click', () => {
    if (getActiveMixTracks().length === 0) {
      applyAudioSelection('preset:deep-code');
    } else {
      btnAmbientToggle.click();
    }
  });
}
if (zenBtnPip) zenBtnPip.addEventListener('click', togglePipTimer);
if (zenBtnFullscreen) {
  zenBtnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement && zenOverlay && typeof zenOverlay.requestFullscreen === 'function') {
      zenOverlay.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
      document.exitFullscreen().catch(() => {});
    }
  });
}
document.addEventListener('fullscreenchange', () => {
  if (zenFullscreenLabel) {
    zenFullscreenLabel.textContent = document.fullscreenElement ? 'Windowed' : 'Fullscreen';
  }
});

// Dynamic Browser Tab Favicon Ring
function getPhaseAccentColor() {
  return getActiveVisualTokens().accent;
}

function updateTabFavicon(force = false) {
  if (!appFaviconLink) return;
  const total = getPhaseSeconds(timerState.phase);
  const remainingFrac = total > 0 ? Math.max(0, Math.min(1, timerState.remainingSeconds / total)) : 1;
  const ringStep = Math.round(remainingFrac * 48);
  const palette = appSettings.visualPalette || 'classic';
  const key = `${palette}:${timerState.phase}:${theme}:${timerState.isRunning}:${ringStep}`;
  if (!force && key === lastFaviconKey) return;
  lastFaviconKey = key;

  try {
    const canvas = document.createElement('canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return;
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accent = getPhaseAccentColor();
    const trackColor = theme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(31,36,44,0.12)';
    const cx = 16;
    const cy = 16;
    const r = 12;

    ctx.clearRect(0, 0, 32, 32);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = trackColor;
    ctx.stroke();

    if (remainingFrac > 0.01) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + Math.PI * 2 * remainingFrac;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = accent;
      ctx.stroke();
    }

    ctx.fillStyle = accent;
    if (timerState.isRunning) {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (remainingFrac < 0.999) {
      ctx.fillRect(12.5, 11.5, 2.5, 9);
      ctx.fillRect(17, 11.5, 2.5, 9);
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (typeof canvas.toDataURL === 'function') {
      appFaviconLink.href = canvas.toDataURL('image/png');
    }
  } catch {
    // Ignore in constrained/headless environments without 2D canvas
  }
}

// Always-on-Top Floating Mini Timer (Document PiP + Video PiP fallback)
function showPipInfo(message) {
  if (!pipStatusMsgEl) return;
  pipStatusMsgEl.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button type="button" class="checkin-close-btn" id="btn-close-pip-info" aria-label="Close notice">${ICONS.close}</button>
  `;
  pipStatusMsgEl.classList.remove('hidden');
  const closeBtn = document.getElementById('btn-close-pip-info');
  if (closeBtn) closeBtn.addEventListener('click', () => pipStatusMsgEl.classList.add('hidden'));
  clearTimeout(pipInfoTimeout);
  pipInfoTimeout = setTimeout(() => pipStatusMsgEl.classList.add('hidden'), 6000);
}

function getPipStylesheetText() {
  const tok = getActiveVisualTokens();
  const fontMap = {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif'
  };
  const clockFont = fontMap[appSettings.timerFont] || fontMap.sans;
  return `
    :root { --bg: ${tok.bg}; --card: ${tok.card}; --text: ${tok.text}; --muted: ${tok.muted}; --primary: ${tok.accent}; --primary-fg: ${tok.fg}; --border: ${tok.border}; --soft: ${tok.soft}; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 14px 16px; overflow: hidden; }
    .track { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: var(--border); }
    .bar { height: 100%; width: 0%; background: var(--primary); transition: width 0.25s linear; }
    .top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .phase { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); background: var(--soft); padding: 3px 9px; border-radius: 999px; }
    .time { font-family: ${clockFont}; font-size: 46px; font-weight: 800; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; text-align: center; line-height: 1.05; margin: 4px 0; }
    .task { font-size: 12px; color: var(--muted); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px; }
    .task strong { color: var(--text); }
    .actions { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 6px; }
    button { border: 1px solid var(--border); background: var(--card); color: var(--text); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; }
    button.primary { background: var(--primary); border-color: var(--primary); color: var(--primary-fg); min-width: 84px; }
    button:hover { border-color: var(--primary); }
  `;
}

function syncPipThemeAndPhase() {
  if (!pipWindow || pipWindow.closed) return;
  try {
    const doc = pipWindow.document;
    doc.documentElement.setAttribute('data-theme', theme);
    doc.documentElement.setAttribute('data-phase', timerState.phase);
    const styleEl = doc.getElementById('pip-theme-style');
    if (styleEl) styleEl.textContent = getPipStylesheetText();
  } catch {}
}

function setPipButtonState(active) {
  if (btnPipTimer) {
    btnPipTimer.classList.toggle('is-active', active);
    btnPipTimer.setAttribute('aria-pressed', String(active));
  }
  if (zenBtnPip) zenBtnPip.classList.toggle('is-active', active);
}

function drawCanvasPipFrame() {
  if (!pipCanvasEl) return;
  const ctx = pipCanvasEl.getContext('2d');
  if (!ctx) return;

  const w = pipCanvasEl.width;
  const h = pipCanvasEl.height;
  const tok = getActiveVisualTokens();
  const accent = tok.accent;
  const bg = tok.bg;
  const textCol = tok.text;
  const mutedCol = tok.muted;
  const pipFontFamily = appSettings.timerFont === 'mono'
    ? 'monospace'
    : (appSettings.timerFont === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif');

  const mins = Math.floor(timerState.remainingSeconds / 60);
  const secs = timerState.remainingSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const phaseMap = { work: 'WORK', shortBreak: 'SHORT BREAK', longBreak: 'LONG BREAK' };
  const total = getPhaseSeconds(timerState.phase);
  const pct = total > 0 ? Math.max(0, Math.min(1, (total - timerState.remainingSeconds) / total)) : 0;
  const activeTask = tasks.find(t => t.id === activeTaskId);
  const taskLabel = activeTask ? activeTask.title : 'Focus Session';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = tok.border;
  ctx.fillRect(0, 0, w, 6);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, Math.round(w * pct), 6);

  ctx.fillStyle = accent;
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(phaseMap[timerState.phase] || 'WORK', w / 2, 34);

  ctx.fillStyle = textCol;
  ctx.font = `bold 64px ${pipFontFamily}`;
  ctx.fillText(timeStr, w / 2, 108);

  ctx.fillStyle = mutedCol;
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(taskLabel.slice(0, 30), w / 2, 146);
}

function updatePipWindow() {
  if (pipCanvasEl && document.pictureInPictureElement === pipVideoEl) {
    drawCanvasPipFrame();
  }
  if (!pipWindow || pipWindow.closed) return;
  try {
    syncPipThemeAndPhase();
    const doc = pipWindow.document;
    const mins = Math.floor(timerState.remainingSeconds / 60);
    const secs = timerState.remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const total = getPhaseSeconds(timerState.phase);
    const pct = total > 0 ? Math.min(100, Math.max(0, ((total - timerState.remainingSeconds) / total) * 100)) : 0;
    const phaseMap = { work: 'Work Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };
    const isMidway = !timerState.isRunning && timerState.remainingSeconds > 0 && timerState.remainingSeconds < total;
    const activeTask = tasks.find(t => t.id === activeTaskId);

    const barEl = doc.getElementById('pip-bar');
    const phaseEl = doc.getElementById('pip-phase');
    const timeEl = doc.getElementById('pip-time');
    const taskEl = doc.getElementById('pip-task');
    const toggleBtn = doc.getElementById('pip-toggle');

    if (barEl) barEl.style.width = `${pct}%`;
    if (phaseEl) phaseEl.textContent = phaseMap[timerState.phase] || 'Work';
    if (timeEl) timeEl.textContent = timeStr;
    if (taskEl) {
      taskEl.textContent = activeTask
        ? `${activeTask.title}${currentSessionIntent.trim() && timerState.phase === 'work' ? ` — ${currentSessionIntent.trim()}` : ''}`
        : (currentSessionIntent.trim() && timerState.phase === 'work' ? currentSessionIntent.trim() : 'No task selected');
    }
    if (toggleBtn) {
      toggleBtn.textContent = timerState.isRunning ? 'Pause' : (isMidway ? 'Resume' : 'Start');
    }
  } catch {}
}

function closePipTimer() {
  if (pipWindow && !pipWindow.closed) {
    try { pipWindow.close(); } catch {}
  }
  pipWindow = null;
  if (document.pictureInPictureElement === pipVideoEl && typeof document.exitPictureInPicture === 'function') {
    document.exitPictureInPicture().catch(() => {});
  }
  if (pipStream) {
    pipStream.getTracks().forEach(t => { try { t.stop(); } catch {} });
    pipStream = null;
  }
  setPipButtonState(false);
}

async function togglePipTimer() {
  if (pipWindow && !pipWindow.closed) {
    closePipTimer();
    return;
  }
  if (pipVideoEl && document.pictureInPictureElement === pipVideoEl) {
    closePipTimer();
    return;
  }

  if (window.documentPictureInPicture && typeof window.documentPictureInPicture.requestWindow === 'function') {
    try {
      const win = await window.documentPictureInPicture.requestWindow({ width: 320, height: 205 });
      pipWindow = win;
      const styleEl = win.document.createElement('style');
      styleEl.id = 'pip-theme-style';
      styleEl.textContent = getPipStylesheetText();
      win.document.head.appendChild(styleEl);
      win.document.title = 'Pomodoro Mini';
      win.document.body.innerHTML = `
        <div class="track"><div id="pip-bar" class="bar"></div></div>
        <div class="top">
          <span id="pip-phase" class="phase">Work</span>
          <button type="button" id="pip-focus-tab" title="Return to main window">Expand</button>
        </div>
        <div id="pip-time" class="time">25:00</div>
        <div id="pip-task" class="task">No task selected</div>
        <div class="actions">
          <button type="button" id="pip-reset">Reset</button>
          <button type="button" id="pip-toggle" class="primary">Start</button>
          <button type="button" id="pip-skip">Skip</button>
        </div>
      `;

      win.document.getElementById('pip-toggle').addEventListener('click', () => {
        if (timerState.isRunning) pauseTimer();
        else startTimer();
      });
      win.document.getElementById('pip-reset').addEventListener('click', resetTimer);
      win.document.getElementById('pip-skip').addEventListener('click', skipTimer);
      win.document.getElementById('pip-focus-tab').addEventListener('click', () => {
        try { window.focus(); } catch {}
        closePipTimer();
      });
      win.addEventListener('pagehide', () => {
        pipWindow = null;
        setPipButtonState(false);
      });

      setPipButtonState(true);
      updatePipWindow();
      return;
    } catch {
      pipWindow = null;
    }
  }

  // Fallback to Canvas -> Video Picture-in-Picture if supported
  try {
    if (!pipCanvasEl) {
      pipCanvasEl = document.createElement('canvas');
      pipCanvasEl.width = 320;
      pipCanvasEl.height = 175;
    }
    if (typeof pipCanvasEl.captureStream === 'function') {
      drawCanvasPipFrame();
      if (!pipVideoEl) {
        pipVideoEl = document.createElement('video');
        pipVideoEl.muted = true;
        pipVideoEl.playsInline = true;
        pipVideoEl.addEventListener('leavepictureinpicture', () => {
          closePipTimer();
        });
      }
      if (typeof pipVideoEl.requestPictureInPicture === 'function') {
        pipStream = pipCanvasEl.captureStream(2);
        pipVideoEl.srcObject = pipStream;
        await pipVideoEl.play();
        await pipVideoEl.requestPictureInPicture();
        setPipButtonState(true);
        return;
      }
    }
  } catch {
    closePipTimer();
  }

  showPipInfo('Floating Mini Timer is unavailable in this browser context — try Zen Mode (Z) instead.');
}

if (btnPipTimer) btnPipTimer.addEventListener('click', togglePipTimer);

// --- TIMER LOGIC ---
function startTimer() {
  if (timerState.isRunning) return;
  if (timerState.phase === 'work' && pendingCheckinSessionId) {
    pendingCheckinSessionId = null;
    checkinStatusMessage = '';
    renderCheckinContainers();
  }
  checkDailyStatsReset();
  getAudioContext();
  timerState.isRunning = true;
  targetEndTime = Date.now() + (timerState.remainingSeconds * 1000);
  updateTimerToggleButton();
  syncAmbientPlayback();
  updateTabFavicon(true);
  updatePipWindow();
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
      const recorded = recordCompletedSession(workMins, activeTask, currentSessionIntent);
      pendingCheckinSessionId = recorded.id;
      checkinStatusMessage = '';
      setSessionIntent('');
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
  renderCheckinContainers();

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
  if (timerState.phase === 'work') {
    clearBreakRecoveryTimers();
  }
  syncSessionIntentUI();
  renderBreakRecoveryContainers();
  syncPipThemeAndPhase();
  lastFaviconKey = '';
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
  setRingProgress(timerRingProgress, TIMER_RING_CIRCUMFERENCE, elapsedPct);

  updateTimerToggleButton();
  syncZenModeView(timeString, phaseText, elapsedPct);
  updateTabFavicon();
  updatePipWindow();
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
    if (typeof window !== 'undefined' && window.PomodoroCloud && typeof window.PomodoroCloud.closeTopModal === 'function' && window.PomodoroCloud.closeTopModal()) {
      return;
    }
    if (isZenOpen) {
      closeZenMode();
    } else if (!taskDropdownMenu.classList.contains('hidden')) {
      taskDropdownMenu.classList.add('hidden');
    } else if (editingTaskId) {
      cancelEdit();
    } else if (!addTaskContainer.classList.contains('hidden')) {
      resetTaskForm();
    }
    return;
  }

  const activeEl = document.activeElement;
  const tag = activeEl ? activeEl.tagName : '';
  const isTextInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || Boolean(activeEl && activeEl.isContentEditable);

  if ((e.key === 'z' || e.key === 'Z') && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (isTextInput) return;
    e.preventDefault();
    toggleZenMode();
    return;
  }

  if (e.code === 'Space' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const isInteractive = isTextInput || ['BUTTON', 'SUMMARY', 'A'].includes(tag);
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

function processRecurringTasks(today = new Date()) {
  const todayKey = getLocalDateKey(today);
  const dow = today.getDay();
  let changed = false;

  tasks.forEach(t => {
    if (!t.recurrence || t.recurrence === 'none' || !t.isCompleted) return;
    if (!t.lastCompletedDate || t.lastCompletedDate >= todayKey) return;
    if (t.lastRecurredDate === todayKey) return;

    const shouldRespawn =
      t.recurrence === 'daily' ||
      (t.recurrence === 'weekdays' && dow >= 1 && dow <= 5) ||
      (t.recurrence === 'weekly' && dow === t.recurWeekday);

    if (shouldRespawn) {
      t.isCompleted = false;
      t.completedPomodoros = 0;
      t.bucket = 'today';
      t.lastRecurredDate = todayKey;
      if (Array.isArray(t.subtasks)) {
        t.subtasks = t.subtasks.map(s => ({ ...s, done: false }));
      }
      changed = true;
    }
  });

  if (changed) saveTasks();
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
  return tasks.filter(t => {
    if (activeTaskBucket !== 'all' && t.bucket !== activeTaskBucket) return false;
    if (selectedProjectFilter && (t.project || '').trim() !== selectedProjectFilter) return false;
    return true;
  });
}

function syncBucketTabs() {
  const todayCount = tasks.filter(t => t.bucket !== 'backlog').length;
  const backlogCount = tasks.filter(t => t.bucket === 'backlog').length;
  if (bucketCountTodayEl) bucketCountTodayEl.textContent = String(todayCount);
  if (bucketCountBacklogEl) bucketCountBacklogEl.textContent = String(backlogCount);

  taskBucketTabs.forEach(tab => {
    const isActive = tab.dataset.bucket === activeTaskBucket;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
}

taskBucketTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const next = tab.dataset.bucket;
    if (!VALID_TASK_BUCKETS.includes(next) || activeTaskBucket === next) return;
    activeTaskBucket = next;
    editingTaskId = null;
    renderTasks();
  });
});

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
      pendingCheckinSessionId = null;
      checkinStatusMessage = '';
      setSessionIntent('');
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
      renderCheckinContainers();
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
function parseSubtasksTextarea(rawText, existingSubtasks = []) {
  const lines = String(rawText || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 30);
  const doneMap = new Map();
  existingSubtasks.forEach(s => {
    if (s && s.text) doneMap.set(s.text.trim().toLowerCase(), Boolean(s.done));
  });
  return lines.map((line, idx) => {
    const text = line.slice(0, 120);
    return {
      id: `sub-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
      text,
      done: doneMap.get(text.toLowerCase()) || false
    };
  });
}

btnShowAddTask.addEventListener('click', () => {
  if (editingTaskId) {
    editingTaskId = null;
    renderTasks();
  }
  btnShowAddTask.classList.add('hidden');
  addTaskContainer.classList.remove('hidden');
  if (inputBucket) {
    inputBucket.value = activeTaskBucket === 'backlog' ? 'backlog' : 'today';
  }
  if (inputRecurrence) inputRecurrence.value = 'none';
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
if (btnAddSubtasks && inputSubtasks) bindExtraFieldToggle(btnAddSubtasks, inputSubtasks);
bindExtraFieldToggle(btnAddNote, inputNote);
bindExtraFieldToggle(btnAddProject, inputProject);

function resetTaskForm() {
  inputTitle.value = '';
  inputEst.value = '';
  if (inputBucket) inputBucket.value = activeTaskBucket === 'backlog' ? 'backlog' : 'today';
  if (inputRecurrence) inputRecurrence.value = 'none';
  if (inputSubtasks) {
    inputSubtasks.value = '';
    inputSubtasks.classList.add('hidden');
  }
  if (btnAddSubtasks) btnAddSubtasks.classList.remove('hidden');
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
  const bucketVal = inputBucket && inputBucket.value === 'backlog' ? 'backlog' : 'today';
  const recurVal = inputRecurrence && VALID_RECURRENCES.includes(inputRecurrence.value) ? inputRecurrence.value : 'none';
  const subtasks = inputSubtasks ? parseSubtasksTextarea(inputSubtasks.value) : [];

  const newTask = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: titleVal,
    estPomodoros: estResult.value,
    completedPomodoros: 0,
    isCompleted: false,
    note: inputNote.value.trim(),
    project: projectVal,
    bucket: bucketVal,
    recurrence: recurVal,
    recurWeekday: new Date().getDay(),
    lastCompletedDate: '',
    lastRecurredDate: '',
    subtasks
  };
  tasks.push(newTask);
  if (!activeTaskId && bucketVal === 'today') activeTaskId = newTask.id;
  if (activeTaskBucket !== 'all' && activeTaskBucket !== bucketVal) {
    activeTaskBucket = bucketVal;
  }
  if (selectedProjectFilter && projectVal !== selectedProjectFilter) {
    selectedProjectFilter = '';
  }
  saveTasks();
  renderTasks();
  resetTaskForm();
}

btnSaveTask.addEventListener('click', submitNewTask);
bindFormEnterSubmit([inputTitle, inputEst, inputProject], submitNewTask);

// 3. Render Tasks (Day Buckets, Subtasks, Recurrence & Inline Edit)
function renderTasks() {
  syncProjectFilter();
  syncBucketTabs();
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  if (visibleTasks.length === 0 && tasks.length > 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'task-empty-state';
    emptyLi.textContent = activeTaskBucket === 'backlog'
      ? 'Backlog is empty. Move tasks here for future days.'
      : 'No tasks match this view. Switch tabs or add a task below.';
    taskList.appendChild(emptyLi);
  }

  visibleTasks.forEach((task, visibleIdx) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.id === activeTaskId ? 'active' : ''} ${task.isCompleted ? 'completed' : ''}`;

    if (editingTaskId === task.id) {
      li.classList.add('add-task-container', 'edit-mode-card');
      li.classList.remove('task-item');
      const hasSubtasks = Array.isArray(task.subtasks) && task.subtasks.length > 0;

      li.innerHTML = `
        <input type="text" class="task-title-input" required autocomplete="off">
        <div class="task-form-details">
          <div class="task-planning-row">
            <div class="pomo-numbers-row">
              <div class="est-pomo-wrapper">
                <label>Act</label>
                <input type="number" class="task-est-input task-act-input" min="0" step="1">
              </div>
              <span class="pomo-slash">/</span>
              <div class="est-pomo-wrapper">
                <label>Est Pomos</label>
                <input type="number" class="task-est-input task-edit-est-input" min="1" step="1">
              </div>
            </div>
            <div class="est-pomo-wrapper">
              <label>Plan</label>
              <select class="settings-select task-plan-select edit-bucket-select">
                <option value="today">Today</option>
                <option value="backlog">Backlog</option>
              </select>
            </div>
            <div class="est-pomo-wrapper">
              <label>Repeat</label>
              <select class="settings-select task-plan-select edit-recurrence-select">
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div class="extra-fields-toggles">
            <button type="button" class="link-btn btn-edit-subtasks ${hasSubtasks ? 'hidden' : ''}">+ Subtasks</button>
            <button type="button" class="link-btn btn-edit-note ${task.note ? 'hidden' : ''}">+ Add Note</button>
            <button type="button" class="link-btn btn-edit-project ${task.project ? 'hidden' : ''}">+ Add Project</button>
          </div>
          <textarea class="task-extra-input edit-subtasks-input ${hasSubtasks ? '' : 'hidden'}" placeholder="Subtasks (one step per line)..."></textarea>
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
      const editBucketSelect = li.querySelector('.edit-bucket-select');
      const editRecurSelect = li.querySelector('.edit-recurrence-select');
      const editSubtasksBtn = li.querySelector('.btn-edit-subtasks');
      const editNoteBtn = li.querySelector('.btn-edit-note');
      const editProjectBtn = li.querySelector('.btn-edit-project');
      const editSubtasksInput = li.querySelector('.edit-subtasks-input');
      const editNoteInput = li.querySelector('.edit-note-input');
      const editProjectInput = li.querySelector('.edit-project-input');

      editTitleInput.value = task.title;
      editActInput.value = task.completedPomodoros || 0;
      editEstInput.value = task.estPomodoros !== null ? task.estPomodoros : '';
      editBucketSelect.value = task.bucket === 'backlog' ? 'backlog' : 'today';
      editRecurSelect.value = VALID_RECURRENCES.includes(task.recurrence) ? task.recurrence : 'none';
      editSubtasksInput.value = hasSubtasks ? task.subtasks.map(s => s.text).join('\n') : '';
      editNoteInput.value = task.note || '';
      editProjectInput.value = task.project || '';

      const submitEdit = () => saveEdit(
        task.id,
        editTitleInput,
        editActInput,
        editEstInput,
        editNoteInput,
        editProjectInput,
        editBucketSelect,
        editRecurSelect,
        editSubtasksInput
      );

      bindExtraFieldToggle(editSubtasksBtn, editSubtasksInput);
      bindExtraFieldToggle(editNoteBtn, editNoteInput);
      bindExtraFieldToggle(editProjectBtn, editProjectInput);
      bindFormEnterSubmit([editTitleInput, editActInput, editEstInput, editProjectInput], submitEdit);
      li.querySelector('.btn-edit-delete').addEventListener('click', () => deleteTask(task.id));
      li.querySelector('.btn-edit-cancel').addEventListener('click', cancelEdit);
      li.querySelector('.btn-edit-save').addEventListener('click', submitEdit);
    } else {
      li.addEventListener('click', (e) => {
        if (e.target.closest('.custom-checkbox') || e.target.closest('.task-actions-group') || e.target.closest('.task-subtasks-list')) return;
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
      const recurLabel = RECURRENCE_LABELS[task.recurrence];
      const recurTag = recurLabel ? `<span class="task-recur-tag">${escapeHtml(recurLabel)}</span>` : '';
      const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
      const doneSubs = subtasks.filter(s => s.done).length;
      const subBadge = subtasks.length > 0 ? `<span class="task-subtask-badge">${doneSubs}/${subtasks.length} steps</span>` : '';
      const swapTitle = task.bucket === 'backlog' ? 'Move to Today' : 'Move to Backlog';

      let htmlContent = `
        <div class="task-main-row">
          <div class="task-info-group">
            <button type="button" class="custom-checkbox" title="${checkLabel}" aria-label="${checkLabel}" aria-pressed="${task.isCompleted ? 'true' : 'false'}">${checkIcon}</button>
            <span class="task-title-text">${escapeHtml(task.title)} ${projectTag} ${recurTag} ${subBadge}</span>
          </div>
          <div class="task-right-group">
            ${countDisplay}
            <div class="task-actions-group">
              <button type="button" class="task-icon-btn btn-swap-bucket" title="${swapTitle}" aria-label="${swapTitle}">${ICONS.bucketSwap}</button>
              <button type="button" class="task-icon-btn btn-move-up" title="Move up" aria-label="Move task up" ${visibleIdx === 0 ? 'disabled' : ''}>${ICONS.chevronUp}</button>
              <button type="button" class="task-icon-btn btn-move-down" title="Move down" aria-label="Move task down" ${visibleIdx === visibleTasks.length - 1 ? 'disabled' : ''}>${ICONS.chevronDown}</button>
              <button type="button" class="task-icon-btn btn-open-edit" title="Edit task" aria-label="Edit task">${ICONS.edit}</button>
            </div>
          </div>
        </div>
      `;

      if (subtasks.length > 0) {
        htmlContent += `
          <ul class="task-subtasks-list">
            ${subtasks.map(sub => `
              <li class="task-subtask-item ${sub.done ? 'is-done' : ''}">
                <button type="button" class="subtask-check-btn" data-subtask-id="${escapeHtml(sub.id)}" aria-label="${sub.done ? 'Uncheck step' : 'Complete step'}" aria-pressed="${sub.done ? 'true' : 'false'}">${sub.done ? ICONS.check : ''}</button>
                <span class="subtask-label">${escapeHtml(sub.text)}</span>
              </li>
            `).join('')}
          </ul>
        `;
      }

      if (task.note) {
        htmlContent += `<div class="task-note-box">${escapeHtml(task.note).replace(/\n/g, '<br>')}</div>`;
      }
      li.innerHTML = htmlContent;
      li.querySelector('.custom-checkbox').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(task.id);
      });
      li.querySelector('.btn-swap-bucket').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskBucket(task.id);
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
      li.querySelectorAll('.subtask-check-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSubtask(task.id, btn.dataset.subtaskId);
        });
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

function saveEdit(id, titleEl, actEl, estEl, noteEl, projectEl, bucketEl, recurEl, subtasksEl) {
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
    const bucketVal = bucketEl && bucketEl.value === 'backlog' ? 'backlog' : 'today';
    const recurVal = recurEl && VALID_RECURRENCES.includes(recurEl.value) ? recurEl.value : 'none';
    const existingSubs = tasks[taskIndex].subtasks || [];

    tasks[taskIndex].title = titleVal;
    tasks[taskIndex].completedPomodoros = actResult.value;
    tasks[taskIndex].estPomodoros = estResult.value;
    tasks[taskIndex].note = noteEl.value.trim();
    tasks[taskIndex].project = projectVal;
    tasks[taskIndex].bucket = bucketVal;
    tasks[taskIndex].recurrence = recurVal;
    if (subtasksEl) {
      tasks[taskIndex].subtasks = parseSubtasksTextarea(subtasksEl.value, existingSubs);
    }

    if (selectedProjectFilter && projectVal !== selectedProjectFilter) {
      selectedProjectFilter = '';
    }
  }
  editingTaskId = null;
  saveTasks();
  renderTasks();
}

function toggleTaskBucket(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.bucket = task.bucket === 'backlog' ? 'today' : 'backlog';
  if (task.bucket === 'today' && !activeTaskId) {
    activeTaskId = task.id;
  }
  saveTasks();
  renderTasks();
}

function toggleSubtask(taskId, subtaskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task || !Array.isArray(task.subtasks)) return;
  const sub = task.subtasks.find(s => s.id === subtaskId);
  if (!sub) return;
  sub.done = !sub.done;
  saveTasks();
  renderTasks();
}

function toggleTaskComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.isCompleted = !task.isCompleted;
  task.lastCompletedDate = task.isCompleted ? getLocalDateKey() : '';

  if (appSettings.autoSwitchTask) {
    if (task.isCompleted && id === activeTaskId) {
      const visibleTasks = getVisibleTasks();
      const idx = visibleTasks.findIndex(t => t.id === id);
      const nextTask = idx !== -1
        ? (visibleTasks.slice(idx + 1).find(t => !t.isCompleted) || visibleTasks.slice(0, idx).find(t => !t.isCompleted))
        : tasks.find(t => !t.isCompleted && t.bucket === 'today');
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

function buildDayTimelineBlocks(visibleTasks) {
  const workSecs = getPhaseSeconds('work');
  const shortBreakSecs = getPhaseSeconds('shortBreak');
  const longBreakSecs = getPhaseSeconds('longBreak');
  const interval = appSettings.longBreakInterval;
  const nowMs = Date.now();
  let cursorMs = nowMs;

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const activeIsCounted = activeTask && !activeTask.isCompleted && (activeTask.estPomodoros || 0) > 0;
  const elapsedInCurrentSession = (timerState.isRunning && timerState.phase === 'work' && activeIsCounted)
    ? Math.max(0, workSecs - (timerState.remainingSeconds || 0))
    : 0;

  let blockedStartMs = null;
  let blockedEndMs = null;
  let blockedInserted = false;
  const blockCfg = appSettings.blockedBreak;
  if (blockCfg && blockCfg.enabled && /^\d{2}:\d{2}$/.test(blockCfg.startTime || '')) {
    const [bh, bm] = blockCfg.startTime.split(':').map(Number);
    const d = new Date(nowMs);
    d.setHours(bh, bm, 0, 0);
    blockedStartMs = d.getTime();
    blockedEndMs = blockedStartMs + (blockCfg.minutes * 60000);
    if (blockedEndMs <= nowMs) {
      blockedStartMs += 86400000;
      blockedEndMs += 86400000;
    }
  }

  const blocks = [];
  let pomoIndex = 0;

  const maybeInsertBlocked = (durationMs) => {
    if (blockedStartMs === null || blockedInserted) return;
    if (cursorMs < blockedEndMs && cursorMs + durationMs > blockedStartMs) {
      const bStart = Math.max(cursorMs, blockedStartMs);
      blocks.push({
        kind: 'blocked',
        label: 'Reserved Break / Lunch',
        startMs: bStart,
        endMs: Math.max(bStart, blockedEndMs),
        minutes: blockCfg.minutes
      });
      cursorMs = Math.max(cursorMs, blockedEndMs);
      blockedInserted = true;
    }
  };

  // Count total remaining pomos to avoid placing a trailing break after the final session
  const pendingItems = [];
  visibleTasks.forEach(t => {
    const est = t.estPomodoros || 0;
    const done = t.completedPomodoros || 0;
    if (est > 0 && !t.isCompleted) {
      const rem = Math.max(0, est - done);
      for (let k = 0; k < rem; k++) {
        pendingItems.push({ title: t.title, stepLabel: est > 1 ? `${done + k + 1}/${est}` : '' });
      }
    }
  });

  pendingItems.forEach((item, idx) => {
    const isFirstActive = idx === 0 && timerState.isRunning && timerState.phase === 'work';
    const thisWorkMs = Math.max(60000, (workSecs - (isFirstActive ? elapsedInCurrentSession : 0)) * 1000);
    maybeInsertBlocked(thisWorkMs);
    blocks.push({
      kind: 'work',
      label: item.stepLabel ? `${item.title} (${item.stepLabel})` : item.title,
      startMs: cursorMs,
      endMs: cursorMs + thisWorkMs,
      minutes: Math.round(thisWorkMs / 60000)
    });
    cursorMs += thisWorkMs;
    pomoIndex += 1;

    if (idx < pendingItems.length - 1) {
      const sessionNum = timerState.completedWorkSessions + pomoIndex;
      const isLong = sessionNum % interval === 0;
      const breakSecs = isLong ? longBreakSecs : shortBreakSecs;
      const breakMs = breakSecs * 1000;
      maybeInsertBlocked(breakMs);
      blocks.push({
        kind: isLong ? 'long' : 'break',
        label: isLong ? 'Long Break' : 'Short Break',
        startMs: cursorMs,
        endMs: cursorMs + breakMs,
        minutes: Math.round(breakSecs / 60)
      });
      cursorMs += breakMs;
    }
  });

  return { blocks, endMs: cursorMs, totalSecs: Math.max(0, Math.round((cursorMs - nowMs) / 1000)), pendingCount: pendingItems.length };
}

function renderDayTimeline(blocks) {
  if (!dayTimelinePanel || !dayTimelineList) return;
  dayTimelinePanel.classList.toggle('hidden', !isTimelineOpen);
  if (btnToggleTimeline) {
    btnToggleTimeline.classList.toggle('is-active', isTimelineOpen);
    btnToggleTimeline.setAttribute('aria-expanded', String(isTimelineOpen));
  }
  if (!isTimelineOpen) return;

  if (blocks.length === 0) {
    dayTimelineList.innerHTML = '<li class="session-log-empty">Add unfinished tasks with Est Pomodoros to preview your day schedule.</li>';
    return;
  }

  dayTimelineList.innerHTML = blocks.map(b => `
    <li class="timeline-block-item kind-${b.kind}">
      <div class="timeline-block-left">
        <span class="timeline-block-time">${formatClockTime(b.startMs)}–${formatClockTime(b.endMs)}</span>
        <span class="timeline-block-title">${escapeHtml(b.label)}</span>
      </div>
      <span class="timeline-block-dur">${b.minutes}m</span>
    </li>
  `).join('');
}

function updateTaskSummary() {
  const visibleTasks = getVisibleTasks();
  let totalEst = 0;
  let completedPomos = 0;

  visibleTasks.forEach(t => {
    const est = t.estPomodoros || 0;
    const done = t.completedPomodoros || 0;
    totalEst += est;
    completedPomos += t.isCompleted && est > 0 ? Math.max(est, done) : done;
  });

  summaryPomos.innerHTML = `Pomos: <strong>${completedPomos} / ${totalEst}</strong>`;

  const schedule = buildDayTimelineBlocks(visibleTasks);
  if (schedule.pendingCount > 0) {
    const finishDate = new Date(schedule.endMs);
    const hours = finishDate.getHours().toString().padStart(2, '0');
    const mins = finishDate.getMinutes().toString().padStart(2, '0');
    const durationH = (schedule.totalSecs / 3600).toFixed(1);
    summaryFinish.innerHTML = `Finish At: <strong>${hours}:${mins}</strong> (${durationH}h)`;
  } else {
    summaryFinish.innerHTML = `Finish At: <strong>--:--</strong> (0h)`;
  }
  renderDayTimeline(schedule.blocks);
}

if (btnToggleTimeline) {
  btnToggleTimeline.addEventListener('click', () => {
    isTimelineOpen = !isTimelineOpen;
    updateTaskSummary();
  });
}

function handleBlockedBreakChange() {
  if (!toggleBreakBlock || !breakBlockStart || !breakBlockMins) return;
  const mins = clampWholeNumber(breakBlockMins.value, 5, 240, appSettings.blockedBreak.minutes || 45);
  breakBlockMins.value = mins;
  appSettings.blockedBreak = {
    enabled: toggleBreakBlock.checked,
    startTime: /^\d{2}:\d{2}$/.test(breakBlockStart.value) ? breakBlockStart.value : '12:00',
    minutes: mins
  };
  saveSettings();
  updateTaskSummary();
}
if (toggleBreakBlock) toggleBreakBlock.addEventListener('change', handleBlockedBreakChange);
if (breakBlockStart) breakBlockStart.addEventListener('change', handleBlockedBreakChange);
if (breakBlockMins) breakBlockMins.addEventListener('change', handleBlockedBreakChange);

// Workspace Snapshot & Cloud Sync Helpers
function buildWorkspaceSnapshot() {
  return {
    schema: 'pomodoro-workspace-v2',
    exportedAt: new Date().toISOString(),
    theme,
    tasks,
    activeTaskId,
    appSettings,
    dailyStats,
    sessionHistory
  };
}

function mergeWorkspaceSnapshots(localSnap, cloudSnap) {
  const localTasks = sanitizeTasks(localSnap?.tasks);
  const cloudTasks = sanitizeTasks(cloudSnap?.tasks);
  const taskMap = new Map();
  cloudTasks.forEach(t => taskMap.set(t.id, t));
  localTasks.forEach(lt => {
    const ct = taskMap.get(lt.id);
    if (!ct) {
      taskMap.set(lt.id, lt);
      return;
    }
    const mergedDone = Math.max(ct.completedPomodoros || 0, lt.completedPomodoros || 0);
    taskMap.set(lt.id, {
      ...ct,
      ...lt,
      completedPomodoros: mergedDone,
      isCompleted: Boolean(ct.isCompleted || lt.isCompleted)
    });
  });

  const localHist = sanitizeSessionHistory(localSnap?.sessionHistory);
  const cloudHist = sanitizeSessionHistory(cloudSnap?.sessionHistory);
  const histMap = new Map();
  cloudHist.forEach(s => histMap.set(s.id, s));
  localHist.forEach(s => histMap.set(s.id, s));
  const mergedHistory = [...histMap.values()].sort((a, b) => a.completedAt - b.completedAt);

  const todayStr = new Date().toDateString();
  const lStats = localSnap?.dailyStats || {};
  const cStats = cloudSnap?.dailyStats || {};
  let mergedDaily = { date: todayStr, sessions: 0, minutes: 0 };
  if (lStats.date === todayStr && cStats.date === todayStr) {
    mergedDaily = {
      date: todayStr,
      sessions: Math.max(Number(lStats.sessions) || 0, Number(cStats.sessions) || 0),
      minutes: Math.max(Number(lStats.minutes) || 0, Number(cStats.minutes) || 0)
    };
  } else if (lStats.date === todayStr) {
    mergedDaily = { ...lStats };
  } else if (cStats.date === todayStr) {
    mergedDaily = { ...cStats };
  }

  const lApp = localSnap?.appSettings || {};
  const cApp = cloudSnap?.appSettings || {};
  const lHasSound = Object.values(lApp.soundMix || {}).some(v => Number(v) > 0);
  const presetMap = new Map();
  (Array.isArray(cApp.soundPresets) ? cApp.soundPresets : []).forEach(p => { if (p?.id) presetMap.set(p.id, p); });
  (Array.isArray(lApp.soundPresets) ? lApp.soundPresets : []).forEach(p => { if (p?.id) presetMap.set(p.id, p); });

  return {
    schema: 'pomodoro-workspace-v2',
    exportedAt: new Date().toISOString(),
    theme: localSnap?.theme || cloudSnap?.theme || 'light',
    tasks: [...taskMap.values()],
    activeTaskId: localSnap?.activeTaskId || cloudSnap?.activeTaskId || null,
    appSettings: {
      ...cApp,
      ...lApp,
      soundMix: lHasSound ? (lApp.soundMix || {}) : (cApp.soundMix || {}),
      soundPresets: [...presetMap.values()].slice(0, 8)
    },
    dailyStats: mergedDaily,
    sessionHistory: mergedHistory
  };
}

function applyWorkspaceBackupPayload(rawObj, options = {}) {
  const { skipCloudPush = false } = options;
  if (!rawObj || typeof rawObj !== 'object' || Array.isArray(rawObj)) {
    throw new Error('Invalid backup format.');
  }
  if (!Array.isArray(rawObj.tasks) && !Array.isArray(rawObj.sessionHistory) && typeof rawObj.appSettings !== 'object') {
    throw new Error('Backup file does not contain recognizable workspace data.');
  }

  const prevSuppress = suppressCloudSync;
  if (skipCloudPush) suppressCloudSync = true;
  try {
    if (Array.isArray(rawObj.tasks)) {
      tasks = sanitizeTasks(rawObj.tasks);
      activeTaskId = typeof rawObj.activeTaskId === 'string' && tasks.some(t => t.id === rawObj.activeTaskId)
        ? rawObj.activeTaskId
        : (tasks[0]?.id || null);
      saveTasks();
    }

    if (Array.isArray(rawObj.sessionHistory)) {
      sessionHistory = sanitizeSessionHistory(rawObj.sessionHistory);
      saveSessionHistory();
    }

    if (rawObj.dailyStats && typeof rawObj.dailyStats === 'object') {
      dailyStats = {
        date: typeof rawObj.dailyStats.date === 'string' ? rawObj.dailyStats.date : new Date().toDateString(),
        sessions: clampWholeNumber(rawObj.dailyStats.sessions, 0, 1000, 0),
        minutes: clampWholeNumber(rawObj.dailyStats.minutes, 0, 100000, 0)
      };
      safeSetStorage('dailyStats', JSON.stringify(dailyStats));
    }

    if (rawObj.appSettings && typeof rawObj.appSettings === 'object') {
      appSettings = { ...appSettings, ...rawObj.appSettings };
      saveSettings();
    }

    if (rawObj.theme === 'dark' || rawObj.theme === 'light') {
      theme = rawObj.theme;
    }

    editingTaskId = null;
    selectedProjectFilter = '';
    init();
  } finally {
    suppressCloudSync = prevSuppress;
  }
  if (!skipCloudPush) notifyWorkspaceChanged('restore');
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
  closePipTimer();
});

function saveTasks() {
  if (activeTaskId && !tasks.some(t => t.id === activeTaskId)) activeTaskId = null;
  if (editingTaskId && !tasks.some(t => t.id === editingTaskId)) editingTaskId = null;
  safeSetStorage('tasks', JSON.stringify(tasks));
  safeSetStorage('activeTaskId', activeTaskId || '');
  notifyWorkspaceChanged('tasks');
}

if (typeof window !== 'undefined') {
  window.PomodoroWorkspace = {
    exportSnapshot: buildWorkspaceSnapshot,
    applySnapshot: (payload) => applyWorkspaceBackupPayload(payload, { silent: true, skipCloudPush: true }),
    mergeSnapshots: mergeWorkspaceSnapshots,
    hasMeaningfulData: () => tasks.length > 0 || sessionHistory.length > 0 || dailyStats.sessions > 0
  };
}

init();
