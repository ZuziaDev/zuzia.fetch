export function handleError(error) {
  if (error.name === 'AbortError') {
    return {
      message: 'Request timeout',
      code: 'ECONNABORTED'
    };
  }
  return error;
} 