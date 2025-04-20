/**
 * Combine base URL and path
 */

/**
 * Join base URL and path
 * @param {string} baseURL - Base URL
 * @param {string} path - Path to join
 * @returns {string} - Combined URL
 */
export function joinUrl(baseURL, path) {
  if (!baseURL) return path
  if (!path) return baseURL

  // Remove trailing slash from baseURL
  const normalizedBase = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL

  // Remove leading slash from path
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path

  return `${normalizedBase}/${normalizedPath}`
}
