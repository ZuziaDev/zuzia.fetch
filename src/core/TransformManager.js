export class TransformManager {
  constructor() {
    this.defaultTransforms = {
      request: [(data) => {
        if (data instanceof FormData) return data;
        return JSON.stringify(data);
      }],
      response: [(data, headers) => {
        const contentType = headers['content-type'];
        if (contentType?.includes('application/json')) {
          return JSON.parse(data);
        }
        return data;
      }]
    };
  }

  transform(data, headers, config, type) {
    const transforms = [
      ...this.defaultTransforms[type],
      ...(config.transformRequest || []),
      ...(config.transformResponse || [])
    ];

    return transforms.reduce((acc, transform) => {
      return transform(acc, headers, config);
    }, data);
  }
} 