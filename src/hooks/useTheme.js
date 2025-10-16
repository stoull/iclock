import { useCallback, useEffect } from 'react';
import { usePreferences } from '../contexts/APPContext';

// 纯函数，不依赖React Hook
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

// React Hook for theme management
export function useTheme() {
  const { preferences, updatePreferences } = usePreferences();
  
  const currentTheme = preferences.theme || 'light';
  
  // 应用主题到DOM
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);
  
  // 设置主题
  const setTheme = useCallback((theme) => {
    console.log('setTheme called: ', theme);
    if (theme === 'light' || theme === 'dark') {
      updatePreferences({ theme });
      applyTheme(theme);
    } else if (theme === 'system') {
      const systemTheme = detectSystemTheme();
      updatePreferences({ theme: systemTheme });
      applyTheme(systemTheme);
    }
  }, [updatePreferences]);
  
  // 切换主题
  const toggleTheme = useCallback(() => {
    console.log('toggleTheme called, current: ', currentTheme);
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    console.log('toggleTheme to: ', nextTheme);
    setTheme(nextTheme);
    return nextTheme;
  }, [currentTheme, setTheme]);
  
  // 初始化主题（仅在首次加载时）
  const initTheme = useCallback(() => {
    if (!preferences.theme) {
      const systemTheme = detectSystemTheme();
      updatePreferences({ theme: systemTheme });
      applyTheme(systemTheme);
      return systemTheme;
    } else {
      applyTheme(preferences.theme);
      return preferences.theme;
    }
  }, [preferences.theme, updatePreferences]);
  
  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme
  };
}

export default useTheme;