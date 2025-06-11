const client = FetchClient.init({
  baseURL: 'https://api.example.com'
});

// Proxy ekleme
client.proxyManager.addProxy('proxy1', {
  protocol: 'http',
  host: 'proxy1.example.com',
  port: 8080,
  auth: {
    username: 'user1',
    password: 'pass1'
  },
  rotate: true,
  rotationInterval: 10000,
  healthCheck: {
    enabled: true,
    interval: 30000
  },
  geofencing: {
    enabled: true,
    targetRegion: 'Europe'
  }
});

// Proxy ile istek atma
client.get('/users', {
  proxy: 'proxy1'
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Proxy metriklerini görüntüleme
const metrics = client.proxyManager.getProxyMetrics('proxy1');
console.log('Proxy Metrics:', metrics);

// Proxy loglarını görüntüleme
const logs = client.proxyManager.getProxyLogs({
  type: 'health_check',
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Son 24 saat
});
console.log('Proxy Logs:', logs); 