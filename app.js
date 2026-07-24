// --- TIMER CONFIGURATION ---
const CONFIG = {
  1: { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60, mins: 25 },
  2: { work: 50 * 60, shortBreak: 10 * 60, longBreak: 30 * 60, mins: 50 },
  3: { work: 75 * 60, shortBreak: 15 * 60, longBreak: 45 * 60, mins: 75 }
};

// --- APP STATE ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let activeTaskId = localStorage.getItem('activeTaskId') || null;
let theme = localStorage.getItem('theme') || 'light';

let appSettings = JSON.parse(localStorage.getItem('appSettings')) || {
  volume: 0.5,
  notifications: false,
  autoStart: false
};

let timerState = JSON.parse(localStorage.getItem('timerState')) || {
  phase: 'work',
  intensity: 1,
  remainingSeconds: CONFIG[1].work,
  isRunning: false,
  completedWorkSessions: 0
};

let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {
  date: new Date().toDateString(),
  sessions: 0,
  minutes: 0
};

let timerInterval = null;
let targetEndTime = null;

// --- AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playAlarmSound() {
  if (appSettings.volume <= 0) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const playBeep = (startTime, freq) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(appSettings.volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.5);
  };

  const now = audioCtx.currentTime;
  playBeep(now, 800);
  playBeep(now + 0.2, 1000);
}

// --- DESKTOP NOTIFICATIONS ---
function sendDesktopNotification(title, body) {
  if (appSettings.notifications && Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
}

// --- DOM ELEMENTS ---
const htmlDoc = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const modeBtns = document.querySelectorAll('.mode-btn');
const timeDisplay = document.getElementById('time-display');
const timerPhaseDisplay = document.getElementById('timer-phase');
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnSkip = document.getElementById('btn-skip');
const btnReset = document.getElementById('btn-reset');

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const btnResetAll = document.getElementById('btn-reset-all');

const volSlider = document.getElementById('volume-slider');
const btnTestSound = document.getElementById('btn-test-sound');
const toggleNotif = document.getElementById('toggle-notif');
const toggleAutoStart = document.getElementById('toggle-autostart');
const statSessions = document.getElementById('stat-sessions');
const statMinutes = document.getElementById('stat-minutes');

// --- INITIALIZATION ---
function init() {
  checkDailyStatsReset();
  applyTheme(theme);
  loadSettings();
  renderTasks();
  updateStatsDisplay();
  updateModeButtons();
  
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
  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
  updateStatsDisplay();
}

function updateStatsDisplay() {
  statSessions.textContent = dailyStats.sessions;
  statMinutes.textContent = dailyStats.minutes;
}

function loadSettings() {
  volSlider.value = appSettings.volume;
  toggleNotif.checked = appSettings.notifications;
  toggleAutoStart.checked = appSettings.autoStart;
}

function saveSettings() {
  localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

// --- SETTINGS LISTENERS ---
volSlider.addEventListener('input', (e) => {
  appSettings.volume = parseFloat(e.target.value);
  saveSettings();
});

btnTestSound.addEventListener('click', playAlarmSound);

toggleNotif.addEventListener('change', (e) => {
  if (e.target.checked) {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        appSettings.notifications = true;
        new Notification("Permission Granted", { body: "Notifications are ready!" });
      } else {
        e.target.checked = false;
        appSettings.notifications = false;
        alert("Notification permission denied by browser.");
      }
      saveSettings();
    });
  } else {
    appSettings.notifications = false;
    saveSettings();
  }
});

toggleAutoStart.addEventListener('change', (e) => {
  appSettings.autoStart = e.target.checked;
  saveSettings();
});

// --- THEME ---
function applyTheme(selectedTheme) {
  theme = selectedTheme;
  htmlDoc.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('theme', theme);
}
themeToggleBtn.addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light'));

// --- TIMER LOGIC ---
function startTimer() {
  if (timerState.isRunning) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  timerState.isRunning = true;
  targetEndTime = Date.now() + (timerState.remainingSeconds * 1000);
  
  btnStart.disabled = true;
  btnPause.disabled = false;

  timerInterval = setInterval(() => {
    const now = Date.now();
    const secondsLeft = Math.round((targetEndTime - now) / 1000);

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerState.remainingSeconds = 0;
      handleTimerComplete();
    } else {
      timerState.remainingSeconds = secondsLeft;
      updateDisplay();
    }
  }, 200);
  
  saveTimerState();
}

function pauseTimer() {
  if (!timerState.isRunning) return;
  clearInterval(timerInterval);
  timerState.isRunning = false;
  btnStart.disabled = false;
  btnPause.disabled = true;
  saveTimerState();
  updateDisplay();
}

function skipTimer() {
  pauseTimer();
  handleTimerComplete(); // Skip akan otomatis memicu perpindahan fase
}

function resetTimer() {
  pauseTimer();
  timerState.remainingSeconds = CONFIG[timerState.intensity][timerState.phase];
  saveTimerState();
  updateDisplay();
}

