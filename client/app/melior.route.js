/**
 * @author Oleksii Khalikov
 * @version 1.0.0
 */
(function () {
  'use strict';

  angular.module('Melior')
    .config(['$routeProvider', '$httpProvider', '$locationProvider',
      function ($routeProvider, $httpProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'vm'
        }).when('/login', {
          templateUrl: 'app/login/login.html',
          controller: 'LoginController',
          controllerAs: 'vm'
        }).otherwise('/');

      }]);

})();