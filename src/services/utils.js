/**
 * Small helper functions
 */

/**
 * Check if value is a plain object
 * @param {*} value - Value to check
 * @returns {boolean} - True if value is a plain object
 */
export function isPlainObject(value) {
  return value !== null && typeof value === "object" && Object.prototype.toString.call(value) === "[object Object]"
}

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} - Merged object
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target

  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }

  return mergeDeep(target, ...sources)
}

/**
 * Build query string from params object
 * @param {Object} params - Parameters object
 * @returns {string} - Query string
 */
export function buildQueryString(params) {
  if (!params) return ""

  return Object.entries(params)
    .map(([key, value]) => {
      if (value === null || value === undefined) return ""

      if (Array.isArray(value)) {
        return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join("&")
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join("&")
}

/**
 * Parse response headers
 * @param {string} headerString - Headers string
 * @returns {Object} - Headers object
 */
export function parseHeaders(headerString) {
  const headers = {}

  if (!headerString) return headers

  headerString
    .split("\r\n")
    .filter(Boolean)
    .forEach((line) => {
      const [key, value] = line.split(": ")
      if (key && value) {
        headers[key.toLowerCase()] = value
      }
    })

  return headers
}
