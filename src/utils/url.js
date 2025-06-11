export function buildURL(config) {
  const { baseURL, url, params } = config;
  const fullURL = baseURL ? `${baseURL}${url}` : url;
  
  if (!params) return fullURL;

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${fullURL}${fullURL.includes('?') ? '&' : '?'}${queryString}`;
} 