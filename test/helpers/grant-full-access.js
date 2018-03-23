'use strict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var authz = require('../../index');

describe('Grant Full Access', function() {
  it('should succeed', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then((success) => {
      return assert(success);
    });
  });

  it('should set fullaccess to true', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['fullaccess']);
    });
  });

  it('should set fullscope to true', function() {
    return authz.helpers.grantFullAccess(resHelpers.getCurrentRes())
    .then(() => {
      return assert(resHelpers.getCurrentRes()['authz']['fullscope']);
    });
  });
});
