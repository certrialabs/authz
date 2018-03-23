'use strict';

let assert = require('assert');
let authz = require('../../index');
let policyHelpers = require('../lib/policy');
let modelHelpers = require('../lib/model');
let resHelpers = require('../lib/res');
let userHelpers = require('../lib/user');

describe('Scope', function() {
  it('should set scoped flag to true', function() {
    return authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), null, policyHelpers.getSimplePolicy())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['scoped']);
    })
  });
  it('should not require policy in case of full scope', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then((success) => authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), null, null))
    .then(() => assert(true));
  });
  it('should not call policy if full scope', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then((success) => authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), null, policyHelpers.getThrowPolicy()))
    .then(() => assert(true));
  });
  it('should not touch model if full scope granded', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then((success) => authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getConstObject(), policyHelpers.getSimplePolicy()))
    .then((scoped) => assert(scoped === modelHelpers.getConstObject()));
  });
  it('should resolve new object according to policy', function() {
    return authz.helpers.scope(resHelpers.getCurrentRes(), userHelpers.getSimpleUser(), modelHelpers.getNumberedArrayObject(10), policyHelpers.getOddNumberPolicy())
    .then((scoped) => {
      let even = [];
      for (let i = 0; i < scoped; i++) {
        if (scoped[i] % 2 === 0) {
          even.push(scoped[i]);
        }
      }

      return assert(even.length === 0);
    })
  });
});
