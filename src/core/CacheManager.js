export class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultConfig = {
      ttl: 5 * 60 * 1000, // 5 dakika
      maxSize: 100, // maksimum cache boyutu
      storage: 'memory' // 'memory' veya 'localStorage'
    };
  }

  async get(key, config = {}) {
    const cacheConfig = { ...this.defaultConfig, ...config.cache };
    const cachedItem = this.cache.get(key);

    if (!cachedItem) return null;

    if (Date.now() - cachedItem.timestamp > cacheConfig.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  set(key, data, config = {}) {
    const cacheConfig = { ...this.defaultConfig, ...config.cache };
    
    if (this.cache.size >= cacheConfig.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    if (cacheConfig.storage === 'localStorage') {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
  }

  clear() {
    this.cache.clear();
  }
} 