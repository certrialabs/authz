'use strict';

class Middleware {
    constructor() {
      let resolveFunction;
      let rejectFunction;
      this.promise = new Promise((resolve, reject) => {
        resolveFunction = resolve;
        rejectFunction = reject;
      });
      this.resolveFunction = resolveFunction;
      this.rejectFunction = rejectFunction;
    }

    getPromise() {
      return this.promise;
    }

    getCb() {
      return (err) => {
        if (err) {
          return this.rejectFunction(err);
        } else {
          this.resolveFunction(err);
        }
      }
    }
}

module.exports = {
  getMiddleware: () => {
    return new Middleware();
  }
};
