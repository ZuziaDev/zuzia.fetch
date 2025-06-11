const ProxyManager = {
  proxies: new Map(),
  defaultConfig: {
    protocol: 'http',
    host: '',
    port: 80,
    auth: {
      username: '',
      password: ''
    },
    rotate: false,
    rotationInterval: 5000,
    failover: true,
    maxRetries: 3,
    healthCheck: {
      enabled: true,
      interval: 30000
    },
    geofencing: {
      enabled: false,
      targetRegion: null
    }
  },

  init(client) {
    this.client = client;
    this.startHealthChecks();
    ProxyLogger.loadFromStorage();
  },

  addProxy(name, config) {
    const proxyConfig = {
      ...this.defaultConfig,
      ...config,
      name,
      lastUsed: 0,
      failCount: 0,
      healthStatus: {
        isHealthy: true,
        lastCheck: null,
        consecutiveFailures: 0
      }
    };

    this.proxies.set(name, proxyConfig);
    ProxyLogger.log('proxy_added', { name, config: proxyConfig });
  },

  removeProxy(name) {
    this.proxies.delete(name);
    ProxyLogger.log('proxy_removed', { name });
  },

  async getProxy(name) {
    if (!name) {
      return this.getNextAvailableProxy();
    }
    return this.proxies.get(name);
  },

  async getNextAvailableProxy() {
    const now = Date.now();
    let availableProxies = Array.from(this.proxies.values())
      .filter(proxy => {
        if (!proxy.healthStatus.isHealthy) return false;
        if (proxy.failCount >= this.defaultConfig.maxRetries) return false;
        if (proxy.rotate && now - proxy.lastUsed < proxy.rotationInterval) return false;
        return true;
      });

    // Geofencing kontrolü
    if (this.defaultConfig.geofencing.enabled) {
      availableProxies = await ProxyGeofencing.filterProxiesByRegion(
        availableProxies,
        this.defaultConfig.geofencing.targetRegion
      );
    }

    if (availableProxies.length === 0) {
      throw new Error('No available proxies');
    }

    // En hızlı proxy'yi seç
    const fastestProxy = ProxyMetrics.getFastestProxy();
    if (fastestProxy && availableProxies.find(p => p.name === fastestProxy)) {
      return this.proxies.get(fastestProxy);
    }

    // En az kullanılan proxy'yi seç
    const selectedProxy = availableProxies.reduce((prev, current) => {
      return prev.lastUsed < current.lastUsed ? prev : current;
    });

    selectedProxy.lastUsed = now;
    return selectedProxy;
  },

  async startHealthChecks() {
    if (!this.defaultConfig.healthCheck.enabled) return;

    setInterval(async () => {
      for (const [name, proxy] of this.proxies) {
        const health = await ProxyHealthChecker.checkProxy(proxy, this.client);
        
        proxy.healthStatus = {
          isHealthy: health.isHealthy,
          lastCheck: new Date(),
          consecutiveFailures: health.isHealthy ? 0 : proxy.healthStatus.consecutiveFailures + 1
        };

        if (health.isHealthy) {
          ProxyMetrics.recordMetric(name, health.responseTime, true);
        }

        ProxyLogger.log('health_check', { name, health });
      }
    }, this.defaultConfig.healthCheck.interval);
  },

  markProxyAsFailed(name) {
    const proxy = this.proxies.get(name);
    if (proxy) {
      proxy.failCount++;
      ProxyMetrics.recordMetric(name, 0, false);
      ProxyLogger.log('proxy_failed', { name, failCount: proxy.failCount });
    }
  },

  resetProxyFailCount(name) {
    const proxy = this.proxies.get(name);
    if (proxy) {
      proxy.failCount = 0;
      ProxyLogger.log('proxy_reset', { name });
    }
  },

  getProxyUrl(proxy) {
    const { protocol, host, port, auth } = proxy;
    let url = `${protocol}://`;
    
    if (auth.username && auth.password) {
      url += `${encodeURIComponent(auth.username)}:${encodeURIComponent(auth.password)}@`;
    }
    
    url += `${host}:${port}`;
    return url;
  },

  getProxyMetrics(name) {
    return ProxyMetrics.getMetrics(name);
  },

  getProxyLogs(filter) {
    return ProxyLogger.getLogs(filter);
  }
};

export default ProxyManager; 