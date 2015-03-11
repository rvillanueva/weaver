'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/timeline', {
        templateUrl: 'app/routes/timeline/timeline.html',
        controller: 'TimelineCtrl'
      });
  });
