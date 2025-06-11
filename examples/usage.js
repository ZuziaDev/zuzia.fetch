import { FetchClient } from '../src/index.js';

const client = new FetchClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token123'
  },
  retry: {
    retries: 3,
    retryDelay: 1000
  }
});

// Request interceptor
client.interceptors.request.use(
  config => {
    console.log('Request gönderiliyor:', config);
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  response => {
    console.log('Response alındı:', response);
    return response;
  },
  error => Promise.reject(error)
);

// GET isteği örneği
client.get('/users', {
  params: {
    page: 1,
    limit: 10
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST isteği örneği
client.post('/users', {
  name: 'John',
  email: 'john@example.com'
}, {
  onUploadProgress: (progress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error)); 