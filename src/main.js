const settingsBtn = document.getElementById("settings");
const settingsMenu = document.getElementById("settings-menu");
const closeBtn = document.getElementById("close-btn");
const fontSelectors = document.querySelectorAll(".font-selector");
const applyBtn = document.getElementById("apply-btn");
const colorSelectors = document.querySelectorAll(".color-selector");
const timerDisplay = document.getElementById("time");
const startPauseBtn = document.getElementById("start-pause-btn");
const modeButtons = document.querySelectorAll(".mode-item");
const circleElement = document.querySelector("#progress-circle circle");
const timeWrappers = document.querySelectorAll(".time-selector");

const modes = {
  "pamodoro-selector": 25,
  "short-break-selector": 5,
  "long-break-selector": 15,
};

let currentMode = "pamodoro-selector";
let timeLeft = modes[currentMode] * 60;
let totalTime = timeLeft;
let timerInterval = null;
let isRunning = false;

const CIRCLE_LENGTH = 283;

circleElement.style.strokeDasharray = CIRCLE_LENGTH;
circleElement.style.strokeDashoffset = 0;

function setCircleProgress(time) {
  const offset = CIRCLE_LENGTH - (time / totalTime) * CIRCLE_LENGTH;
  circleElement.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function updateInterface() {
  timerDisplay.textContent = formatTime(timeLeft);
  setCircleProgress(timeLeft);
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateInterface();
  } else {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "RESTART";
  }
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "START";
  } else {
    if (timeLeft === 0) {
      timeLeft = modes[currentMode] * 60;
      totalTime = timeLeft;
    }

    timerInterval = setInterval(tick, 1000);
    isRunning = true;
    startPauseBtn.textContent = "PAUSE";
  }
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((el) => el.classList.remove("active"));
    btn.classList.add("active");

    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = "START";

    currentMode = btn.id;
    timeLeft = modes[currentMode] * 60;
    totalTime = timeLeft;

    updateInterface();
    circleElement.style.strokeDashoffset = 0;
  });
});

startPauseBtn.addEventListener("click", toggleTimer);

updateInterface();

const modeKeys = [
  "pamodoro-selector",
  "short-break-selector",
  "long-break-selector",
];

timeWrappers.forEach((wrapper, index) => {
  const numberSpan = wrapper.querySelector("span");
  const [upBtn, downBtn] = wrapper.querySelectorAll("button");

  numberSpan.textContent = modes[modeKeys[index]];

  upBtn.addEventListener("click", () => {
    let val = parseInt(numberSpan.textContent);
    if (val < 99) {
      numberSpan.textContent = val + 1;
    }
  });

  downBtn.addEventListener("click", () => {
    let val = parseInt(numberSpan.textContent);
    if (val > 1) {
      numberSpan.textContent = val - 1;
    }
  });
});

applyBtn.addEventListener("click", () => {
  timeWrappers.forEach((wrapper, index) => {
    const val = parseInt(wrapper.querySelector("span").textContent);
    const key = modeKeys[index];

    modes[key] = val;
  });

  clearInterval(timerInterval);
  isRunning = false;
  startPauseBtn.textContent = "START";

  timeLeft = modes[currentMode] * 60;
  totalTime = timeLeft;

  updateInterface();
  circleElement.style.strokeDashoffset = 0;

  closeSettings();
});

let selectedFontClass = "font-kumbh";
let selectedLetterSpacing = "-5px"; // Значення за замовчуванням (для Kumbh)

const fontClassById = {
  "kumbh-selector": "font-kumbh",
  "roboto-selector": "font-roboto",
  "space-selector": "font-space",
};

// 1. Додаємо мапу для відступів
const fontSpacingById = {
  "kumbh-selector": "-5px",
  "roboto-selector": "0px",
  "space-selector": "-10px",
};

fontSelectors.forEach((item) => {
  item.addEventListener("click", () => {
    fontSelectors.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    selectedFontClass = fontClassById[item.id];
    // 2. Запам'ятовуємо відступ при виборі шрифту
    selectedLetterSpacing = fontSpacingById[item.id];
  });
});

applyBtn.addEventListener("click", () => {
  // Зміна класу шрифту для всієї сторінки
  document.body.classList.remove("font-kumbh", "font-roboto", "font-space");
  document.body.classList.add(selectedFontClass);

  // 3. Застосування letter-spacing конкретно до таймера
  timerDisplay.style.letterSpacing = selectedLetterSpacing;

  closeSettings();
});

let selectedColor = "#f87070";

const colorById = {
  "red-selector": "#f87070",
  "cyan-selector": "#70f3f8",
  "purple-selector": "#d681f8",
};

colorSelectors.forEach((item) => {
  item.addEventListener("click", () => {
    colorSelectors.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    selectedColor = colorById[item.id];
  });
});
applyBtn.addEventListener("click", () => {
  document.documentElement.style.setProperty("--accent-color", selectedColor);

  closeSettings();
});

const overlay = document.createElement("div");
overlay.className = "menu-overlay";
document.body.appendChild(overlay);

function openSettings() {
  settingsMenu.classList.remove("hidden");

  overlay.classList.remove("pointer-events-none");
  overlay.classList.add("opacity-100");

  document.body.style.overflow = "hidden";
}

function closeSettings() {
  settingsMenu.classList.add("hidden");

  overlay.classList.add("pointer-events-none");
  overlay.classList.remove("opacity-100");

  document.body.style.overflow = "";
}

settingsBtn.addEventListener("click", openSettings);
closeBtn.addEventListener("click", closeSettings);

overlay.addEventListener("click", closeSettings);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !settingsMenu.classList.contains("hidden")) {
    closeSettings();
  }
});
