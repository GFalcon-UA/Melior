(function () {
  'use strict';

  var express = require('express');

  var employeesDAO = require('./../../db-service');
  var router = express.Router();

  router.get('/find-all', employeesDAO.getAll);
  router.get('/find-by-id/:id', employeesDAO.getById);
  router.post('/save', employeesDAO.createNew);
  router.put('/update/:id', employeesDAO.updateById);
  router.delete('/delete-by-id/:id', employeesDAO.deleteById);
  router.delete('/delete-by-list', employeesDAO.deleteMany);

  module.exports = router;
})();