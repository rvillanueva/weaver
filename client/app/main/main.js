'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/sources', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
