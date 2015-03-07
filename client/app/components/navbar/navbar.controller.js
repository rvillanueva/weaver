'use strict';

angular.module('ariadneApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Sources',
      'link': '/'
    }, {
      'title': 'Graph',
      'link': '/graph'
    },
    {
      'title': 'Timeline',
      'link': '/timeline'
    },
    {
      'title': 'Map',
      'link': '/map'
    },
    {
      'title': 'Entities',
      'link': '/entities'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
