'use strict';

angular.module('ariadneApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope) {
    $scope.menu = [{
      'title': 'Sources',
      'link': '/sources'
    }]
    $scope.menuAll = [{
      'title': 'Sources',
      'link': '/sources'
    },
    {
      'title': 'Map',
      'link': '/map'
    },
    {
      'title': 'Timeline',
      'link': '/timeline'
    },
    {
      'title': 'Graph',
      'link': '/graph'
    },
    {
      'title': 'Entities',
      'link': '/entities'
    }];

    if($rootScope.analyzed == true){
      $scope.menu = $scope.menuAll;
    }

    $rootScope.$on('analyzed', function(){
      $scope.menu = $scope.menuAll;
    })

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
