const defaults = {
  enabled: true,
  mode: "highlight",
  notifications: true,
  disabledSites: {}
};

let settings = { ...defaults };
let currentSite = null;

document.addEventListener("DOMContentLoaded", async () => {
  await initTheme();
  await initSettings();
  await initStats();
  await initSite();
});


async function initStats() {
  const { cyberStats } = await chrome.storage.local.get(["cyberStats"]);
  const statsEl = document.getElementById("stats");



  animateCounter(
  document.getElementById("blockedCount"),
);

}


async function initTheme() {
  const { theme } = await chrome.storage.sync.get(["theme"]);
  applyTheme(theme || "light");

  document.getElementById("themeToggle").onclick = async () => {
    const newTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(newTheme);
    await chrome.storage.sync.set({ theme: newTheme });
  };
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  document.getElementById("themeToggle").textContent =
    theme === "dark" ? "☀️" : "🌙";
}


async function initSettings() {
  const data = await chrome.storage.sync.get(["cyberSettings"]);
  settings = { ...defaults, ...(data.cyberSettings || {}) };

  const enabled = document.getElementById("enabled");
  const blur = document.getElementById("blur");
  const notify = document.getElementById("notify");

  enabled.checked = settings.enabled;
  blur.checked = settings.mode === "blur";
  notify.checked = settings.notifications;

  updateStatus();

  enabled.addEventListener("change", async () => {
    settings.enabled = enabled.checked;
    await saveSettings();
    updateStatus();
  });

  blur.addEventListener("change", async () => {
    settings.mode = blur.checked ? "blur" : "highlight";
    await saveSettings();
  });

  notify.addEventListener("change", async () => {
    settings.notifications = notify.checked;
    await saveSettings();
  });
}

function updateStatus() {
  const status = document.getElementById("status");

  if (settings.enabled) {
    status.textContent = "Protection Active";
    status.classList.remove("paused");
    status.classList.add("active");
  } else {
    status.textContent = "Protection Paused";
    status.classList.remove("active");
    status.classList.add("paused");
  }
}

function animateCounter(el, value) {
  let start = 0;
  const duration = 500;
  const startTime = performance.now();

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
}

  requestAnimationFrame(update);
}


async function saveSettings() {
  await chrome.storage.sync.set({ cyberSettings: settings });
}

async function initSite() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const siteBtn = document.getElementById("siteBtn");

  if (!tab?.url || tab.url.startsWith("chrome://")) {
    siteBtn.textContent = "Unsupported page";
    siteBtn.disabled = true;
    return;
  }

  const url = new URL(tab.url);
  currentSite = url.hostname;

  updateSiteButton();

  siteBtn.addEventListener("click", async () => {
    if (settings.disabledSites[currentSite]) {
      delete settings.disabledSites[currentSite];
    } else {
      settings.disabledSites[currentSite] = true;
    }

    await saveSettings();
    updateSiteButton();

    chrome.tabs.reload(tab.id);
    window.close();
  });
}

function updateSiteButton() {
  const siteBtn = document.getElementById("siteBtn");

  if (!currentSite) return;

  if (settings.disabledSites[currentSite]) {
    siteBtn.textContent = `Enable on ${currentSite}`;
  } else {
    siteBtn.textContent = `Disable on ${currentSite}`;
  }
}
