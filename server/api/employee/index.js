(function () {
  'use strict';

  var express = require('express');
  var employeesDAO = require('./../../db-service');
  var router = express.Router();

  router.get('/', employeesDAO.getAll);
  router.get('/:id', employeesDAO.getById);
  router.post('/', employeesDAO.createNew);
  router.put('/:id', employeesDAO.updateById);
  router.delete('/:id', employeesDAO.deleteById);

  module.exports = router;
})();