import { FetchClient } from '../src/index.js';

const client = new FetchClient({
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
  rotationInterval: 10000 // 10 saniye
});

client.proxyManager.addProxy('proxy2', {
  protocol: 'https',
  host: 'proxy2.example.com',
  port: 8443,
  auth: {
    username: 'user2',
    password: 'pass2'
  }
});

// Proxy ile istek atma
client.get('/users', {
  proxy: 'proxy1'
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Otomatik proxy rotasyonu ile istek atma
client.get('/posts', {
  proxy: true // Otomatik proxy seçimi
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Proxy yönetimi
client.proxyManager.removeProxy('proxy1');

// Proxy durumunu kontrol etme
const proxy = client.proxyManager.getProxy('proxy2');
console.log(proxy); 