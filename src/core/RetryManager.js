export class RetryManager {
  constructor() {
    this.defaultConfig = {
      retries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      factor: 2,
      retryCondition: (error) => {
        return error.code === 'ECONNABORTED' || 
               error.response?.status >= 500 ||
               error.response?.status === 429;
      }
    };
  }

  calculateDelay(retryCount, config) {
    const delay = Math.min(
      config.initialDelay * Math.pow(config.factor, retryCount),
      config.maxDelay
    );
    return delay + Math.random() * 1000; // Jitter ekle
  }

  shouldRetry(error, config) {
    const retryConfig = { ...this.defaultConfig, ...config.retry };
    return retryConfig.retries > 0 && retryConfig.retryCondition(error);
  }

  async retryRequest(requestManager, config) {
    const retryConfig = { ...this.defaultConfig, ...config.retry };
    retryConfig.retries--;

    const delay = this.calculateDelay(
      this.defaultConfig.retries - retryConfig.retries,
      retryConfig
    );

    await new Promise(resolve => setTimeout(resolve, delay));

    return requestManager.execute({
      ...config,
      retry: retryConfig
    });
  }
} 