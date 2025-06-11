const AnalyticsManager = {
  metrics: new Map(),
  hooks: new Map(),

  registerHook(event, callback) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push(callback);
  },

  async triggerHook(event, data) {
    const hooks = this.hooks.get(event) || [];
    for (const hook of hooks) {
      await hook(data);
    }
  },

  pushMetric(name, value) {
    this.metrics.set(name, value);
    // Metric servislerine gönderme
  }
};

export default AnalyticsManager; 