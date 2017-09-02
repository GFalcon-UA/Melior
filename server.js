(function () {
  'use strict';

  var express = require("express");
  var app = express();

  require('./server/express')(app);
  require('./server/routes')(app);

// Expose app
  module.exports = app;
})();