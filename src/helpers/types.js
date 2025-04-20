/**
 * Type definitions for zuzia.fetch
 *
 * @typedef {Object} RequestConfig
 * @property {string} [url] - Request URL
 * @property {string} [method='GET'] - Request method
 * @property {Object} [headers] - Request headers
 * @property {Object|string} [data] - Request body
 * @property {string} [baseURL] - Base URL for request
 * @property {number} [timeout] - Request timeout in ms
 * @property {Object} [params] - URL parameters
 * @property {AbortSignal} [signal] - AbortSignal for cancellation
 * @property {Object} [auth] - Basic auth credentials
 * @property {Object} [proxy] - Proxy configuration
 *
 * @typedef {Object} Response
 * @property {Object|string} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Object} headers - Response headers
 * @property {RequestConfig} config - Request configuration
 *
 * @typedef {Function} RequestInterceptor
 * @param {RequestConfig} config - Request configuration
 * @returns {RequestConfig|Promise<RequestConfig>} - Modified config
 *
 * @typedef {Function} ResponseInterceptor
 * @param {Response} response - Response object
 * @returns {Response|Promise<Response>} - Modified response
 *
 * @typedef {Function} ErrorInterceptor
 * @param {Error} error - Error object
 * @returns {Error|Promise<Error>} - Modified error or Promise rejection
 *
 * @typedef {Object} ZuziaInstance
 * @property {Function} request - Make a request
 * @property {Function} get - GET request shorthand
 * @property {Function} post - POST request shorthand
 * @property {Function} put - PUT request shorthand
 * @property {Function} delete - DELETE request shorthand
 * @property {Function} patch - PATCH request shorthand
 * @property {Function} head - HEAD request shorthand
 * @property {Function} options - OPTIONS request shorthand
 * @property {Function} useRequestInterceptor - Add request interceptor
 * @property {Function} useResponseInterceptor - Add response interceptor
 * @property {Function} useErrorInterceptor - Add error interceptor
 * @property {Function} create - Create new instance
 */

// This file is for documentation purposes only
// No actual code is exported
