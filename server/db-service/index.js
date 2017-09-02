(function () {
  'use strict';

  var mongodb = require("mongodb");
  var ObjectID = mongodb.ObjectID;
  var localConfig;
  var db;

  module.exports.connectToDB = function (app, startServer) {
    localConfig = app.get('localConfig');

    mongodb.MongoClient.connect(process.env.MONGODB_URI || localConfig.env.mongoUrl, function (err, database) {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      // Save database object from the callback for reuse.
      db = database;
      app.set('mongoDB', db);
      console.log("Database connection ready");

      startServer(app);
    });
  };

  module.exports.create = function () {

  };

  module.exports.read = function () {

  };

  module.exports.update = function () {

  };

  module.exports.delete = function () {

  };

  module.exports.findAll = function () {

  };

  module.exports.findBy = function () {

  }

})();