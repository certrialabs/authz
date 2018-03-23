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
  },
  getNumberedArrayObject: (size) => {
    let a = [];

    for (let i = 1; i < size; i++) {
      a.push(i);
    }

    return a;
  }
}
