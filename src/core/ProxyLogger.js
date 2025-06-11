const ProxyLogger = {
  logs: [],
  maxLogs: 1000,

  log(type, data) {
    const logEntry = {
      timestamp: new Date(),
      type,
      data
    };

    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.saveToStorage();
  },

  getLogs(filter = {}) {
    let filteredLogs = this.logs;

    if (filter.type) {
      filteredLogs = filteredLogs.filter(log => log.type === filter.type);
    }

    if (filter.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate);
    }

    if (filter.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate);
    }

    return filteredLogs;
  },

  saveToStorage() {
    try {
      localStorage.setItem('proxy_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs to storage:', error);
    }
  },

  loadFromStorage() {
    try {
      const savedLogs = localStorage.getItem('proxy_logs');
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Error loading logs from storage:', error);
    }
  }
};

export default ProxyLogger; 