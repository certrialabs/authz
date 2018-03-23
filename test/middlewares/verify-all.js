'use strict';

let assert = require('assert');
let resHelpers = require('../lib/res');
let middlewareHelpers = require('../lib/middleware');
let userHelpers = require('../lib/user');
let modelHelpers = require('../lib/model');
let policyHelpers = require('../lib/policy');
let authz = require('../../index');

describe('Verify Both working', function() {
  it('should set both flags', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      let authorized = middlewareHelpers.getMiddleware();
      authz.middlewares.verifyAuthorized()(
        null,
        resHelpers.getCurrentRes(),
        authorized.getCb()
      );

      return authorized.getPromise();
    })
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['scopeVerificationRequired'])
    })
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['scopeVerificationRequired'])
    });
  });

  it('should not allow method call before authorization', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      let authorized = middlewareHelpers.getMiddleware();
      authz.middlewares.verifyAuthorized()(
        null,
        resHelpers.getCurrentRes(),
        authorized.getCb()
      );

      return authorized.getPromise();
    })
    .then(() => {
      return authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), policyHelpers.getSimplePolicy());
    })
    .then(() => {
      try {
        resHelpers.getCurrentRes().foo();
        assert(false);
      } catch(err) {
        assert(true);
      }
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
      let authorized = middlewareHelpers.getMiddleware();
      authz.middlewares.verifyAuthorized()(
        null,
        resHelpers.getCurrentRes(),
        authorized.getCb()
      );

      return authorized.getPromise();
    })
    .then(() => {
      return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'allowed', policyHelpers.getSimplePolicy())
    })
    .then(() => {
      try {
        resHelpers.getCurrentRes().foo();
        assert(false);
      } catch(err) {
        assert(true);
      }
    });
  });

  it('should allow method call after scoping and authorization', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), policyHelpers.getSimplePolicy());
    })
    .then(() => {
      return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'allowed', policyHelpers.getSimplePolicy());
    })
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(true);
    })
    .catch((err) => assert(false));;
  });
});
