/**
 * Handling user supplied options
 */

import { getUserAgent } from "./userAgentConstructor.js"
import { configureProxy } from "./proxyManager.js"

/**
 * Merge options with defaults
 * @param {Object} config - Request configuration
 * @returns {Object} - Merged configuration
 */
export function mergeOptions(config) {
  const mergedConfig = { ...config }

  // Add User-Agent header if not present
  if (!mergedConfig.headers["User-Agent"] && !mergedConfig.headers["user-agent"]) {
    mergedConfig.headers["User-Agent"] = getUserAgent()
  }

  // Configure proxy if needed
  if (mergedConfig.proxy) {
    mergedConfig.agent = configureProxy(mergedConfig.proxy)
  }

  // Set default timeout
  if (mergedConfig.timeout === undefined) {
    mergedConfig.timeout = 0 // No timeout by default
  }

  return mergedConfig
}
