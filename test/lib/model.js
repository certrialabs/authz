'use strict';

const o = {
  A: 'B',
  B: 'C'
};

module.exports = {
  getRandomObject: () => {
    return {
      key: Math.random()
    };
  },
  getConstObject: () => {
    return o;
  }
}
