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

describe("Middlewares", function() {
  beforeEach(function() {
    resHelpers.prepareCurrentRes();
  });

  require('./middlewares/grant-full-access');
  require('./middlewares/verify-scoped');
  require('./middlewares/verify-authorized');
  require('./middlewares/skip-scoping');
  require('./middlewares/skip-authorization');

});
