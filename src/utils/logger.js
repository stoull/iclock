/**
 * 开发环境日志工具
 * 只在开发环境下打印日志，生产环境自动静默
 */

class Logger {
  constructor() {
    // 检查是否为开发环境
    this.isDev = process.env.NODE_ENV === 'development';
  }

  /**
   * 普通日志
   */
  log(...args) {
    if (this.isDev) {
      console.log('[DEV]', ...args);
    }
  }

  /**
   * 信息日志
   */
  info(...args) {
    if (this.isDev) {
      console.info('[DEV-INFO]', ...args);
    }
  }

  /**
   * 警告日志
   */
  warn(...args) {
    if (this.isDev) {
      console.warn('[DEV-WARN]', ...args);
    }
  }

  /**
   * 错误日志
   */
  error(...args) {
    if (this.isDev) {
      console.error('[DEV-ERROR]', ...args);
    }
  }

  /**
   * 调试日志
   */
  debug(...args) {
    if (this.isDev) {
      console.debug('[DEV-DEBUG]', ...args);
    }
  }

  /**
   * 生命周期日志
   */
  lifecycle(...args) {
    if (this.isDev) {
      console.log('[生命周期]', ...args);
    }
  }

  /**
   * 缓存日志
   */
  cache(...args) {
    if (this.isDev) {
      console.log('[缓存]', ...args);
    }
  }

  /**
   * API日志
   */
  api(...args) {
    if (this.isDev) {
      console.log('[API]', ...args);
    }
  }

  /**
   * 性能日志
   */
  performance(label, fn) {
    if (this.isDev) {
      console.time(`[性能] ${label}`);
      const result = fn();
      console.timeEnd(`[性能] ${label}`);
      return result;
    }
    return fn();
  }

  /**
   * 异步性能日志
   */
  async performanceAsync(label, asyncFn) {
    if (this.isDev) {
      console.time(`[性能] ${label}`);
      const result = await asyncFn();
      console.timeEnd(`[性能] ${label}`);
      return result;
    }
    return await asyncFn();
  }

  /**
   * 分组日志
   */
  group(label, fn) {
    if (this.isDev) {
      console.group(`[DEV] ${label}`);
      fn();
      console.groupEnd();
    }
  }

  /**
   * 表格日志
   */
  table(data, label = '') {
    if (this.isDev) {
      if (label) console.log(`[DEV-TABLE] ${label}`);
      console.table(data);
    }
  }
}

// 创建单例实例
const logger = new Logger();

// 导出实例和类
export default logger;
export { Logger };

// 使用示例：
/*
import logger from '@/utils/logger';

// 基础使用
logger.log('这是开发日志');
logger.info('信息日志');
logger.warn('警告日志');
logger.error('错误日志');

// 特定类型日志
logger.lifecycle('组件挂载');
logger.cache('缓存命中', key);
logger.api('API请求', url, data);

// 性能测量
logger.performance('数据处理', () => {
  // 一些计算操作
  return processData();
});

// 异步性能测量
const result = await logger.performanceAsync('API调用', async () => {
  return await fetchData();
});

// 分组日志
logger.group('用户操作', () => {
  logger.log('用户点击按钮');
  logger.log('发送请求');
  logger.log('更新UI');
});

// 表格日志
logger.table(userData, '用户数据');
*/