(function () {
  'use strict';

  angular.module('Melior').service('DataService', ['$http', function ($http) {

    this.save = function (oToSave) {
      $http.post('/api/save', oToSave).then(function (resp) {

      }, function (err) {

      })
    }
  }])
})();