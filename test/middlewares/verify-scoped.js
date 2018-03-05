'use strict';

let assert = require('assert');
let resHelpers = require('../lib/res');
let middlewareHelpers = require('../lib/middleware');
let userHelpers = require('../lib/user');
let modelHelpers = require('../lib/model');
let policyHelpers = require('../lib/policy');
let authz = require('../../index');

describe('Verify Scoped', function() {
  it('should set scoped to false', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(!resHelpers.getCurrentRes()['authz']['scoped'])
    });
  });

  it('should set authorized to false', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(!resHelpers.getCurrentRes()['authz']['authorized']);
    });
  });

  it('should set scopeVerificationRequired to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['scopeVerificationRequired']);
    });
  });

  it('should set proxied to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['proxied']);
    });
  });

  it('should not allow method call before scoping', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      try {
        resHelpers.getCurrentRes().foo();
        assert(false);
      } catch(err) {
        assert(true);
      }
    });
  });

  it('should allow method call after scoping', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), policyHelpers.getSimplePolicy())
    })
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(true);
    });
  });
});
