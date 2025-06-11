export class ProgressManager {
  setupUploadProgress(config, requestConfig) {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded * 100) / event.total)
        };
        config.onUploadProgress(progress);
      }
    });
  }
} 