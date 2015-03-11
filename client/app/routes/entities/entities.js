'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/entities', {
        templateUrl: 'app/routes/entities/entities.html',
        controller: 'EntitiesCtrl'
      });
  });
