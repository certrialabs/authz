'use strict';

let currentRes;
let getEmptyResObject = () => {
  return new class {
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
