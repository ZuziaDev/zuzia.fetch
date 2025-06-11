const ContextManager = {
  contexts: new Map(),

  createContext(name, config) {
    this.contexts.set(name, config);
  },

  getContext(name) {
    return this.contexts.get(name);
  },

  forUser(userId) {
    return {
      get: (url, config) => this.request(url, { ...config, userId }),
      post: (url, data, config) => this.request(url, { ...config, method: 'POST', data, userId })
      // ... diğer metodlar
    };
  }
};

export default ContextManager; 