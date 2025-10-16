/**
 * PersistentStorage - 简单的持久化缓存工具类
 * 基于 localStorage 实现，支持过期时间、命名空间等功能
 */

import logger from '../logger';

class PersistentStorage {
  constructor(namespace = 'app') {
    this.namespace = namespace;
    this.defaultTTL = 5 * 60 * 1000; // 默认5分钟过期时间
  }

  /**
   * 生成带命名空间的缓存键
   * @param {string} key - 原始键名
   * @returns {string} 完整的缓存键
   */
  _getCacheKey(key) {
    return `${this.namespace}_${key}`;
  }

  /**
   * 保存数据到缓存
   * @param {string} key - 缓存键
   * @param {any} data - 要缓存的数据
   * @param {number} ttl - 过期时间（毫秒），默认5分钟
   * @returns {boolean} 是否保存成功
   */
  set(key, data, ttl = this.defaultTTL) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        expiration: ttl,
        expiresAt: Date.now() + ttl
      };
      
      const cacheKey = this._getCacheKey(key);
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      logger.cache(`数据已缓存: ${key}`, {
        ttl: `${ttl / 1000}秒`,
        expiresAt: new Date(cacheData.expiresAt).toLocaleString()
      });
      
      return true;
    } catch (error) {
      console.error(`[PersistentStorage] 缓存保存失败 (${key}):`, error);
      return false;
    }
  }

  /**
   * 从缓存读取数据
   * @param {string} key - 缓存键
   * @param {boolean} ignoreTTL - 是否忽略过期时间
   * @returns {any|null} 缓存的数据，如果不存在或过期则返回 null
   */
  get(key, ignoreTTL = false) {
    try {
      const cacheKey = this._getCacheKey(key);
      const cachedItem = localStorage.getItem(cacheKey);
      
      if (!cachedItem) {
        logger.cache(`缓存未命中: ${key}`);
        return null;
      }
      
      const cacheData = JSON.parse(cachedItem);
      const now = Date.now();
      
      // 检查是否过期
      if (!ignoreTTL && now > cacheData.expiresAt) {
        localStorage.removeItem(cacheKey);
        logger.cache(`缓存已过期，已删除: ${key}`);
        return null;
      }
      
      logger.cache(`缓存命中: ${key}`, {
        age: `${Math.round((now - cacheData.timestamp) / 1000)}秒前`,
        remainingTTL: ignoreTTL ? '忽略' : `${Math.round((cacheData.expiresAt - now) / 1000)}秒`
      });
      
      return cacheData.data;
    } catch (error) {
      console.error(`[PersistentStorage] 缓存读取失败 (${key}):`, error);
      return null;
    }
  }

  /**
   * 检查缓存是否存在且未过期
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在有效缓存
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * 删除特定缓存
   * @param {string} key - 缓存键
   * @returns {boolean} 是否删除成功
   */
  delete(key) {
    try {
      const cacheKey = this._getCacheKey(key);
      localStorage.removeItem(cacheKey);
      console.log(`[PersistentStorage] 缓存已删除: ${key}`);
      return true;
    } catch (error) {
      console.error(`[PersistentStorage] 缓存删除失败 (${key}):`, error);
      return false;
    }
  }

  /**
   * 清除当前命名空间下的所有缓存
   * @returns {number} 清除的缓存数量
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      const namespacePrefix = `${this.namespace}_`;
      let count = 0;
      
      keys.forEach(key => {
        if (key.startsWith(namespacePrefix)) {
          localStorage.removeItem(key);
          count++;
        }
      });
      
      console.log(`[PersistentStorage] 已清除 ${count} 个缓存项`);
      return count;
    } catch (error) {
      console.error('[PersistentStorage] 清除缓存失败:', error);
      return 0;
    }
  }

  /**
   * 清除所有过期的缓存
   * @returns {number} 清除的过期缓存数量
   */
  clearExpired() {
    try {
      const keys = Object.keys(localStorage);
      const namespacePrefix = `${this.namespace}_`;
      const now = Date.now();
      let count = 0;
      
      keys.forEach(key => {
        if (key.startsWith(namespacePrefix)) {
          try {
            const cachedItem = localStorage.getItem(key);
            if (cachedItem) {
              const cacheData = JSON.parse(cachedItem);
              if (now > cacheData.expiresAt) {
                localStorage.removeItem(key);
                count++;
              }
            }
          } catch (error) {
            // 如果解析失败，删除这个损坏的缓存项
            localStorage.removeItem(key);
            count++;
          }
        }
      });
      
      console.log(`[PersistentStorage] 已清除 ${count} 个过期缓存项`);
      return count;
    } catch (error) {
      console.error('[PersistentStorage] 清除过期缓存失败:', error);
      return 0;
    }
  }

  /**
   * 获取当前命名空间下所有缓存的信息
   * @returns {Array} 缓存信息列表
   */
  getInfo() {
    try {
      const keys = Object.keys(localStorage);
      const namespacePrefix = `${this.namespace}_`;
      const now = Date.now();
      const cacheInfo = [];
      
      keys.forEach(key => {
        if (key.startsWith(namespacePrefix)) {
          try {
            const cachedItem = localStorage.getItem(key);
            if (cachedItem) {
              const cacheData = JSON.parse(cachedItem);
              const originalKey = key.replace(namespacePrefix, '');
              
              cacheInfo.push({
                key: originalKey,
                size: new Blob([cachedItem]).size,
                timestamp: cacheData.timestamp,
                expiresAt: cacheData.expiresAt,
                isExpired: now > cacheData.expiresAt,
                age: now - cacheData.timestamp,
                remainingTTL: Math.max(0, cacheData.expiresAt - now)
              });
            }
          } catch (error) {
            // 忽略损坏的缓存项
          }
        }
      });
      
      return cacheInfo.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('[PersistentStorage] 获取缓存信息失败:', error);
      return [];
    }
  }

  /**
   * 获取或设置缓存（如果不存在则执行函数并缓存结果）
   * @param {string} key - 缓存键
   * @param {Function} fetchFn - 获取数据的函数
   * @param {number} ttl - 过期时间（毫秒）
   * @returns {Promise<any>} 缓存的数据或新获取的数据
   */
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    // 先尝试从缓存获取
    const cachedData = this.get(key);
    if (cachedData !== null) {
      return cachedData;
    }
    
    // 缓存不存在，执行函数获取数据
    try {
      console.log(`[PersistentStorage] 缓存未命中，执行获取函数: ${key}`);
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`[PersistentStorage] 获取数据失败 (${key}):`, error);
      throw error;
    }
  }
}

