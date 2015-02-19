'use strict';

angular.module('ariadneApp')
  .controller('EntitiesCtrl', function ($scope, apiFactory) {
    $scope.entityFilter = "PERSON"

    apiFactory.getEntities().then(function(data) {
      $scope.entities = data;
      console.log(data)
      console.log('entities got')
    });

  });
