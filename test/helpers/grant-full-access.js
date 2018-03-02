'use stict'

var assert = require('assert');
var resHelpers = require('../lib/res');
var authz = require('../../index');

describe('Grant Full Access', function() {
  var res;
  beforeEach(function() {
    res = resHelpers.getEmptyResObject();
  })

  it('should succeed', function() {
    return authz.helpers.grantFullAccess(res)
    .then((success) => {
      return assert(success);
    });
  });

  it('should set fullaccess to true', function() {
    return authz.helpers.grantFullAccess(res)
    .then(() => {
      return assert(res['authz']['fullaccess']);
    });
  });

  it('should set fullscope to true', function() {
    return authz.helpers.grantFullAccess(res)
    .then(() => {
      return assert(res['authz']['fullscope']);
    });
  });
});
