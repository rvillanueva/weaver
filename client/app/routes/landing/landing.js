'use strict';

angular.module('ariadneApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/routes/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });
