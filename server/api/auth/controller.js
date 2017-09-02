(function () {
  'use strict';

  var NodeCache = require("node-cache");
  var cache = new NodeCache();

  var config = require('../../../config.json') || {};

  module.exports.enter = function (req, res) {
    var accounts = [];
    if(config.hasOwnProperty('env') && config.env.hasOwnProperty('accounts')){
      accounts = config.env['accounts'];
    }

    var authorization = req.headers['authorization'] || '';

    var userForAuth;
    try{
      userForAuth = (new Buffer(authorization.substr('Basic '.length), 'base64').toString('utf8')).split(':');
    } catch (e) {
      console.error('Fail parse authorization: ' + e);
    }

    if(userForAuth.length === 2){
      var availableAccount = accounts.filter(function (registerdUser) {
        return registerdUser.login === userForAuth[0];
      });
      if(availableAccount.length === 0){
        res.status(401).send({error:{login: false, password: false}, message: 'Incorrect login'});
      } else if (userForAuth[1] === availableAccount[0].password) {
        cache.set('MeliorUser', authorization, 60*60*1000);
        res.status(200).send({login: availableAccount[0].login});
      } else {
        res.status(401).send({error:{login: true, password: false}, message: 'Incorrect password'});
      }
    } else {
      res.send({});
    }
  };

  module.exports.exit = function (req, res) {
    cache.del('MeliorUser');
    res.send({});
  };

  module.exports.getCashedUser = function (req, res) {
    var result = {};
    var cashedUser = cache.get('MeliorUser');
    if(cashedUser){
      result = {
        login: (new Buffer(cashedUser.substr('Basic '.length), 'base64').toString('utf8')).split(':')[0],
        authorization: cashedUser
      }
    }
    res.send(result);
  }

})();