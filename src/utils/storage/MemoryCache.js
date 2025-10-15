// 创建一个简单的内存缓存
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, data, ttl = 5 * 60 * 1000) { // 默认5分钟
    const expiration = Date.now() + ttl;
    this.cache.set(key, { data, expiration });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

// 在组件外创建缓存实例
const tempDataCache = new MemoryCache();