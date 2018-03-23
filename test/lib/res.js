'use strict';

let currentRes;
let getEmptyResObject = () => {
  return new class {
    foo() {}
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
