'use strict';

angular.module('ariadneApp')
  .controller('TimelineCtrl', function ($scope, $filter, apiFactory) {
    apiFactory.getEntities().then(function(data) {
      $scope.entities = data;
      $scope.dates = $filter('entityFilter')($scope.entities, 'DATE');
    });
  });
