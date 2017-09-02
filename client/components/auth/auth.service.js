
/**
 * @author Oleksii Khalikov
 * @version 1.0.0
 */
(function () {
  'use strict';

  angular.module('auth')
    .service('AuthService', ['$http', function ($http) {

      this.login = function (headers) {
        return $http.get('/auth', {
          headers: headers
        }).then(function (resp) {
          return resp;
        }, function (err) {
          return err;
        });
      };

      this.logout = function (logoutUrl) {
        return $http.get(logoutUrl).then(function (resp) {
          return resp;
        }, function (err) {
          return err;
        });
      };

      this.getLastAuthorizedUser = function () {
        return $http.get('/auth/getUser')
      }

    }]);

})();