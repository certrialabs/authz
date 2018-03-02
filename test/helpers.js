'use strict';

let resHelpers = require('./lib/res');

describe("Helpers", function() {
  beforeEach(function() {
    resHelpers.prepareCurrentRes();
  });

  require('./helpers/grant-full-access');
  require('./helpers/skip-scoping');
  require('./helpers/skip-authorization');
  require('./helpers/scope');
  require('./helpers/authorized');
});
