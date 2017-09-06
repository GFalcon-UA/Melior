(function () {
  'use strict';

  angular.module('Melior').service('DataService', ['$http', '$q', function ($http, $q) {

    this.findAll = findAll;
    this.findByText = findByText;
    this.save = save;
    this.sortedObjectsArrayByField = sortedObjectsArrayByField;
    this.updateItem = updateItem;
    this.remove = remove;

    function save(obj){
      var def = $q.defer();
      $http.post('/api/save', obj).then(function (res) {
        def.resolve(res.data);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    }

    function findAll() {
      var def = $q.defer();
      $http.get('/api/find-all').then(function (res) {
        def.resolve(res.data);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    }

    function findByText(str){
      var def = $q.defer();
      $http.get('/api/find-by/' + str).then(function (res) {
        def.resolve(res.data);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    }

    function sortedObjectsArrayByField(array, config){
      var sFieldId = config['sByField'];
      var bAsc = config.bDescending[sFieldId];
      config.bDescending[sFieldId] = !config.bDescending[sFieldId];

      function compare(a, b) {
        if(a < b) return -1;
        if(a > b) return 1;
        return 0
      }

      return array.sort(function (first, second) {
        return bAsc ? compare(first[sFieldId], second[sFieldId]) : compare(second[sFieldId], first[sFieldId]);
      });
    }

    function updateItem(obj) {
      var def = $q.defer();
      $http.put('api/update/' + obj['_id'], obj).then(function (res) {
        def.resolve(res.data);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    }

    function remove(array) {
      var def = $q.defer();
      var aRemoveList = [];
      array.forEach(function (oItem) {
        aRemoveList.push(oItem._id);
      });
      var params = {
        lds: angular.toJson({
          array: aRemoveList
        })
      };
      if(aRemoveList.length > 0){
        $http.delete('/api/delete-by-list', {params: params}).then(function (res) {
          var aCleaned =  array.filter(function (oItem) {
            return !oItem.bRemove;
          });
          def.resolve(aCleaned)
        }, function (err) {
          def.reject(err);
        })
      } else {
        def.reject('Nothing to delete');
      }
      return def.promise;
    }

  }])
})();