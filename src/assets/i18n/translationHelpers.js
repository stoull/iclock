// 缺失翻译处理工具
import i18n from './i18n.js';

// 缺失翻译收集器（用于开发环境）
class MissingTranslationCollector {
  constructor() {
    this.missingKeys = new Set();
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // 记录缺失的翻译
  track(key, locale, context = '') {
    if (!this.isEnabled) return;
    
    const entry = `${locale}:${key}${context ? ` (${context})` : ''}`;
    this.missingKeys.add(entry);
    
    // 可以定期发送到服务器或本地存储
    this.scheduleSave();
  }

  // 获取所有缺失的翻译
  getMissingKeys() {
    return Array.from(this.missingKeys);
  }

  // 保存缺失的翻译到本地存储
  scheduleSave() {
    if (this.saveTimeout) return;
    
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('missingTranslations', JSON.stringify(this.getMissingKeys()));
      } catch (e) {
        console.warn('Failed to save missing translations:', e);
      }
      this.saveTimeout = null;
    }, 1000);
  }

  // 导出缺失的翻译（供开发者使用）
  exportMissing() {
    const missing = this.getMissingKeys();
    const blob = new Blob([JSON.stringify(missing, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'missing-translations.json';
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// 创建全局实例
const missingCollector = new MissingTranslationCollector();

// 增强的翻译函数
export function t(key, options = {}) {
  try {
    const result = i18n.t(key, options);
    
    // 检查是否是缺失的翻译
    if (result.includes('[missing') || result === key) {
      missingCollector.track(key, i18n.locale, options.context);
    }
    
    return result;
  } catch (error) {
    console.error(`Translation error for key: ${key}`, error);
    missingCollector.track(key, i18n.locale, 'ERROR');
    return key;
  }
}

// 带后备策略的翻译函数
export function tWithFallback(key, fallback, options = {}) {
  const result = t(key, options);
  
  // 如果翻译缺失或出错，使用后备文本
  if (result.includes('[missing') || result === key) {
    return fallback;
  }
  
  return result;
}

// 条件翻译函数（翻译存在时才返回，否则返回空）
export function tOptional(key, options = {}) {
  const result = t(key, options);
  
  if (result.includes('[missing') || result === key) {
    return '';
  }
  
  return result;
}

// 智能翻译函数（自动美化键名作为后备）
export function tSmart(key, options = {}) {
  const result = t(key, options);
  
  if (result.includes('[missing') || result === key) {
    // 将键名转换为用户友好的文本
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }
  
  return result;
}

// 开发工具
export const devTools = {
  // 获取缺失的翻译
  getMissingTranslations: () => missingCollector.getMissingKeys(),
  
  // 导出缺失的翻译
  exportMissingTranslations: () => missingCollector.exportMissing(),
  
  // 清除记录
  clearMissingTranslations: () => {
    missingCollector.missingKeys.clear();
    localStorage.removeItem('missingTranslations');
  }
};

// 在开发环境下，将开发工具挂载到 window 对象
if (process.env.NODE_ENV === 'development') {
  window.i18nDevTools = devTools;
  console.log('🌐 i18n dev tools available at window.i18nDevTools');
}
