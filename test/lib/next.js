'use strict';

let assert = require('assert');

module.exports = {
  assertNoError: (done, assertions) => {
    return (err) => {
      let errors;
      try {
        assert(!err);
        if(assertions) {
          assertions();
        }
      } catch(err) {
        errors = err;
      }

      done(errors);
    }
  },

  assertWithError: (done, assertions) => {
    return (err) => {
      let errors;
      try {
        assert(err);
        if(assertions) {
          assertions();
        }
      } catch(err) {
        errors = err;
      }

      done(errors);
    }
  },

  assertCalled: (done, assertions) => {
    return () => {
      let errors;
      try {
        assert(true);
        if(assertions) {
          assertions();
        }
      } catch(err) {
        errors = err;
      }

      done(errors);
    };
  }
}
