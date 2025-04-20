/**
 * Check Node.js version compatibility
 */

// This would normally be imported from package.json
// For this skeleton, we'll define it directly
export const version = "1.0.0"
const requiredNodeVersion = "14.0.0"

/**
 * Compares version strings
 * @param {string} current - Current version
 * @param {string} required - Required version
 * @returns {boolean} - True if current version is compatible
 */
function compareVersions(current, required) {
  const currentParts = current.split(".").map(Number)
  const requiredParts = required.split(".").map(Number)

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] > requiredParts[i]) return true
    if (currentParts[i] < requiredParts[i]) return false
  }

  return true
}

/**
 * Check if current Node.js version is compatible
 * @throws {Error} If Node.js version is not compatible
 */
export function checkNodeVersion() {
  const nodeVersion = process.version.slice(1) // Remove 'v' prefix

  if (!compareVersions(nodeVersion, requiredNodeVersion)) {
    throw new Error(
      `zuzia.fetch requires Node.js version ${requiredNodeVersion} or higher. ` + `Current version: ${nodeVersion}`,
    )
  }
}

// Run check when imported
try {
  // Only run in Node.js environment
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    checkNodeVersion()
  }
} catch (error) {
  console.warn(`Version check warning: ${error.message}`)
}
