import { transformResponse } from '../utils/transform.js';

export class ResponseManager {
  constructor(client) {
    this.client = client;
  }

  async transformResponse(response, config) {
    const contentType = response.headers.get('content-type');
    return await transformResponse(response, contentType, config);
  }

  parseHeaders(headers) {
    const parsed = {};
    headers.forEach((value, key) => {
      parsed[key] = value;
    });
    return parsed;
  }
} 