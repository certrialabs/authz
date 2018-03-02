'use strict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var modelHelpers = require('../lib/model');
var authz = require('../../index');

describe('Skip Authorization', function() {
  var res;
  beforeEach(function() {
    res = resHelpers.getEmptyResObject();
  })

  it('should set skipAuthorization to true', function() {
    return authz.helpers.skipAuthorization(res)
    .then(() => {
      return assert(res['authz']['skipAuthorization']);
    });
  });

  it('should work without model', function() {
    return authz.helpers.skipAuthorization(res, null)
    .then((model) => {
      return assert(!model);
    });
  });

  it('should not touch model', function() {
    return authz.helpers.skipAuthorization(res, modelHelpers.getConstObject())
    .then((model) => {
      return assert(model === modelHelpers.getConstObject());
    });
  });
});
