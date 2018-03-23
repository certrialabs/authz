'use strict';

let assert = require('assert');
let resHelpers = require('../lib/res');
let middlewareHelpers = require('../lib/middleware');
let authz = require('../../index');

describe('Grant Full Access', function() {
  it('should call next without argument', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.grantFullAccess()(null, resHelpers.getCurrentRes(), middleware.getCb());

    return middleware.getPromise().then((data) => assert(!data));
  });

  it('should never fails', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.grantFullAccess()(null, resHelpers.getCurrentRes(), middleware.getCb());

    return middleware.getPromise().then((data) => assert(!data)).catch(() => assert(false));
  });

  it('should set fullscope to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.grantFullAccess()(null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise().then(() => assert(resHelpers.getCurrentRes()['authz']['fullscope']));
  });

  it('should set fullaccess to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.grantFullAccess()(null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise().then(() => assert(resHelpers.getCurrentRes()['authz']['fullaccess']));
  });
});
