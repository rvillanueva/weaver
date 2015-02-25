'use strict';

angular.module('ariadneApp')
  .controller('EntitiesCtrl', function ($scope, apiFactory) {
    $scope.entityFilter = "PERSON"

    apiFactory.get().then(function(data) {
      $scope.db = data
      $scope.entities = $scope.db.entities;
      $scope.relations = $scope.db.relations;
      console.log(data)
    });

  });
