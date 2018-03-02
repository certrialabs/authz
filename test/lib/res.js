'use strict';

let currentRes;
let getEmptyResObject = () => {
  return {};
};

module.exports = {
  prepareCurrentRes: () => {
    currentRes = getEmptyResObject();
  },
  getCurrentRes: () => {
    return currentRes;
  }
}
