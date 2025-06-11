export class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject
      });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const { request, resolve, reject } = this.queue.shift();

    try {
      const response = await request();
      resolve(response);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      this.process();
    }
  }

  clear() {
    this.queue = [];
  }
} 