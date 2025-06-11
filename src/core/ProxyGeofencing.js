const ProxyGeofencing = {
  async getProxyLocation(ip) {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      console.error('Error getting proxy location:', error);
      return null;
    }
  },

  async filterProxiesByRegion(proxies, targetRegion) {
    const filteredProxies = [];
    
    for (const proxy of proxies) {
      const location = await this.getProxyLocation(proxy.host);
      if (location && location.region === targetRegion) {
        filteredProxies.push(proxy);
      }
    }

    return filteredProxies;
  }
};

export default ProxyGeofencing; 