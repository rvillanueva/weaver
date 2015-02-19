'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/timeline', {
        templateUrl: 'app/timeline/timeline.html',
        controller: 'TimelineCtrl'
      });
  });
