'use strict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var modelHelpers = require('../lib/model');
var authz = require('../../index');

describe('Skip Authorization', function() {
  it('should set skipAuthorization to true', function() {
    return authz.helpers.skipAuthorization(resHelpers.getCurrentRes())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['skipAuthorization']);
    });
  });

  it('should work without model', function() {
    return authz.helpers.skipAuthorization(resHelpers.getCurrentRes(), null)
    .then((model) => {
      return assert(!model);
    });
  });

  it('should not touch model', function() {
    return authz.helpers.skipAuthorization(resHelpers.getCurrentRes(), modelHelpers.getConstObject())
    .then((model) => {
      return assert(model === modelHelpers.getConstObject());
    });
  });
});
