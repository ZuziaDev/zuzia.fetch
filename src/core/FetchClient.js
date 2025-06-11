import { buildURL } from '../utils/url.js';
import { transformRequest, transformResponse } from '../utils/transform.js';
import { handleError } from '../utils/error.js';
import { InterceptorManager } from './InterceptorManager.js';
import { RequestManager } from './RequestManager.js';
import { ResponseManager } from './ResponseManager.js';
import { RetryManager } from './RetryManager.js';
import { ProgressManager } from './ProgressManager.js';
import { CacheManager } from './CacheManager.js';
import { RequestQueue } from './RequestQueue.js';
import { CancelToken } from './CancelToken.js';
import { ErrorManager } from './ErrorManager.js';
import { TransformManager } from './TransformManager.js';
import { RateLimiter } from './RateLimiter.js';
import { SchemaValidator } from './SchemaValidator.js';
import { Debugger } from './Debugger.js';
import { AIMockGenerator } from './AIMockGenerator.js';
import { OfflineManager } from './OfflineManager.js';
import { MiddlewareManager } from './MiddlewareManager.js';
import { GraphQLClient } from './GraphQLClient.js';
import { Scheduler } from './Scheduler.js';
import { AuthManager } from './AuthManager.js';
import { ProxyManager } from './ProxyManager.js';
import { ProxyMetrics } from './ProxyMetrics.js';
import { SmartLayer } from './SmartLayer.js';
import { MultiSourceManager } from './MultiSourceManager.js';
import { PluginSystem } from './PluginSystem.js';
import { DataPipeline } from './DataPipeline.js';
import { ContextManager } from './ContextManager.js';
import { SecurityManager } from './SecurityManager.js';
import { AnalyticsManager } from './AnalyticsManager.js';
import { VersionManager } from './VersionManager.js';
import { ChainManager } from './ChainManager.js';

const FetchClient = {
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

    this.proxyManager = ProxyManager;
    this.proxyManager.init(this);

    this.requestManager = new RequestManager(this);
    this.responseManager = new ResponseManager(this);
    this.retryManager = new RetryManager();
    this.progressManager = new ProgressManager();
    this.cacheManager = new CacheManager();
    this.requestQueue = new RequestQueue();
    this.transformManager = new TransformManager();
    this.rateLimiter = new RateLimiter();
    this.schemaValidator = new SchemaValidator();
    this.debugger = new Debugger();
    this.mockGenerator = new AIMockGenerator();
    this.offlineManager = new OfflineManager();
    this.middlewareManager = new MiddlewareManager();
    this.graphql = new GraphQLClient(this);
    this.scheduler = new Scheduler();
    this.authManager = new AuthManager();

    this.smartLayer = SmartLayer;
    this.multiSource = MultiSourceManager;
    this.pluginSystem = PluginSystem;
    this.dataPipeline = DataPipeline;
    this.contextManager = ContextManager;
    this.securityManager = SecurityManager;
    this.analyticsManager = AnalyticsManager;
    this.versionManager = VersionManager;
    this.chainManager = ChainManager;

    return this;
  },

  async request(config) {
    // Smart Layer analizi
    if (this.smartLayer.learningMode) {
      this.smartLayer.analyzePattern(config);
    }

    // Context kontrolü
    if (config.context) {
      config = this.contextManager.getContext(config.context);
    }

    // Pipeline işlemi
    if (config.pipeline) {
      config.data = await this.dataPipeline.process(config.data, config.pipeline);
    }

    // Versiyon kontrolü
    if (config.version) {
      config = await this.versionManager.handleRequest(config.url, config);
    }

    // Ana istek
    const response = await this.executeRequest(config);

    // Analytics
    this.analyticsManager.triggerHook('onResponseEnd', { config, response });

    return response;
  },

  async executeRequest(config) {
    // Debug mode
    if (config.debug) {
      this.debugger.enable();
      this.debugger.log('request', config);
    }

    // Offline mode
    if (config.offline) {
      const cachedResponse = await this.offlineManager.getCachedResponse(config.url);
      if (cachedResponse) return cachedResponse;
    }

    // Rate limiting
    if (config.rateLimit) {
      return this.rateLimiter.throttle(
        config.url,
        () => this.executeRequest(config),
        config.rateLimit
      );
    }

    // Middleware chain
    const context = { config, client: this };
    return this.middlewareManager.execute(context, async () => {
      try {
        const response = await this.makeRequest(config);
        
        // Schema validation
        if (config.schema) {
          response.data = this.schemaValidator.validate(
            config.schema,
            response.data
          );
        }

        // Debug mode
        if (config.debug) {
          this.debugger.log('response', response);
        }

        // Offline mode
        if (config.offline) {
          await this.offlineManager.cacheRequest(config.url, response);
        }

        return response;
      } catch (error) {
        // AI Mock generation
        if (config.mock) {
          return this.mockGenerator.generateMockResponse(config);
        }

        throw error;
      }
    });
  },

  async makeRequest(config) {
    config = this.mergeConfig(this.defaults, config);
    
    // Cancel token kontrolü
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    // Cache kontrolü
    if (config.cache) {
      const cachedData = await this.cacheManager.get(config.url, config);
      if (cachedData) return cachedData;
    }

    // Request interceptor chain
    const requestInterceptorChain = this.interceptors.request.handlers;
    let promise = Promise.resolve(config);

    requestInterceptorChain.forEach(interceptor => {
      promise = promise.then(interceptor.fulfilled, interceptor.rejected);
    });

    // Ana istek
    promise = promise.then(async (config) => {
      const request = () => this.requestManager.execute(config);
      
      if (config.queue) {
        return this.requestQueue.add(request);
      }
      
      return request();
    });

    // Response interceptor chain
    const responseInterceptorChain = this.interceptors.response.handlers;
    responseInterceptorChain.forEach(interceptor => {
      promise = promise.then(interceptor.fulfilled, interceptor.rejected);
    });

    // Cache'e kaydet
    promise = promise.then(response => {
      if (config.cache) {
        this.cacheManager.set(config.url, response, config);
      }
      return response;
    });

    return promise;
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

  // HTTP methods
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
  },

  patch(url, data, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data });
  },

  chain(chain) {
    return this.chainManager.executeChain(chain);
  }
};

export default FetchClient; 