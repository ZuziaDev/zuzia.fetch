export class CancelToken {
  constructor() {
    this.reason = null;
    this.listeners = [];
  }

  static source() {
    const token = new CancelToken();
    return {
      token,
      cancel: (message) => {
        token.reason = message || 'Request cancelled';
        token.listeners.forEach(listener => listener(token.reason));
      }
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  throwIfRequested() {
    if (this.reason) {
      throw new Error(this.reason);
    }
  }
} 