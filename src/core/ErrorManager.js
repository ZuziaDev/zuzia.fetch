export class ErrorManager {
  static createError(message, code, config, request, response) {
    const error = new Error(message);
    error.code = code;
    error.config = config;
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    return error;
  }

  static handleError(error, config) {
    if (error.response) {
      // Sunucu yanıtı ile gelen hata
      return this.createError(
        error.response.data?.message || 'Server Error',
        error.response.status,
        config,
        error.request,
        error.response
      );
    } else if (error.request) {
      // İstek yapıldı ama yanıt alınamadı
      return this.createError(
        'No Response Received',
        'ECONNABORTED',
        config,
        error.request
      );
    } else {
      // İstek yapılırken hata oluştu
      return this.createError(
        error.message,
        'ECONNREFUSED',
        config
      );
    }
  }
} 