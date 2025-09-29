import { useEffect, useState, useCallback } from 'react';
import i18n from '../assets/i18n/i18n.js';
import { t as st } from '../assets/i18n/translationHelpers.js';
import { setLanguage, SUPPORTED_LOCALES } from '../utils/i18nHelper.js';

// Lightweight hook to re-render on language changes and expose helpers
export default function useI18n() {
  const getLocale = () => i18n.language || i18n.locale || '';
  const [locale, setLocale] = useState(getLocale());

  useEffect(() => {
    const handler = (e) => {
      // event.detail.locale may be present; fall back to i18n value
      const next = (e && e.detail && e.detail.locale) || getLocale();
      setLocale(next);
    };

    window.addEventListener('app-language-changed', handler);

    // In case someone set global fallback during non-CustomEvent environments
    const checkGlobal = () => {
      if (window.__appLanguageChanged) setLocale(window.__appLanguageChanged.locale);
    };

    // small interval check to catch fallback updates (runs briefly)
    const iv = setInterval(checkGlobal, 250);
    const timeout = setTimeout(() => clearInterval(iv), 2000);

    return () => {
      window.removeEventListener('app-language-changed', handler);
      clearInterval(iv);
      clearTimeout(timeout);
    };
  }, []);

  const t = useCallback((...args) => st(...args), []);
  const setLang = useCallback((l) => setLanguage(l), []);

  return { locale, t, setLanguage: setLang, SUPPORTED_LOCALES };
}
