/**
 * Internal request engine (fetch wrapper)
 */

import { createHttpError, handleFetchError } from "../helpers/errorHandler.js"
import { joinUrl } from "../helpers/combineUrl.js"
import { buildQueryString } from "./utils.js"

/**
 * Make a request using fetch
 * @param {Object} config - Request configuration
 * @returns {Promise<Object>} - Response object
 */
export async function makeRequest(config) {
  const {
    url,
    method = "GET",
    headers = {},
    data,
    baseURL,
    timeout = 0,
    params,
    signal: customSignal,
    responseType = "json",
  } = config

  // Combine base URL and path
  const fullUrl = joinUrl(baseURL, url) + (params ? `?${buildQueryString(params)}` : "")

  // Create abort controller for timeout
  const controller = new AbortController()
  const signal = customSignal || controller.signal

  // Set timeout if specified
  let timeoutId
  if (timeout > 0) {
    timeoutId = setTimeout(() => controller.abort(), timeout)
  }

  try {
    // Prepare request options
    const options = {
      method,
      headers,
      signal,
    }

    // Add body if needed
    if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = typeof data === "string" ? data : JSON.stringify(data)
    }

    // Make request
    const response = await fetch(fullUrl, options)

    // Parse response based on content type
    let responseData
    if (responseType === "json") {
      responseData = await response.json().catch(() => null)
    } else if (responseType === "text") {
      responseData = await response.text()
    } else if (responseType === "blob") {
      responseData = await response.blob()
    } else if (responseType === "arraybuffer") {
      responseData = await response.arrayBuffer()
    }

    // Check if response is ok
    if (!response.ok) {
      throw createHttpError(response, responseData)
    }

    // Return response object
    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      config,
    }
  } catch (error) {
    if (error.name === "HttpError") {
      throw error
    }
    throw handleFetchError(error)
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}
