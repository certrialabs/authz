'use strict';

let assert = require('assert');
let resHelpers = require('../lib/res');
let middlewareHelpers = require('../lib/middleware');
let userHelpers = require('../lib/user');
let modelHelpers = require('../lib/model');
let policyHelpers = require('../lib/policy');
let authz = require('../../index');

describe('Verify Authorized', function() {
  it('should set authorized to false', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(!resHelpers.getCurrentRes()['authz']['authorized'])
    });
  });

  it('should set scoped to false', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(!resHelpers.getCurrentRes()['authz']['scoped']);
    });
  });

  it('should set authzVerificationRequired to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['authzVerificationRequired']);
    });
  });

  it('should set proxied to true', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['proxied']);
    });
  });

  it('should not allow method call before authorization', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
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

  it('should allow method call after authorization', function() {
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized()(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'allowed', policyHelpers.getSimplePolicy())
    })
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(true);
    })
    .catch((err) => assert(false));
  });
  it('should allow method call excluding authorization', function() {
    let options = {
      excluded : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(true);
    })
    .catch((err) => assert(false));
  });
  it('should not allow method call if method not exclude authorization', function() {
    let options = {
      excluded : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().bar();
      assert(false);
    })
    .catch((err) => assert(true));
  });
  it('should not allow included method call without authorization', function() {
    let options = {
      included : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(false);
    })
    .catch((err) => assert(true));
  });
  it('should allow only included method call with authorization', function() {
    let options = {
      included : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'allowed', policyHelpers.getSimplePolicy())
    })
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(false);
    })
    .catch((err) => assert(true));
  });

  it('should allow only included method call without authorization', function() {
    let options = {
      included : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyAuthorized(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().bar();
      assert(true);
    })
    .catch((err) => assert(false));
  });
});
