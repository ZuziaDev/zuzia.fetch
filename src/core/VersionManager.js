const VersionManager = {
  versions: new Map(),
  fallbackStrategy: 'auto',

  registerVersion(version, config) {
    this.versions.set(version, config);
  },

  async handleRequest(url, config) {
    const version = this.extractVersion(url);
    if (!this.versions.has(version) && this.fallbackStrategy === 'auto') {
      return this.fallbackToPreviousVersion(version);
    }
    return this.versions.get(version);
  }
};

export default VersionManager; 