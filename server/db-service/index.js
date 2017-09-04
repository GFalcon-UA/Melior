(function () {
  'use strict';

  var async = require('async');
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
    newContact.sCreateDate = new Date();

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

  module.exports.getBy = function(req, res) {
    var pattern = new RegExp(req.params.text);
    var allArray = [];
    var result = [];

    db.collection(OBJECTS_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get object.");
      } else {
        var aFilteredFirstName = docs.filter(function (item) {
          return item.sFirstName.match(pattern);
        });
        var aFilteredLastName = docs.filter(function (item) {
          return item.sLastName.match(pattern);
        });
        var aFilteredPosition = docs.filter(function (item) {
          return item.sPosition.match(pattern);
        });

        result = aFilteredFirstName;
        aFilteredLastName.forEach(function (item) {
          if(result.indexOf(item) < 0){
            result.push(item);
          }
        });
        aFilteredPosition.forEach(function (item) {
          if(result.indexOf(item) < 0){
            result.push(item);
          }
        });


        res.status(200).json(result);
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

  module.exports.deleteMany = function(req, res) {
    var aIdsForDelete = [];
    var existingArray;
    try {
      existingArray = JSON.parse(req.query.lds);
    } catch (e) {
      existingArray.array = [];
    }
    existingArray.array.forEach(function (item) {
      aIdsForDelete.push({_id: new ObjectID(item)})
    });

    var aDeleteResults = [];
    function deleteOne(oItem, callback) {
      db.collection(OBJECTS_COLLECTION).deleteOne(oItem, function(err, result) {
        if (err) {
          handleError(res, err.message, "Failed to delete object");
        } else {
          aDeleteResults.push({
            oItem: oItem,
            oResult: result
          });
        }
        callback();
      });
    }

    async.forEach(aIdsForDelete, function (oItem, callback) {
      deleteOne(oItem, callback);
    }, function (err) {
      if (err) {
        handleError(res, err.message, "Failed to delete list of objects");
      } else {
        res.status(200).send(aDeleteResults);
      }
    });
  };

})();