// 创建默认实例
const defaultCache = new PersistentStorage('iclock');

// 导出类和默认实例
export { PersistentStorage };
export default defaultCache;

// ==================== 使用示例 ====================

/*
// 1. 基础使用
import cache from '@/utils/storage/PersistentStorage';

// 保存数据
cache.set('user_info', { name: 'John', age: 25 }, 10 * 60 * 1000); // 缓存10分钟

// 读取数据
const userInfo = cache.get('user_info');
if (userInfo) {
  console.log('用户信息:', userInfo);
}

// 检查是否存在
if (cache.has('user_info')) {
  console.log('用户信息缓存存在');
}

// 删除缓存
cache.delete('user_info');

// ==========================================

// 2. 创建专用实例
import { PersistentStorage } from '@/utils/storage/PersistentStorage';

const apiCache = new PersistentStorage('api_data');
const userCache = new PersistentStorage('user_data');

// 分别管理不同类型的缓存
apiCache.set('temp_data', temperatureData, 5 * 60 * 1000); // 5分钟
userCache.set('preferences', userPreferences, 24 * 60 * 60 * 1000); // 24小时

// ==========================================

// 3. 在 React 组件中使用
import React, { useEffect, useState } from 'react';
import cache from '@/utils/storage/PersistentStorage';
import { smartClockService } from '@/services';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // 使用 getOrSet 方法，自动处理缓存逻辑
        const data = await cache.getOrSet(
          'weather_data',
          () => smartClockService.getCurrentTempInfo(),
          5 * 60 * 1000 // 5分钟缓存
        );
        
        setWeatherData(data);
      } catch (error) {
        console.error('获取天气数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // 手动刷新（忽略缓存）
  const handleRefresh = async () => {
    setLoading(true);
    cache.delete('weather_data'); // 清除缓存
    
    try {
      const data = await smartClockService.getCurrentTempInfo();
      cache.set('weather_data', data, 5 * 60 * 1000);
      setWeatherData(data);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRefresh}>刷新数据</button>
      {loading ? <div>加载中...</div> : <div>{JSON.stringify(weatherData)}</div>}
    </div>
  );
};

// ==========================================

// 4. 高级用法 - 缓存管理
// 清除过期缓存（建议在应用启动时执行）
cache.clearExpired();

// 获取缓存信息
const cacheInfo = cache.getInfo();
console.log('缓存统计:', cacheInfo);

// 清除所有缓存
cache.clear();

// ==========================================

// 5. 在服务类中使用
class TemperatureService {
  constructor() {
    this.cache = new PersistentStorage('temp_service');
  }

  async getCurrentTemp(forceRefresh = false) {
    const cacheKey = 'current_temp';
    
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }
    
    // 从 API 获取数据
    const data = await this.fetchFromAPI();
    this.cache.set(cacheKey, data, 3 * 60 * 1000); // 3分钟缓存
    
    return data;
  }
  
  async fetchFromAPI() {
    // 实际的 API 调用逻辑
    return { temperature: 25, humidity: 60 };
  }
}

// ==========================================

// 6. 缓存策略示例
const CacheStrategy = {
  // 短期缓存（1分钟）- 适用于频繁变化的数据
  SHORT: 1 * 60 * 1000,
  
  // 中期缓存（5分钟）- 适用于温湿度等数据
  MEDIUM: 5 * 60 * 1000,
  
  // 长期缓存（1小时）- 适用于配置数据
  LONG: 60 * 60 * 1000,
  
  // 超长期缓存（24小时）- 适用于用户偏好设置
  EXTRA_LONG: 24 * 60 * 60 * 1000
};

// 使用预定义的缓存策略
cache.set('temp_data', tempData, CacheStrategy.MEDIUM);
cache.set('user_settings', settings, CacheStrategy.EXTRA_LONG);
*/