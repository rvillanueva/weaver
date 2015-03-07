'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });
