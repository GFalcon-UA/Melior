(function () {
  'use strict';

  angular.module('Melior')
    .controller('MainController', ['auth', 'DataService', function (auth, DataService) {

      var vm = this;

      vm.oEmployee = {};
      vm.aList = [];
      vm.oSorting = {};
      vm.logout = auth.clear;
      vm.init = init;
      vm.save = save;
      vm.select = select;
      vm.sort = sort;
      vm.remove = remove;
      vm.setFilter = setFilter;
      vm.startWatcher = startWatcher;

      init();

      function init() {
        vm.oSorting = {
          sByField: '',
          bDescending: {
            sFirstName: true,
            sLastName: true,
            sPosition: true
          }
        };
        clearFilterData();
        DataService.findAll().then(function (res) {
          vm.aList = angular.copy(res);
        });
      }

      function save(oItem) {
        if(oItem.hasOwnProperty('_id')){
          DataService.updateItem(oItem).then(function (res) {
            var updatedItems = vm.aList.filter(function (el) {
              return el['_id'] === oItem['_id'];
            });
            var index = vm.aList.indexOf(updatedItems[0]);
            vm.aList[index] = angular.copy(res);
            clearFilterData();
          })
        } else {
          DataService.save(oItem).then(function (res) {
            vm.aList.push(res);
            clearFilterData()
          })
        }
      }

      function remove() {
        DataService.remove(vm.aList).then(function (res) {
          vm.aList = angular.copy(res);
        })
      }

      function select(oItem) {
        vm.oEmployee = angular.copy(oItem);
      }

      function setFilter(oItem) {

      }

      function sort(sByField) {
        vm.oSorting.sByField = sByField;
        vm.aList = angular.copy(DataService.sortedObjectsArrayByField(vm.aList, vm.oSorting));
      }

      function startWatcher(oItem) {
        if(!oItem.sFirstName && !oItem.sLastName && !oItem.sPosition){
          clearFilterData()
        }
      }

      function clearFilterData() {
        vm.oEmployee = {
          sFirstName: '',
          sLastName: '',
          sPosition: ''
        };
      }

    }])

})();