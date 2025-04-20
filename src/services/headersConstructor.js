/**
 * Normalizing headers
 */

/**
 * Normalize header names
 * @param {Object} headers - Headers object
 * @returns {Object} - Normalized headers
 */
function normalizeHeaderNames(headers) {
  const normalized = {}
  const headerMap = {
    "content-type": "Content-Type",
    accept: "Accept",
    authorization: "Authorization",
  }

  Object.entries(headers).forEach(([key, value]) => {
    const normalizedKey = headerMap[key.toLowerCase()] || key
    normalized[normalizedKey] = value
  })

  return normalized
}

/**
 * Set content type header based on data
 * @param {Object} headers - Headers object
 * @param {*} data - Request data
 * @returns {Object} - Updated headers
 */
function setContentTypeHeader(headers, data) {
  if (!data) return headers

  // Don't override if already set
  if (headers["Content-Type"]) return headers

  const newHeaders = { ...headers }

  if (typeof FormData !== "undefined" && data instanceof FormData) {
    // Let browser set content type for FormData
    return newHeaders
  }

  if (typeof data === "object") {
    newHeaders["Content-Type"] = "application/json"
  }

  return newHeaders
}

/**
 * Normalize headers
 * @param {Object} headers - Headers object
 * @param {Object} config - Request config
 * @returns {Object} - Normalized headers
 */
export function normalizeHeaders(headers = {}, config = {}) {
  let normalizedHeaders = normalizeHeaderNames(headers)

  // Set content type based on data
  normalizedHeaders = setContentTypeHeader(normalizedHeaders, config.data)

  // Set authorization header if auth is provided
  if (config.auth) {
    const { username, password } = config.auth
    const credentials = `${username}:${password}`
    const encoded = typeof btoa !== "undefined" ? btoa(credentials) : Buffer.from(credentials).toString("base64")

    normalizedHeaders["Authorization"] = `Basic ${encoded}`
  }

  return normalizedHeaders
}
