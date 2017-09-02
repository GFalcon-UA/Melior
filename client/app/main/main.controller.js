(function () {
  'use strict';

  angular.module('Melior')
    .controller('MainController', ['auth', function (auth) {

      var vm = this;

      vm.oUser = {};
      vm.oEdited = {};
      vm.aList = [];
      vm.logout = auth.clear;
      vm.init = init;
      vm.save = save;
      vm.setFilter = setFilter;

      init();

      function init() {
        vm.oEdited = {
          sFirstName: '',
          sLastName: '',
          sPosition: ''
        }
      }

      function save(oItem) {

      }

      function setFilter(oItem) {

      }

    }])

})();