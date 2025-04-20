/**
 * Error handling utilities
 */

/**
 * HTTP error class
 */
export class HttpError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {Object} response - Response object
   */
  constructor(message, status, response) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.response = response
  }
}

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(message) {
    super(message)
    this.name = "NetworkError"
  }
}

/**
 * Timeout error class
 */
export class TimeoutError extends Error {
  constructor(message) {
    super(message)
    this.name = "TimeoutError"
  }
}

/**
 * Create an error based on HTTP status code
 * @param {Response} response - Fetch Response object
 * @param {Object} data - Response data
 * @returns {HttpError} - Custom error object
 */
export function createHttpError(response, data) {
  const status = response.status
  const message = data?.message || `HTTP Error ${status}`

  return new HttpError(message, status, {
    data,
    headers: Object.fromEntries(response.headers.entries()),
    status,
    statusText: response.statusText,
  })
}

/**
 * Handle fetch errors
 * @param {Error} error - Original error
 * @returns {Error} - Enhanced error
 */
export function handleFetchError(error) {
  if (error.name === "AbortError") {
    return new TimeoutError("Request timeout")
  }

  return new NetworkError(error.message)
}
