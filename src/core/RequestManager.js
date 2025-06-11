import { buildURL } from '../utils/url.js';
import { transformRequest } from '../utils/transform.js';
import { handleError } from '../utils/error.js';
import { RetryManager } from './RetryManager.js';
import { ProgressManager } from './ProgressManager.js';

export class RequestManager {
  constructor(client) {
    this.client = client;
    this.retryManager = new RetryManager();
    this.progressManager = new ProgressManager();
  }

  async execute(config) {
    const controller = new AbortController();
    const timeoutId = config.timeout ? 
      setTimeout(() => controller.abort(), config.timeout) : null;

    try {
      const response = await this.makeRequest(config, controller);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleRequestError(error, config);
    }
  }

  async makeRequest(config, controller) {
    const url = buildURL(config);
    const requestConfig = {
      method: config.method,
      headers: config.headers,
      body: transformRequest(config.data),
      signal: controller.signal
    };

    if (config.onUploadProgress) {
      this.progressManager.setupUploadProgress(config, requestConfig);
    }

    const response = await fetch(url, requestConfig);
    return this.handleResponse(response, config);
  }

  async handleResponse(response, config) {
    const data = await this.client.responseManager.transformResponse(response, config);
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: this.client.responseManager.parseHeaders(response.headers),
      config
    };
  }

  handleRequestError(error, config) {
    if (this.retryManager.shouldRetry(error, config)) {
      return this.retryManager.retryRequest(this, config);
    }
    return handleError(error);
  }
} 