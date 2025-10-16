// src/globals.js
import logger from './logger';

// 兼容性写法：优先使用 window（浏览器环境）
const globalObject = (function() {
  if (typeof window !== 'undefined') {
    return window; // 浏览器环境
  }
  if (typeof global !== 'undefined') {
    return global; // Node.js 环境
  }
  return {}; // 其他环境
})();

// 将logger注入到全局
globalObject.logger = logger;
