'use strict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var modelHelpers = require('../lib/model');
var authz = require('../../index');

describe('Skip Scoping', function() {
  var res;
  beforeEach(function() {
    res = resHelpers.getEmptyResObject();
  })

  it('should set skipScoping to true', function() {
    return authz.helpers.skipScoping(res)
    .then(() => {
      return assert(res['authz']['skipScoping']);
    });
  });

  it('should work without model', function() {
    return authz.helpers.skipScoping(res, null)
    .then((model) => {
      return assert(!model);
    });
  });

  it('should not touch model', function() {
    return authz.helpers.skipScoping(res, modelHelpers.getConstObject())
    .then((model) => {
      return assert(model === modelHelpers.getConstObject());
    });
  });
});
