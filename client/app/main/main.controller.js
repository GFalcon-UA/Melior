(function () {
  'use strict';

  angular.module('Melior')
    .controller('MainController', ['auth', 'DataService', function (auth, DataService) {

      var vm = this;

      vm.oEmployee = {};
      vm.aList = [];
      vm.logout = auth.clear;
      vm.init = init;
      vm.save = save;
      vm.select = select;
      vm.remove = remove;
      vm.setFilter = setFilter;

      init();

      function init() {
        clearFilterData();
        DataService.findAll().then(function (res) {
          vm.aList = angular.copy(res);
        });
      }

      function save(oItem) {
        DataService.save(oItem).then(function (res) {
          vm.aList.push(res);
          clearFilterData()
        })
      }

      function remove() {
        DataService.remove(vm.aList).then(function (res) {
          vm.aList = angular.copy(res);
        })
      }

      function select(oItem) {
        vm.oEmployee = {
          sFirstName: oItem.sFirstName,
          sLastName: oItem.sLastName,
          sPosition: oItem.sPosition
        };
      }

      function setFilter(oItem) {

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