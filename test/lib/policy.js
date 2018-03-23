'use strict';

class BaseScopePolicy {
  constructor(user, model) {
    this.user = user;
    this.model = model;
  }
}


class BaseActionPolicy {
  constructor(user, records) {
    this.user = user;
    this.records = records;
  }
}

let OddNumberPolicy = {
  scope: class extends BaseScopePolicy {
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
    scope: class extends BaseScopePolicy{
      resolve() {
        throw new Error('This method should not be called');
      }
    }
}

let SimplePolicy = {
  scope: class extends BaseScopePolicy {
    resolve() {
      return new Promise(resolve => resolve(this.model));
    }
  },
  actions: class extends BaseActionPolicy {
    allowed() {
      return new Promise(resolve => resolve(true));
    }
    denied() {
      return new Promise(resolve => resolve(false));
    }
    throw() {
      throw new Error('Used for negative tests');
    }
  }
};


module.exports = {
  getOddNumberPolicy: () => OddNumberPolicy,
  getThrowPolicy: () => ThrowPolicy,
  getSimplePolicy: () => SimplePolicy
}
