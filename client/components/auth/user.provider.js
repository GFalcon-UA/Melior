(function () {
  'use strict';

  angular
    .module('auth')
    .factory('$userProvider', function () {

      var setUser = function (u) {
        if (u.bAuthenticated) {
          this.user = {
            sLogin: u.login
          };
        } else {
          this.user = {};
        }
      };

      var getUser = function () {
        return this.user;
      };

      return {
        getUser: getUser,
        setUser: setUser
      }
    });
})();