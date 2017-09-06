(function () {
  'use strict';

  angular.module('Melior')
    .controller('MainController', ['auth', 'DataService', '$rootScope', '$interval', function (auth, DataService, $rootScope, $interval) {

      var vm = this;

      var nFilterDelay = 500;

      vm.aList = [];
      vm.oEmployee = {};
      vm.oFilter = {
        sValue: '',
        sOldValue: ''
      };

      vm.oSorting = {
        sByField: '',
        bDescending: {
          sFirstName: true,
          sLastName: true,
          sPosition: true
        }
      };
      vm.logout = auth.clear;
      vm.bNothingSelected = false;
      vm.init = init;
      vm.save = save;
      vm.select = select;
      vm.sort = sort;
      vm.remove = remove;
      vm.startFilterListener = startFilterListener;
      vm.startWatcher = startWatcher;
      vm.selectToDelete = selectToDelete;

      init();

      function init() {
        clearFilterData();
        findAll();
        nFilterDelay = ($rootScope.oMeliorConfig &&
          $rootScope.oMeliorConfig.hasOwnProperty('filterDelay') &&
          nFilterDelay < $rootScope.oMeliorConfig['filterDelay']) ?
          $rootScope.oMeliorConfig['filterDelay'] : nFilterDelay;
      }

      function save(oItem) {
        if (oItem.hasOwnProperty('_id')) {
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

      function selectToDelete() {
        vm.bNothingSelected = false;
      }

      function remove() {
        var aListToDelete = vm.aList.filter(function(oItem){
          return oItem.bRemove;
        });
        if(aListToDelete.length > 0){
          vm.bNothingSelected = false;
          DataService.remove(aListToDelete).then(function (res) {
            vm.aList = angular.copy(res);
          })
        } else {
          vm.bNothingSelected = true;
        }
      }

      function select(oItem) {
        vm.oEmployee = angular.copy(oItem);
      }

      function sort(sByField) {
        vm.oSorting.sByField = sByField;
        vm.aList = angular.copy(DataService.sortedObjectsArrayByField(vm.aList, vm.oSorting));
      }

      function startWatcher(oItem) {
        if (!oItem.sFirstName && !oItem.sLastName && !oItem.sPosition) {
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

      var stopFilterListener;

      function startFilterListener() {

        if (angular.isDefined(stopFilterListener)) {
          stopListener();
          console.log('restart filter listener');
        } else {
          console.log('start filter listener');
        }

        vm.oFilter.sOldValue = vm.oFilter.sValue;
        stopFilterListener = $interval(function () {
          applyFilter();
        }, nFilterDelay);

      }

      function stopListener() {
        if (angular.isDefined(stopFilterListener)) {
          $interval.cancel(stopFilterListener);
          stopFilterListener = undefined;
        }
      }

      function applyFilter() {
        stopListener();

        if (vm.oFilter.sValue !== vm.oFilter.sOldValue) {
          startFilterListener();
          return;
        }

        console.log('stop filter listener');
        if (!vm.oFilter.sValue) {
          findAll();
        } else {
          findByText(vm.oFilter.sValue)
        }
      }

      function findAll() {
        DataService.findAll().then(function (res) {
          vm.aList = angular.copy(res);
        });
      }

      function findByText(str) {
        DataService.findByText(str).then(function (res) {
          vm.aList = angular.copy(res);
        })
      }

    }])

})();