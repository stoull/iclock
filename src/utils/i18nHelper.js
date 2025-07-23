// 多语言使用示例
import i18n from '../assets/i18n/i18n.js';

// 基本使用
const welcome = i18n.t('welcome');
const homeNav = i18n.t('navigation.home');

// 切换语言
i18n.locale = 'zh-CN';  // 切换到简体中文（中国大陆）
i18n.locale = 'zh-TW';  // 切换到繁体中文（台湾）
i18n.locale = 'zh-Hans'; // 切换到简体中文（通用）
i18n.locale = 'zh-Hant'; // 切换到繁体中文（通用）

// 获取当前语言
const currentLocale = i18n.locale;

// 检测浏览器语言并自动设置
const detectAndSetLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  
  // 语言映射
  const langMap = {
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW', 
    'zh-HK': 'zh-Hant',
    'zh-SG': 'zh-Hans',
    'zh': 'zh-Hans',
    'en': 'en',
    'en-US': 'en'
  };
  
  const targetLang = langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en';
  i18n.locale = targetLang;
};

export { detectAndSetLanguage };
