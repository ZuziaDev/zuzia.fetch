const PluginSystem = {
  plugins: new Map(),

  use(plugin) {
    if (typeof plugin.install !== 'function') {
      throw new Error('Plugin must have an install method');
    }
    plugin.install(this);
    this.plugins.set(plugin.name, plugin);
  },

  getPlugin(name) {
    return this.plugins.get(name);
  },

  removePlugin(name) {
    this.plugins.delete(name);
  }
};

export default PluginSystem; 