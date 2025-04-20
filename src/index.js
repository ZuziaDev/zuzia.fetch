/**
 * zuzia.fetch - A Promise-based HTTP client
 */

import { createInstance } from "./services/engine.js"
import { version } from "./helpers/checkVersion.js"

// Create default instance
const defaultInstance = createInstance({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
})

// Add create method to default instance
defaultInstance.create = function create(config) {
  return createInstance(config)
}

// Add version info
defaultInstance.VERSION = version

// Export default instance
export default defaultInstance

// Named exports for advanced usage
export { createInstance, version }
