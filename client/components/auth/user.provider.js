(function () {
  'use strict';

  angular
    .module('auth')
    .factory('$userProvider', function () {

      var setUser = function (oUser) {
        if (oUser && oUser.bAuthenticated) {
          this.user = {
            sLogin: oUser.login
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