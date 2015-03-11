'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sources', {
        templateUrl: 'app/routes/main/main.html',
        controller: 'MainCtrl'
      });
  });
