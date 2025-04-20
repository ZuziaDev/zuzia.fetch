/**
 * Create User-Agent header
 */

import { version } from "../helpers/checkVersion.js"

/**
 * Get User-Agent string
 * @returns {string} - User-Agent string
 */
export function getUserAgent() {
  const zuzia = `zuzia.fetch/${version}`

  // Add platform info if available
  let platformInfo = ""

  if (typeof navigator !== "undefined" && navigator.userAgent) {
    // Browser environment
    platformInfo = navigator.userAgent
  } else if (typeof process !== "undefined") {
    // Node.js environment
    platformInfo = `Node.js/${process.version}`
  }

  return platformInfo ? `${zuzia} ${platformInfo}` : zuzia
}
