(function () {

  'use strict';

  var express = require('express')
    , bodyParser = require('body-parser')
    , path = require('path');

  var localConfig = require('../config.json')
    , dbService = require('./db-service');

  module.exports = function (app) {
    var rootPath = path.normalize(__dirname + '/..');

    app.use(express.static(path.join(rootPath, 'client')));
    app.set('appPath', path.join(rootPath, 'client'));
    app.set('localConfig', localConfig);
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());

    var startServer = function (app) {
      var server = app.listen(process.env.PORT || localConfig.env.port, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
      });
    };

    dbService.connectToDB(app, startServer);

  };

})();