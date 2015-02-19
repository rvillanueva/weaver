'use strict';

angular.module('ariadneApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Graph',
      'link': '/graph'
    },
    {
      'title': 'Entities',
      'link': '/entities'
    },
    {
      'title': 'Map',
      'link': '/map'
    },
    {
      'title': 'Timeline',
      'link': '/timeline'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
