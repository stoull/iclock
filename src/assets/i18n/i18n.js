import { I18n } from "i18n-js";

// 导入语言文件
import en from "./en.json";
import zhHans from "./zh-Hans.json";  // 简体中文
import zhHant from "./zh-Hant.json";  // 繁体中文
import zhCN from "./zh-CN.json";      // 简体中文（中国大陆）
import zhTW from "./zh-TW.json";      // 繁体中文（台湾）

const i18n = new I18n({
  // 英文
  en: en,
  
  // 简体中文（通用）
  "zh-Hans": zhHans,
  
  // 繁体中文（通用）
  "zh-Hant": zhHant,
  
  // 特定地区的中文
  "zh-CN": zhCN,  // 简体中文（中国大陆）
  "zh-TW": zhTW,  // 繁体中文（台湾）
  
  // 简化别名（可选）
  zh: zhHans,     // 默认中文指向简体中文
});

// 设置默认语言
i18n.defaultLocale = "en";
i18n.locale = "zh-Hans";

// 启用回退机制
i18n.enableFallback = true;

// 设置回退顺序
i18n.fallbacks = {
  "zh-CN": ["zh-Hans", "zh", "en"],
  "zh-TW": ["zh-Hant", "zh-Hans", "en"], 
  "zh-HK": ["zh-Hant", "zh-TW", "en"],
  "zh-SG": ["zh-Hans", "zh-CN", "en"],
  "zh": ["zh-Hans", "en"]
};

// 配置缺失翻译的处理方式
i18n.missingBehavior = "message"; // 可选: "message", "guess", 或自定义函数

// 自定义缺失翻译的处理函数
i18n.onMissingTranslation = (scope, options) => {
  const key = scope.join('.');
  
  // 在开发环境下记录缺失的翻译
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🌐 Missing translation: ${key} for locale: ${i18n.locale}`);
    
    // 可以发送到监控服务
    // trackMissingTranslation(key, i18n.locale);
  }
  
  // 返回处理策略
  switch (options?.missingBehavior || 'smart') {
    case 'empty':
      return ''; // 返回空字符串
      
    case 'key':
      return key; // 返回完整键名
      
    case 'last':
      return scope[scope.length - 1]; // 返回键名的最后部分
      
    case 'smart':
    default:
      // 智能处理：根据键名推测合理的显示文本
      const lastKey = scope[scope.length - 1];
      return lastKey
        .replace(/([A-Z])/g, ' $1') // 驼峰转空格
        .replace(/[_-]/g, ' ')      // 下划线和连字符转空格
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase()); // 首字母大写
  }
};

// 配置插值选项
i18n.interpolation = {
  // 设置默认变量，避免插值错误
  defaultVariables: {
    appName: 'iClock',
    version: '1.0.0',
    company: 'Hut Inc.',
    year: new Date().getFullYear()
  },
  
  // 自定义插值分隔符（默认是 {{}} ）
  // prefix: '{{',
  // suffix: '}}',
  
  // 处理缺失变量的策略
  missingInterpolationHandler: (text, value, options) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🔄 Missing interpolation variable: ${value} in text: "${text}"`);
    }
    
    // 返回占位符而不是错误
    return `[${value}]`;
  }
};

export default i18n;