function handleTimerComplete() {
  timerState.isRunning = false;
  playAlarmSound(); 
  
  let notifBody = "";
  let isEnteringBreak = false;
  
  if (timerState.phase === 'work') {
    dailyStats.sessions++;
    dailyStats.minutes += CONFIG[timerState.intensity].mins;
    saveDailyStats();

    timerState.completedWorkSessions++;
    incrementActiveTask();
    
    if (timerState.completedWorkSessions % 4 === 0) {
      timerState.phase = 'longBreak';
    } else {
      timerState.phase = 'shortBreak';
    }
    notifBody = "Work done! Time for a break.";
    isEnteringBreak = true;
  } else {
    timerState.phase = 'work';
    notifBody = "Break is over! Let's focus.";
  }

  sendDesktopNotification("Pomodoro Timer", notifBody);

  timerState.remainingSeconds = CONFIG[timerState.intensity][timerState.phase];
  saveTimerState();
  updateDisplay();
  
  btnStart.disabled = false;
  btnPause.disabled = true;

  if (appSettings.autoStart && isEnteringBreak) {
    startTimer();
  }
}

function setIntensityMode(intensity) {
  pauseTimer();
  timerState.intensity = intensity;
  timerState.phase = 'work';
  timerState.remainingSeconds = CONFIG[intensity].work;
  timerState.completedWorkSessions = 0;
  
  updateModeButtons();
  saveTimerState();
  updateDisplay();
}

function updateModeButtons() {
  modeBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.intensity) === timerState.intensity);
  });
}

function updateDisplay() {
  const mins = Math.floor(timerState.remainingSeconds / 60);
  const secs = timerState.remainingSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  timeDisplay.textContent = timeString;
  
  let phaseText = '';
  if (timerState.phase === 'work') phaseText = `Work Phase (Session ${timerState.completedWorkSessions + 1})`;
  else if (timerState.phase === 'shortBreak') phaseText = `Short Break`;
  else phaseText = `Long Break`;
  
  timerPhaseDisplay.textContent = phaseText;
  
  document.title = `(${timeString}) Pomodoro`;
}

function saveTimerState() {
  localStorage.setItem('timerState', JSON.stringify(timerState));
}

// --- CONTROLS LISTENERS ---
btnStart.addEventListener('click', startTimer);
btnPause.addEventListener('click', pauseTimer);
btnSkip.addEventListener('click', skipTimer);
btnReset.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
  btn.addEventListener('click', (e) => setIntensityMode(parseInt(e.target.dataset.intensity)));
});

// --- TASK MANAGEMENT & RESET ALL ---
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleInput = document.getElementById('task-title');
  const estInput = document.getElementById('task-est');

  const newTask = {
    id: Date.now().toString(),
    title: titleInput.value.trim(),
    estPomodoros: parseInt(estInput.value),
    completedPomodoros: 0,
    isCompleted: false
  };

  tasks.push(newTask);
  if (!activeTaskId) activeTaskId = newTask.id;
  
  saveTasks();
  renderTasks();
  
  titleInput.value = '';
  estInput.value = '';
});

btnResetAll.addEventListener('click', () => {
  if (confirm("Are you sure you want to reset EVERYTHING? This will delete all tasks, restart your session to 1, and clear today's statistics.")) {
    // Reset Tasks
    tasks = [];
    activeTaskId = null;
    saveTasks();
    renderTasks();
    
    // Reset Stats
    dailyStats = { date: new Date().toDateString(), sessions: 0, minutes: 0 };
    saveDailyStats();
    
    // Reset Timer
    pauseTimer();
    timerState.phase = 'work';
    timerState.completedWorkSessions = 0;
    timerState.remainingSeconds = CONFIG[timerState.intensity].work;
    saveTimerState();
    updateDisplay();
  }
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.id === activeTaskId ? 'active' : ''} ${task.isCompleted ? 'completed' : ''}`;
    
    li.addEventListener('click', (e) => {
      if(e.target.tagName !== 'BUTTON' && e.target.type !== 'checkbox') {
        activeTaskId = task.id;
        saveTasks();
        renderTasks();
      }
    });

    li.innerHTML = `
      <div class="task-info">
        <input type="checkbox" ${task.isCompleted ? 'checked' : ''} onchange="toggleTaskComplete('${task.id}')" title="Mark as done">
        <span class="task-title-text">${task.title}</span>
      </div>
      <div class="task-actions">
        <span class="task-pomo-count" title="Pomodoros completed">${task.completedPomodoros} / ${task.estPomodoros}</span>
        <button onclick="deleteTask('${task.id}')" title="Delete Task">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function incrementActiveTask() {
  if (!activeTaskId) return;
  const taskIndex = tasks.findIndex(t => t.id === activeTaskId);
  if (taskIndex !== -1 && !tasks[taskIndex].isCompleted) {
    tasks[taskIndex].completedPomodoros++;
    saveTasks();
    renderTasks();
  }
}

window.toggleTaskComplete = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.isCompleted = !task.isCompleted;
    saveTasks();
    renderTasks();
  }
}

window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  if (activeTaskId === id) activeTaskId = null;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('activeTaskId', activeTaskId || '');
}

init();