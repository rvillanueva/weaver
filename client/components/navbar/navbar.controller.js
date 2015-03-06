'use strict';

angular.module('ariadneApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope) {
    $scope.menu = [{
      'title': 'Sources',
      'link': '/'
    }]
    $scope.menuAll = [{
      'title': 'Sources',
      'link': '/'
    },
    {
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

    if($rootScope.analyzed == true){
      $scope.menu = $scope.menuAll;
    }

    $rootScope.$on('analyzed', function(){
      $scope.menuAll = $scope.menuExpanded;
    })

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
