const ProxyMetrics = {
  metrics: new Map(),

  recordMetric(proxyName, responseTime, success) {
    if (!this.metrics.has(proxyName)) {
      this.metrics.set(proxyName, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalResponseTime: 0,
        averageResponseTime: 0,
        lastUsed: null
      });
    }

    const metric = this.metrics.get(proxyName);
    metric.totalRequests++;
    metric.totalResponseTime += responseTime;
    metric.averageResponseTime = metric.totalResponseTime / metric.totalRequests;
    metric.lastUsed = Date.now();

    if (success) {
      metric.successfulRequests++;
    } else {
      metric.failedRequests++;
    }
  },

  getMetrics(proxyName) {
    return this.metrics.get(proxyName);
  },

  getFastestProxy() {
    let fastestProxy = null;
    let fastestTime = Infinity;

    for (const [name, metric] of this.metrics) {
      if (metric.averageResponseTime < fastestTime) {
        fastestTime = metric.averageResponseTime;
        fastestProxy = name;
      }
    }

    return fastestProxy;
  }
};

export default ProxyMetrics; 