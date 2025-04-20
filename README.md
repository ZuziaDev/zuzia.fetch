<div align="center">
  <img src="./assets/zuzia-fetch-logo.png" alt="@zuzia.dev/zuzia.fetch logo" width="500" />
</div>

# @zuzia.dev/zuzia.fetch

A lightweight, Promise-based HTTP client for the browser and Node.js, inspired by axios.

[![npm version](https://img.shields.io/npm/v/@zuzia.dev/zuzia.fetch.svg?style=flat-square)](https://www.npmjs.org/package/@zuzia.dev/zuzia.fetch)
[![npm downloads](https://img.shields.io/npm/dm/@zuzia.dev/zuzia.fetch.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@zuzia.dev/zuzia.fetch)

## Features

- 🚀 Promise-based API
- 🔄 Request and response interceptors
- 🛠️ Transform request and response data
- ⚙️ Automatic JSON data handling
- 🔌 Plugin system for extensibility
- ⏱️ Request timeout support
- 🔒 Built-in error handling
- 📦 Works in browser and Node.js
- 🧩 TypeScript support

## Installation

```bash
npm install @zuzia.dev/zuzia.fetch
# or
yarn add @zuzia.dev/zuzia.fetch
```

## Basic Usage

```javascript
import zuzia from '@zuzia.dev/zuzia.fetch';

// Make a GET request
zuzia.get('https://api.example.com/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

// Make a POST request
zuzia.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
})
  .then(response => {
    console.log(response.data);
  });
```

## Creating an Instance

You can create a custom instance with specific configuration:

```javascript
const api = zuzia.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token123'
  }
});

// All requests will use the base URL
api.get('/users'); // https://api.example.com/users
```

## Request Configuration

```javascript
// Request config options
const config = {
  url: '/users',
  method: 'get', // default
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    id: 123,
    sort: 'name'
  },
  data: {
    firstName: 'John',
    lastName: 'Doe'
  },
  timeout: 5000,
  auth: {
    username: 'user',
    password: 'pass'
  },
  responseType: 'json', // default, options: 'json', 'text', 'blob', 'arraybuffer'
  proxy: {
    host: '127.0.0.1',
    port: 9000
  }
};

zuzia.request(config);
```

## Interceptors

You can intercept requests or responses before they are handled:

```javascript
// Add a request interceptor
const removeRequestInterceptor = zuzia.useRequestInterceptor(config => {
  // Modify config before request is sent
  config.headers['X-Request-ID'] = generateId();
  return config;
});

// Add a response interceptor
const removeResponseInterceptor = zuzia.useResponseInterceptor(response => {
  // Any status code within the range of 2xx
  // Do something with response data
  return response;
});

// Add an error interceptor
const removeErrorInterceptor = zuzia.useErrorInterceptor(error => {
  // Any status codes outside the range of 2xx
  console.error('Request failed:', error.message);
  return Promise.reject(error);
});

// Remove interceptors when no longer needed
removeRequestInterceptor();
removeResponseInterceptor();
removeErrorInterceptor();
```

## Plugin System

@zuzia.dev/zuzia.fetch supports plugins to extend functionality:

```javascript
// Create a logger plugin
const loggerPlugin = {
  name: 'logger',
  beforeRequest: (config) => {
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  afterResponse: (response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response;
  }
};

// Register the plugin
zuzia.registerPlugin(loggerPlugin);
```

## Error Handling

@zuzia.dev/zuzia.fetch provides enhanced error objects:

```javascript
zuzia.get('/users/nonexistent')
  .then(response => {
    // Handle success
  })
  .catch(error => {
    if (error.name === 'HttpError') {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.status);
      console.log(error.response.data);
      console.log(error.response.headers);
    } else if (error.name === 'NetworkError') {
      // The request was made but no response was received
      console.log(error.message);
    } else if (error.name === 'TimeoutError') {
      // The request timed out
      console.log(error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
```

## Architecture

@zuzia.dev/zuzia.fetch is built with a modular architecture:

### Core Components

1. **zuzia_engine.js**: The core request engine that wraps the native `fetch` API.
2. **engine.js**: Manages request/response interceptors and orchestrates the request flow.
3. **headersConstructor.js**: Handles header normalization and default headers.
4. **optionsConstructor.js**: Processes user-supplied options and merges them with defaults.

### Helper Modules

1. **combineUrl.js**: Handles URL combining for baseURL and paths.
2. **errorHandler.js**: Creates custom error classes and handles error transformation.
3. **utils.js**: Provides utility functions like deep merging, query string building, etc.

### Extension Points

1. **pluginManager.js**: Implements a plugin system for middleware functionality.
2. **proxyManager.js**: Handles proxy configuration for requests.
3. **userAgentConstructor.js**: Manages User-Agent header creation.

## Flow of a Request

1. User makes a request using `zuzia.get('/users')` or similar method
2. Request config is merged with instance defaults
3. Headers are normalized
4. Plugins are applied to the request config
5. Request interceptors are applied in order
6. The request is made using the fetch API
7. Response is received and parsed based on responseType
8. Response interceptors are applied in order
9. Response is returned to the user

If an error occurs at any point:
1. The error is enhanced with additional information
2. Error interceptors are applied in order
3. The error is thrown to be caught by the user's catch handler

## Browser Support

@zuzia.dev/zuzia.fetch works in all modern browsers that support the Fetch API:

- Chrome 42+
- Firefox 39+
- Safari 10.1+
- Edge 14+

For older browsers, a fetch polyfill is required.

## Node.js Support

@zuzia.dev/zuzia.fetch works in Node.js 19.0.0 and higher.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
