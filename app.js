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
  autoStart: false,
  autoStartWork: false
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

// Tasks DOM
const taskList = document.getElementById('task-list');
const btnResetAll = document.getElementById('btn-reset-all');
const btnShowAddTask = document.getElementById('btn-show-add-task');
const addTaskContainer = document.getElementById('add-task-container');
const btnCancelTask = document.getElementById('btn-cancel-task');
const btnSaveTask = document.getElementById('btn-save-task');

// Task Form Fields
const inputTitle = document.getElementById('task-title');
const inputEst = document.getElementById('task-est');
const btnAddNote = document.getElementById('btn-add-note');
const btnAddProject = document.getElementById('btn-add-project');
const inputNote = document.getElementById('task-note');
const inputProject = document.getElementById('task-project');

// Summary DOM
const summaryPomos = document.getElementById('summary-pomos');
const summaryFinish = document.getElementById('summary-finish');

// Settings DOM
const volSlider = document.getElementById('volume-slider');
const btnTestSound = document.getElementById('btn-test-sound');
const toggleNotif = document.getElementById('toggle-notif');
const toggleAutoStart = document.getElementById('toggle-autostart');
const toggleAutoStartWork = document.getElementById('toggle-autostart-work');
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
  toggleAutoStartWork.checked = appSettings.autoStartWork || false;
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

toggleAutoStartWork.addEventListener('change', (e) => {
  appSettings.autoStartWork = e.target.checked;
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
  handleTimerComplete();
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

  if (isEnteringBreak && appSettings.autoStart) {
    startTimer();
  } else if (!isEnteringBreak && appSettings.autoStartWork) {
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


// --- TASK MANAGEMENT ---

btnShowAddTask.addEventListener('click', () => {
  btnShowAddTask.classList.add('hidden');
  addTaskContainer.classList.remove('hidden');
  inputTitle.focus();
});

btnCancelTask.addEventListener('click', () => {
  resetTaskForm();
});

btnAddNote.addEventListener('click', () => {
  inputNote.classList.remove('hidden');
  btnAddNote.classList.add('hidden');
  inputNote.focus();
});

btnAddProject.addEventListener('click', () => {
  inputProject.classList.remove('hidden');
  btnAddProject.classList.add('hidden');
  inputProject.focus();
});

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

btnSaveTask.addEventListener('click', () => {
  const titleVal = inputTitle.value.trim();
  if (!titleVal) {
    alert("Task title cannot be empty!");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    title: titleVal,
    estPomodoros: inputEst.value ? parseInt(inputEst.value) : null,
    isCompleted: false,
    note: inputNote.value.trim(),
    project: inputProject.value.trim()
  };

  tasks.push(newTask);
  if (!activeTaskId) activeTaskId = newTask.id;
  
  saveTasks();
  renderTasks();
  resetTaskForm();
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.id === activeTaskId ? 'active' : ''} ${task.isCompleted ? 'completed' : ''}`;
    
    li.addEventListener('click', (e) => {
      if(!e.target.closest('.custom-checkbox') && !e.target.closest('.task-opt-menu')) {
        activeTaskId = task.id;
        saveTasks();
        renderTasks();
      }
    });

    const countDisplay = task.estPomodoros 
      ? `<span class="task-pomo-count">0 / ${task.estPomodoros}</span>` 
      : '';
      
    const checkIcon = task.isCompleted ? '✓' : '';
    const projectTag = task.project ? `<span class="task-project-tag">${task.project}</span>` : '';

    let htmlContent = `
      <div class="task-main-row">
        <div class="task-info-group">
          <div class="custom-checkbox" onclick="toggleTaskComplete('${task.id}')" title="Mark as done">${checkIcon}</div>
          <span class="task-title-text">${task.title} ${projectTag}</span>
        </div>
        <div class="task-right-group">
          ${countDisplay}
          <button class="task-opt-menu" onclick="deleteTask('${task.id}')" title="Delete Task">⋮</button>
        </div>
      </div>
    `;

    if (task.note) {
      htmlContent += `<div class="task-note-box">${task.note.replace(/\n/g, '<br>')}</div>`;
    }

    li.innerHTML = htmlContent;
    taskList.appendChild(li);
  });

  updateTaskSummary();
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
  if(confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    if (activeTaskId === id) activeTaskId = null;
    saveTasks();
    renderTasks();
  }
}

btnResetAll.addEventListener('click', () => {
  if (confirm("Reset ALL tasks, session, and stats?")) {
    tasks = [];
    activeTaskId = null;
    saveTasks();
    renderTasks();
    
    dailyStats = { date: new Date().toDateString(), sessions: 0, minutes: 0 };
    saveDailyStats();
    
    pauseTimer();
    timerState.phase = 'work';
    timerState.completedWorkSessions = 0;
    timerState.remainingSeconds = CONFIG[timerState.intensity].work;
    saveTimerState();
    updateDisplay();
  }
});

function updateTaskSummary() {
  let totalEst = 0;
  let completedEst = 0;
  let remainingEst = 0;

  tasks.forEach(t => {
    const est = t.estPomodoros || 0;
    totalEst += est;
    if (t.isCompleted) {
      completedEst += est;
    } else {
      remainingEst += est;
    }
  });

  summaryPomos.innerHTML = `Pomos: <strong>${completedEst} / ${totalEst}</strong>`;

  if (remainingEst > 0) {
    const workSecs = CONFIG[timerState.intensity].work;
    const shortBreakSecs = CONFIG[timerState.intensity].shortBreak;
    
    let totalSecs = 0;
    for (let i = 0; i < remainingEst; i++) {
      totalSecs += workSecs;
      if (i < remainingEst - 1) totalSecs += shortBreakSecs; 
    }
    
    const finishDate = new Date(Date.now() + totalSecs * 1000);
    const hours = finishDate.getHours().toString().padStart(2, '0');
    const mins = finishDate.getMinutes().toString().padStart(2, '0');
    const durationH = (totalSecs / 3600).toFixed(1);
    
    summaryFinish.innerHTML = `Finish At: <strong>${hours}:${mins}</strong> (${durationH}h)`;
  } else {
    summaryFinish.innerHTML = `Finish At: <strong>--:--</strong> (0h)`;
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('activeTaskId', activeTaskId || '');
}

init();
