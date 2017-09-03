(function () {
  'use strict';

  angular.module('Melior').service('DataService', ['$http', function ($http) {

    this.findAll = findAll;
    this.save = save;
    this.remove = remove;

    function save(obj){
      return $http.post('/api/save', obj).then(function (res) {
        return res.data;
      })
    }

    function findAll() {
      return $http.get('/api/find-all').then(function (res) {
        return res.data;
      });
    }

    function remove(aArray) {
      var aRemoveList = [];
      aArray.filter(function (oItem) {
        return oItem.bRemove;
      }).forEach(function (oItem) {
        aRemoveList.push(oItem._id);
      });
      var params = {
        lds: angular.toJson({
          array: aRemoveList
        })
      };
      if(aRemoveList.length > 0){
        return $http.delete('/api/delete-by-list', {params: params}).then(function (res) {
          return aArray.filter(function (oItem) {
            return !oItem.bRemove;
          })
        })
      }

    }

  }])
})();