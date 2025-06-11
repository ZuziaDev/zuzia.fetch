export class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  async execute(context, next) {
    let index = 0;
    
    const run = async (i) => {
      if (i === this.middlewares.length) return next();
      
      const middleware = this.middlewares[i];
      return middleware(context, () => run(i + 1));
    };

    return run(0);
  }
} 