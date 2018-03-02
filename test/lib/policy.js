'use strict';

class BasePolicy {
  constructor(user, model) {
    this.user = user;
    this.model = model;
  }
}

let OddNumberPolicy = {
  scope: class extends BasePolicy {
    resolve() {
      let odds = [];
      for (let i = 0; i < this.model.length; i++) {
        if (this.model[i] % 2 === 1) {
          odds.push(this.model[i]);
        }
      }

      return new Promise(resolve => resolve(odds));
    }
  }
};

let ThrowPolicy = {
    scope: class extends BasePolicy{
      resolve() {
        throw new Error('This method should not be called');
      }
    }
}

let SimplePolicy = {
  scope: class extends BasePolicy {
    resolve() {
      return new Promise(resolve => resolve(this.model));
    }
  }
};


module.exports = {
  getOddNumberPolicy: () => OddNumberPolicy,
  getThrowPolicy: () => ThrowPolicy,
  getSimplePolicy: () => SimplePolicy
}
