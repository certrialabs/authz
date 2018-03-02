'use strict';

let assert = require('assert');
let resHelpers = require('../lib/res');
let nextHelpers = require('../lib/next');
let authz = require('../../index');

describe('Grant Full Access', function() {
  it('should call next without argument', function(done) {
    authz.middlewares.grantFullAccess()(null, resHelpers.getCurrentRes(), nextHelpers.assertCalled(done));
  });

  it('should never fails', function(done) {
    authz.middlewares.grantFullAccess()(null, resHelpers.getCurrentRes(), nextHelpers.assertNoError(done));
  });

  it('should set fullscope to true', function(done) {
    authz.middlewares.grantFullAccess()(null,
      resHelpers.getCurrentRes(),
      nextHelpers.assertNoError(done, () => assert(resHelpers.getCurrentRes()['authz']['fullscope']))
    );
  });

  it('should set fullaccess to true', function(done) {
    authz.middlewares.grantFullAccess()(null,
      resHelpers.getCurrentRes(),
      nextHelpers.assertNoError(done, () => assert(resHelpers.getCurrentRes()['authz']['fullaccess']))
    );
  });
});
