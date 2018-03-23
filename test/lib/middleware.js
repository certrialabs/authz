'use strict';

class Middleware {
    constructor() {
      let resolveFunction;
      this.promise = new Promise(resolve => resolveFunction = resolve);
      this.resolveFunction = resolveFunction;
    }

    getPromise() {
      return this.promise;
    }

    getCb() {
      return this.resolveFunction;
    }
}

module.exports = {
  getMiddleware: () => {
    return new Middleware();
  }
};
