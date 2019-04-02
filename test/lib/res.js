'use strict';

let currentRes;
let getEmptyResObject = () => {
  return new class {
    constructor() {
      this.prop = 5
    }
    foo() {}
    bar() {}
  };
};

module.exports = {
  prepareCurrentRes: () => {
    currentRes = getEmptyResObject();
  },
  getCurrentRes: () => {
    return currentRes;
  }
}
