import React, { createContext, useContext, useState, useEffect } from 'react';
import APP_CONFIG, {DefaultUserPreferences} from '../constants';
import { applyTheme, detectSystemTheme } from '../hooks/useTheme';

import defaultCache from '../utils/storage/PersistentStorageCache';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(APP_CONFIG);
  const [preferences, setPreferences] = useState(() => {
    // 初始化时尝试从缓存加载用户偏好设置
    try {
      const saved = defaultCache.get('iclock_user_preferences');
      return saved ? JSON.parse(saved) : DefaultUserPreferences;
    } catch (error) {
      return DefaultUserPreferences;
    }
  });

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updatePreferences = (newPreferences) => {
    // 检查是否有实际变化
    const hasChanges = Object.keys(newPreferences).some(key => 
      preferences[key] !== newPreferences[key]
    );
    
    if (hasChanges) {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    }
  };

  // 当 preferences 变化时，保存到缓存
  useEffect(() => {
    try {
      defaultCache.set('iclock_user_preferences', JSON.stringify(preferences), 30 * 24 * 60 * 60 * 1000); // 保存30天
    } catch (error) {
      console.error('Error applying user preferences:', error);
    }
  }, [preferences]);

  // 初始化主题
  useEffect(() => {
    console.log('渲染UseEffect-APPContext:', preferences.theme);
    if (preferences.theme) {
      applyTheme(preferences.theme);
    } else {
      // 如果没有主题偏好，使用系统主题并保存
      const systemTheme = detectSystemTheme();
      applyTheme(systemTheme);
      updatePreferences({ theme: systemTheme });
    }
  }, []); // 只在组件挂载时执行一次

  // 当主题偏好变化时，应用主题
  useEffect(() => {
    if (preferences.theme) {
      applyTheme(preferences.theme);
    }
  }, [preferences.theme]);

  return (
    <AppContext.Provider value={{ 
      config, 
      updateConfig, 
      preferences, 
      updatePreferences 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return {
    config: context.config,
    updateConfig: context.updateConfig
  };
};

export const usePreferences = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('usePreferences must be used within a ConfigProvider');
  }
  return {
    preferences: context.preferences,
    updatePreferences: context.updatePreferences
  };
};

export default AppContext;

/**
    * 使用示例：
    // 任何组件中
import { useConfig } from '@/contexts/APPContext';

function MyComponent() {
  const { config, updateConfig } = useConfig();
  
  // 读取配置
  const fontSize = config.DEFAULT_CLOCK_FONT_SIZE;
  
  // 更新配置
  const handleFontSizeChange = (newSize) => {
    updateConfig({ DEFAULT_CLOCK_FONT_SIZE: newSize });
  };
  
  return <div>...</div>;
}
 */