export class OfflineManager {
  constructor() {
    this.db = null;
    this.initDB();
  }

  async initDB() {
    this.db = await this.openDatabase();
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FetchClientDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('requests');
        db.createObjectStore('responses');
      };
    });
  }

  async cacheRequest(key, request) {
    const tx = this.db.transaction('requests', 'readwrite');
    await tx.objectStore('requests').put(request, key);
  }

  async getCachedResponse(key) {
    const tx = this.db.transaction('responses', 'readonly');
    return await tx.objectStore('responses').get(key);
  }
} 