// Theme helper: set/get/toggle theme with persistence and system preference
const STORAGE_KEY = 'app-theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredTheme(theme) {
  try {
    if (theme == null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // ignore
  }
}

export function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function detectSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function initTheme() {
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
    return stored;
  }

  // 如果没有用户偏好，使用系统设置（通过 media query）
  const system = detectSystemTheme();
  applyTheme(system);
  return system;
}

export function setTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    setStoredTheme(theme);
    applyTheme(theme);
  } else if (theme === 'system') {
    // 清除用户设置，回退到系统
    setStoredTheme(null);
    const sys = detectSystemTheme();
    applyTheme(sys);
  }
}

export function toggleTheme() {
    console.log('toggleTheme called: ', getStoredTheme());
  const current = getStoredTheme() || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  console.log('toggleTheme to: ', next);
  setTheme(next);
  return next;
}
