import { InterceptorManager } from './core/InterceptorManager.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

  const ZuziaFetch = {
  init(config = {}) {
    this.defaults = {
      baseURL: '',
      timeout: 0,
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    };

    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };

    return this;
  },

  async request(config) {
    config = this.mergeConfig(this.defaults, config);
    
    try {
      const requestConfig = {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined
      };

      // Proxy yapılandırması
      if (config.proxy) {
        const proxyUrl = this.buildProxyUrl(config.proxy);
        requestConfig.agent = new HttpsProxyAgent(proxyUrl);
      }

      const response = await fetch(this.buildURL(config), requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
        config
      };
    } catch (error) {
      throw error;
    }
  },

  mergeConfig(defaults, config) {
    return {
      ...defaults,
      ...config,
      headers: {
        ...defaults.headers,
        ...config.headers
      }
    };
  },

  buildURL(config) {
    const { baseURL, url } = config;
    return baseURL ? `${baseURL}${url}` : url;
  },

  parseHeaders(headers) {
    const parsed = {};
    headers.forEach((value, key) => {
      parsed[key] = value;
    });
    return parsed;
  },

  buildProxyUrl(proxy) {
    const { protocol, host, port, auth } = proxy;
    let url = `${protocol}://`;
    
    if (auth && auth.username && auth.password) {
      url += `${encodeURIComponent(auth.username)}:${encodeURIComponent(auth.password)}@`;
    }
    
    url += `${host}:${port}`;
    return url;
  },

  get(url, config = {}) {
    return this.request({ ...config, method: 'GET', url });
  },

  post(url, data, config = {}) {
    return this.request({ ...config, method: 'POST', url, data });
  },

  put(url, data, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data });
  },

  delete(url, config = {}) {
    return this.request({ ...config, method: 'DELETE', url });
  }
};

export { ZuziaFetch };