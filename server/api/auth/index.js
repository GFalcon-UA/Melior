(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./controller');

  router.get('/', controller.enter);
  router.get('/exit', controller.exit);
  router.get('/getUser', controller.getCashedUser);

  module.exports = router;
})();