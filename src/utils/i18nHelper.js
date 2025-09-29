// src/utils/i18nHelper.js
import i18n from '../assets/i18n/i18n.js';


const STORAGE_KEY = 'app-lang';

function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
function setStoredLang(l) {
  try { if (l == null) localStorage.removeItem(STORAGE_KEY); else localStorage.setItem(STORAGE_KEY, l); } catch {}
}

const LANG_MAP = {
  'zh-hk': 'zh-Hant',
  'zh': 'zh-Hans',
  'en': 'en',
  'en-us': 'en'
};

// 列出支持的 locales（去重）并导出，便于 UI/语言选择器使用
export const SUPPORTED_LOCALES = Array.from(new Set(Object.values(LANG_MAP)));

function mapBrowserLang(browserLang = '') {
  const key = browserLang.toLowerCase();
  console.log('browser language:', browserLang, key, LANG_MAP[key]);
  if (LANG_MAP[key]) return LANG_MAP[key];
  const base = key.split('-')[0];
  return LANG_MAP[base] || 'en';
}

function autoDetectLanguage({ force = false } = {}) {
  // 不在浏览器环境则直接返回
  if (typeof navigator === 'undefined') return null;

  const stored = getStoredLang();
  if (stored && !force) {
    // 优先使用用户存储的语言
    if (i18n.changeLanguage) i18n.changeLanguage(stored);
    else i18n.locale = stored;
    return stored;
  }

  const browserLang = navigator.language || navigator.userLanguage || '';
  const target = mapBrowserLang(browserLang);
  if (i18n.changeLanguage) i18n.changeLanguage(target);
  else i18n.locale = target;
  return target;
}

//  更改语言
function setLanguage(lang) {
  // 验证要设置的语言是否受支持
  if (!SUPPORTED_LOCALES.includes(lang)) {
    console.warn('[i18nHelper] try to set unsupported language:', lang);
    return false;
  }

  setStoredLang(lang);
  if (i18n.changeLanguage) i18n.changeLanguage(lang);
  else i18n.locale = lang;
  // 通知订阅者：语言已更改（兼容简单的自定义事件订阅）
  try {
    const ev = new CustomEvent('app-language-changed', { detail: { locale: lang } });
    window.dispatchEvent(ev);
  } catch (e) {
    // 在非浏览器环境或不支持 CustomEvent 时安全降级
    if (typeof window !== 'undefined') {
      // 作为降级方案，设置全局变量（很少用到，但可供检查）
      window.__appLanguageChanged = { locale: lang, ts: Date.now() };
    }
  }
  return true;
}

function switchLanguage() {
  // 当前只有两种语言，切换即可
  const current = i18n.language || i18n.locale || '';
  const isZh = String(current).toLowerCase().includes('zh');
  console.log('switch language, current:', current, isZh);
  if (isZh) setLanguage('en'); else setLanguage('zh-Hant');
  console.log('language switched to:', i18n.language || i18n.locale);
}

export { autoDetectLanguage, setLanguage, switchLanguage };