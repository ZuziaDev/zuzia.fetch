const ProxyHealthChecker = {
  checkInterval: 30000, // 30 saniye
  timeout: 5000, // 5 saniye
  healthyThreshold: 3, // 3 başarılı istek

  async checkProxy(proxy, client) {
    try {
      const startTime = Date.now();
      const response = await client.get('https://api.ipify.org?format=json', {
        proxy: proxy.name,
        timeout: this.timeout
      });
      const endTime = Date.now();

      return {
        isHealthy: true,
        responseTime: endTime - startTime,
        ip: response.data.ip
      };
    } catch (error) {
      return {
        isHealthy: false,
        error: error.message
      };
    }
  }
};

export default ProxyHealthChecker; 