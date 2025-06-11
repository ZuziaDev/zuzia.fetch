export function transformRequest(data) {
  if (!data) return undefined;
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
}

export async function transformResponse(response, contentType, config) {
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  if (contentType?.includes('text/')) {
    return await response.text();
  }
  return await response.blob();
} 