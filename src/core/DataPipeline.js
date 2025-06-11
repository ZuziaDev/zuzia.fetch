const DataPipeline = {
  pipelines: new Map(),

  createPipeline(name, processors) {
    this.pipelines.set(name, processors);
  },

  async process(data, pipelineName) {
    const pipeline = this.pipelines.get(pipelineName);
    if (!pipeline) return data;

    let result = data;
    for (const processor of pipeline) {
      result = await processor(result);
    }
    return result;
  }
};

export default DataPipeline; 