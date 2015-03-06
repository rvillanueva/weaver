'use strict';

angular.module('ariadneApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngAria',
  'uiGmapgoogle-maps'
])


  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })


  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  })

  .run(function ($rootScope, $location) {
     $rootScope.$on('$routeChangeStart', function (event) {
       if (!$rootScope.analyzed) {
         console.log('No docs, redirecting to sources');
         $location.path('/');
       }
       else {
         console.log('ALLOW');
       }
     });
    })
