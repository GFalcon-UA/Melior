
(function () {
  'use strict';

  angular.module('auth')
    .factory('auth', ['$rootScope', '$location', '$userProvider', 'AuthService',
      function ($rootScope, $location, $userProvider, AuthService) {

        var enter = function (sUrl) {
          if ($location.path() !== auth.sLoginPath) {
            auth.sPath = $location.path();
            if (!auth.bAuthenticated) {
              AuthService.getLastAuthorizedUser().then(function (resp) {
                if(resp.data && resp.data.login){
                  $userProvider.getUser(resp.data);
                  auth.bAuthenticated = true;
                  $location.path(sUrl);
                } else {
                  $location.path(auth.sLoginPath);
                }
              }, function (err) {
                $location.path(auth.sLoginPath);
              })

            } else {
              $location.path(sUrl);
            }
          }
        };

        var auth = {

          bAuthenticated: false,

          sLoginPath: '/login',
          sLogoutPath: '/logout',
          sHomePath: '/',
          sPath: $location.path(),

          authenticate: function (credentials, callback) {

            var headers = credentials && credentials.sLogin ? {
              authorization: "Basic "
              + btoa(credentials.sLogin + ":"
                + credentials.sPassword)
            } : {};

            AuthService.login(headers).then(function (response) {
              if (response.data && response.data.login) {
                $userProvider.setUser(response.data);
                auth.bAuthenticated = true;
              } else {
                auth.bAuthenticated = false;
              }
              callback && callback(auth.bAuthenticated);
              $location.path(auth.sPath === auth.sLoginPath ? auth.sHomePath : auth.sPath);
            }, function (err) {
              auth.bAuthenticated = false;
              callback && callback(false);
            });

          },

          clear: function () {
            $location.path(auth.sLoginPath);
            auth.bAuthenticated = false;
            AuthService.logout(auth.sLogoutPath).then(function () {
              $userProvider.setUser(null);
              console.log("Logout succeeded");
            }, function () {
              console.log("Logout failed");
            });
          },

          init: function (homePath, loginPath, logoutPath) {

            auth.sHomePath = homePath;
            auth.sLoginPath = loginPath;
            auth.sLogoutPath = logoutPath;

            auth.authenticate({}, function (authenticated) {
              if (authenticated) {
                $location.path(auth.sPath);
              }
            });

            angular.extend($rootScope, $userProvider, true);

            // Guard route changes and switch to login page if unauthenticated
            $rootScope.$on('$routeChangeStart', function (event, nextUrl, currUrl) {
              enter(nextUrl.$$route.originalPath);
            });

          }

        };

        return auth;



      }]);
})();