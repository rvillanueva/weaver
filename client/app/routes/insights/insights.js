'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/insights', {
        templateUrl: 'app/routes/insights/insights.html',
        controller: 'InsightsCtrl'
      });
  });
