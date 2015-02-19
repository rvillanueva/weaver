'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/entities', {
        templateUrl: 'app/entities/entities.html',
        controller: 'EntitiesCtrl'
      });
  });
