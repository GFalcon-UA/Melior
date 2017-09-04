(function () {
  'use strict';

  angular.module('Melior', ['auth'])
    .run(['auth', '$http', '$rootScope', function (auth, $http, $rootScope) {
      // Initialize auth module with the home page and login/logout path
      // respectively
      auth.init('/', '/login', '/logout');

      $http.get('/get-client-config').then(function (res) {
        $rootScope.oMeliorConfig = res.data;
      })
    }]);
})();