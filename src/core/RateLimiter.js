export class RateLimiter {
  constructor() {
    this.queues = new Map();
    this.defaultConfig = {
      maxRequestsPerSecond: 5,
      maxConcurrent: 3
    };
  }

  async throttle(key, request, config = {}) {
    const queueConfig = { ...this.defaultConfig, ...config };
    
    if (!this.queues.has(key)) {
      this.queues.set(key, {
        requests: [],
        processing: false,
        lastRequestTime: 0
      });
    }

    const queue = this.queues.get(key);
    
    return new Promise((resolve, reject) => {
      queue.requests.push({ request, resolve, reject });
      this.processQueue(key, queueConfig);
    });
  }

  async processQueue(key, config) {
    const queue = this.queues.get(key);
    if (queue.processing || queue.requests.length === 0) return;

    queue.processing = true;
    const now = Date.now();
    const timeSinceLastRequest = now - queue.lastRequestTime;
    const minInterval = 1000 / config.maxRequestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, minInterval - timeSinceLastRequest)
      );
    }

    const { request, resolve, reject } = queue.requests.shift();
    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      queue.lastRequestTime = Date.now();
      queue.processing = false;
      this.processQueue(key, config);
    }
  }
} 