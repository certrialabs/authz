'use strict';

let assert = require('assert');
let authz = require('../../index');
let policyHelpers = require('../lib/policy');
let modelHelpers = require('../lib/model');
let resHelpers = require('../lib/res');
let userHelpers = require('../lib/user');

describe('Authorized', function() {
  it('should set authorized flag to true', function() {
    return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), null, 'allowed', policyHelpers.getSimplePolicy())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['authorized']);
    })
  });

  it('should not touch policy in case of fullAccess', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then(() => authz.helpers.authorized(resHelpers.getCurrentRes()))
    .then(() => assert(true));
  });

  it('should resolve with model', function() {
    return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'allowed', policyHelpers.getSimplePolicy())
    .then((result) => assert(result === modelHelpers.getConstObject()))
  });

  it('should reject with false in case of restricted action', function() {
    return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'denied', policyHelpers.getSimplePolicy())
    .then(() => assert(false))
    .catch((err) => assert(err === false));
  });

  it('should reject with false in case of policy exception', function() {
    return authz.helpers.authorized(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), 'throw', policyHelpers.getSimplePolicy())
    .then(() => assert(false))
    .catch((err) => assert(err === false));
  });
});
