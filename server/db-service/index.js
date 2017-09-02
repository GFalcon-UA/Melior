(function () {
  'use strict';

  var mongodb = require("mongodb");
  var handleError = require('./../error/errorHandler').handleError;
  var ObjectID = mongodb.ObjectID;
  var localConfig;
  var db;

  var OBJECTS_COLLECTION = "employees";

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

  module.exports.getAll = function(req, res) {
    db.collection(OBJECTS_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get object.");
      } else {
        res.status(200).json(docs);
      }
    });
  };

  module.exports.createNew = function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    db.collection(OBJECTS_COLLECTION).insertOne(newContact, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new object.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  };

  module.exports.getById = function(req, res) {
    db.collection(OBJECTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get object");
      } else {
        res.status(200).json(doc);
      }
    });
  };

  module.exports.updateById = function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(OBJECTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update object");
      } else {
        updateDoc._id = req.params.id;
        res.status(200).json(updateDoc);
      }
    });
  };

  module.exports.deleteById = function(req, res) {
    db.collection(OBJECTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete object");
      } else {
        res.status(200).json(req.params.id);
      }
    });
  };

})();