'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        templateUrl: 'app/routes/map/map.html',
        controller: 'MapCtrl'
      });
  });
