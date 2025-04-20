/**
 * Request/response interceptor management
 */

import { makeRequest } from "./zuzia_engine.js"
import { normalizeHeaders } from "./headersConstructor.js"
import { mergeOptions } from "./optionsConstructor.js"
import { applyPlugins } from "./pluginManager.js"
import { mergeDeep } from "./utils.js"

/**
 * Create a new zuzia instance
 * @param {Object} defaultConfig - Default configuration
 * @returns {Object} - Zuzia instance
 */
export function createInstance(defaultConfig = {}) {
  // Store interceptors
  const interceptors = {
    request: [],
    response: [],
    error: [],
  }

  // Store plugins
  const plugins = []

  /**
   * Make a request with interceptors
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} - Response object
   */
  async function request(config) {
    // Merge default config with request config
    let mergedConfig = mergeDeep({}, defaultConfig, config)

    // Normalize headers
    mergedConfig.headers = normalizeHeaders(mergedConfig.headers, mergedConfig)

    // Process options
    mergedConfig = mergeOptions(mergedConfig)

    // Apply plugins
    mergedConfig = await applyPlugins(plugins, mergedConfig)

    // Apply request interceptors
    for (const interceptor of interceptors.request) {
      mergedConfig = await interceptor(mergedConfig)
    }

    try {
      // Make request
      let response = await makeRequest(mergedConfig)

      // Apply response interceptors
      for (const interceptor of interceptors.response) {
        response = await interceptor(response)
      }

      return response
    } catch (error) {
      // Apply error interceptors
      let processedError = error

      for (const interceptor of interceptors.error) {
        try {
          processedError = await interceptor(processedError)
          // If interceptor returns a value, break the chain
          if (processedError !== undefined) {
            return processedError
          }
        } catch (newError) {
          processedError = newError
        }
      }

      throw processedError
    }
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Request interceptor
   * @returns {Function} - Function to remove interceptor
   */
  function useRequestInterceptor(interceptor) {
    interceptors.request.push(interceptor)
    return () => {
      const index = interceptors.request.indexOf(interceptor)
      if (index !== -1) {
        interceptors.request.splice(index, 1)
      }
    }
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Response interceptor
   * @returns {Function} - Function to remove interceptor
   */
  function useResponseInterceptor(interceptor) {
    interceptors.response.push(interceptor)
    return () => {
      const index = interceptors.response.indexOf(interceptor)
      if (index !== -1) {
        interceptors.response.splice(index, 1)
      }
    }
  }

  /**
   * Add error interceptor
   * @param {Function} interceptor - Error interceptor
   * @returns {Function} - Function to remove interceptor
   */
  function useErrorInterceptor(interceptor) {
    interceptors.error.push(interceptor)
    return () => {
      const index = interceptors.error.indexOf(interceptor)
      if (index !== -1) {
        interceptors.error.splice(index, 1)
      }
    }
  }

  /**
   * Register plugin
   * @param {Object} plugin - Plugin object
   */
  function registerPlugin(plugin) {
    plugins.push(plugin)
  }

  // Create instance with HTTP method shortcuts
  const instance = {
    request,
    useRequestInterceptor,
    useResponseInterceptor,
    useErrorInterceptor,
    registerPlugin,
  }

  // Add HTTP method shortcuts
  const methods = ["get", "post", "put", "delete", "patch", "head", "options"]

  methods.forEach((method) => {
    instance[method] = (url, config = {}) => {
      return request({
        ...config,
        method: method.toUpperCase(),
        url,
      })
    }
  })

  // Special case for post, put, patch to accept data parameter
  ;["post", "put", "patch"].forEach((method) => {
    const originalMethod = instance[method]
    instance[method] = (url, data, config = {}) => {
      return originalMethod(url, {
        ...config,
        data,
      })
    }
  })

  return instance
}
