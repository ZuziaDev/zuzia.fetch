/**
 * Plugin middleware system
 */

/**
 * Apply plugins to request config
 * @param {Array} plugins - Array of plugins
 * @param {Object} config - Request configuration
 * @returns {Object} - Modified configuration
 */
export async function applyPlugins(plugins, config) {
  let modifiedConfig = { ...config }

  for (const plugin of plugins) {
    if (typeof plugin.beforeRequest === "function") {
      modifiedConfig = await plugin.beforeRequest(modifiedConfig)
    }
  }

  return modifiedConfig
}

/**
 * Create a plugin
 * @param {Object} options - Plugin options
 * @returns {Object} - Plugin object
 */
export function createPlugin(options) {
  return {
    name: options.name || "unnamed-plugin",
    beforeRequest: options.beforeRequest || null,
    afterResponse: options.afterResponse || null,
    onError: options.onError || null,
  }
}
