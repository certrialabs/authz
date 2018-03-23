'use strict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var modelHelpers = require('../lib/model');
var authz = require('../../index');

describe('Skip Scoping', function() {
  it('should set skipScoping to true', function() {
    return authz.helpers.skipScoping(resHelpers.getCurrentRes())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['skipScoping']);
    });
  });

  it('should work without model', function() {
    return authz.helpers.skipScoping(resHelpers.getCurrentRes(), null)
    .then((model) => {
      return assert(!model);
    });
  });

  it('should not touch model', function() {
    return authz.helpers.skipScoping(resHelpers.getCurrentRes(), modelHelpers.getConstObject())
    .then((model) => {
      return assert(model === modelHelpers.getConstObject());
    });
  });
});
