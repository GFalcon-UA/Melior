(function () {
  'use strict';

  angular.module('Melior')
    .controller('LoginController', ['auth', function (auth) {

      var vm = this;

      vm.oUser = {};
      vm.bLoginError = false;
      vm.login = login;

      function login() {
        auth.authenticate(vm.oUser, function (authenticated) {
          if (authenticated) {
            console.log("Login succeeded");
            vm.bLoginError = false;
          } else {
            console.log("Login failed");
            vm.bLoginError = true;
          }
        })
      }

  }])

})();