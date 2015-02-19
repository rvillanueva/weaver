'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/graph', {
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphCtrl'
      });
  });
