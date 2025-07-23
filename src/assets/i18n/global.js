
import i18n from './i18n.js';

// 全局翻译函数
// 这个函数可以在任何地方使用，简化翻译调用
global._t = function (key) {
  return i18n.t(key);
};