import { FetchClient } from '../src/index.js';
import { z } from 'zod';

const client = new FetchClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token123'
  },
  retry: {
    retries: 3,
    retryDelay: 1000
  },
  cache: {
    ttl: 5 * 60 * 1000,
    maxSize: 100,
    storage: 'memory'
  },
  debug: true,
  offline: true
});

// Schema validation
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});

client.schemaValidator.registerSchema('user', userSchema);

// Rate limiting
client.get('/users', {
  rateLimit: {
    maxRequestsPerSecond: 5
  }
});

// GraphQL
client.graphql.query(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`, { id: 1 });

// Scheduled request
client.scheduler.schedule(
  '/users',
  '*/5 * * * *', // Her 5 dakikada bir
  (response) => console.log(response)
);

// Middleware
client.middlewareManager.use(async (context, next) => {
  // Request middleware
  const response = await next();
  // Response middleware
  return response;
});

// Offline mode
client.get('/users', {
  offline: true,
  schema: 'user'
});

// Debug mode
client.get('/users', {
  debug: true
});

// AI Mock
client.get('/users', {
  mock: true
});

// Cancel token örneği
const source = CancelToken.source();
client.get('/users', {
  cancelToken: source.token
}).catch(error => {
  if (error.message === 'Request cancelled') {
    console.log('İstek iptal edildi');
  }
});

// İsteği iptal et
source.cancel('İstek kullanıcı tarafından iptal edildi');

// Özel dönüşüm örneği
client.post('/users', {
  name: 'John',
  email: 'john@example.com'
}, {
  transformRequest: [(data) => {
    // Özel request dönüşümü
    return data;
  }],
  transformResponse: [(data) => {
    // Özel response dönüşümü
    return data;
  }],
  onUploadProgress: (progress) => {
    console.log(`Upload progress: ${progress.percentage}%`);
  }
});

// Sıralı istek örneği
client.get('/users', { queue: true });
client.get('/posts', { queue: true });
client.get('/comments', { queue: true }); 