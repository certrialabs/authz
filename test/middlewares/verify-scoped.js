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
    })
    .catch((err) => assert(false));;
  });
  it('should be able to include custom function scoping', function() {
    let options = {
      included : ['bar']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().bar();
      assert(false);
    })
    .catch((err) => assert(true));;
  });
  it('should be able to execute not included functions', function() {
    let options = {
      included : ['bar']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().foo();
      assert(true);
    })
    .catch((err) => assert(false));;
  });
  it('should be able to exclude custom function scoping', function() {
    let options = {
      excluded : ['bar']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped(options)(
      null,
      resHelpers.getCurrentRes(),
      middleware.getCb()
    );

    return middleware.getPromise()
    .then(() => {
      resHelpers.getCurrentRes().bar();
      assert(true);
    })
    .catch((err) => assert(false));;
  });
  it('should not be able to execute all but excluded functions', function() {
    let options = {
      excluded : ['bar']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped(options)(
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
  it('should not be able to set both included and excluded', function() {
    let options = {
      included : ['foo'],
      excluded : ['foo']
    }
    let middleware = middlewareHelpers.getMiddleware();
    authz.middlewares.verifyScoped(options)(
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
});
