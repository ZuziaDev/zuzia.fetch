const ChainManager = {
  async executeChain(chain) {
    const results = new Map();
    
    for (const step of chain) {
      if (step.dependsOn) {
        const dependency = results.get(step.dependsOn);
        if (!dependency) {
          throw new Error(`Dependency ${step.dependsOn} not found`);
        }
        step.data = this.injectDependency(step.data, dependency);
      }
      
      const result = await this.executeStep(step);
      results.set(step.name, result);
    }
    
    return results;
  }
};

export default ChainManager; 