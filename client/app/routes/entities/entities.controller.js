'use strict';

angular.module('ariadneApp')
  .controller('EntitiesCtrl', function ($scope, $filter, apiFactory, tutorialFactory) {
    tutorialFactory.demo('entities');
    $scope.entityFilter = "PERSON";
    $scope.namedFilter = 'NAM';
    $scope.entityArray = [];

    apiFactory.get().then(function(data) {
      $scope.db = data
      $scope.entities = $scope.db.entities;
      $scope.relations = $scope.db.relations;
      $scope.mentions = $scope.db.mentions;
      angular.forEach($scope.mentions, function(mention, mKey){
        apiFactory.getSnippet(mKey).then(function(data){
          mention.snippets = data;
        })
      })
      $scope.resort();
    });

    $scope.resort = function(){
      if(
        $scope.entityFilter == 'PERSON' ||
        $scope.entityFilter == 'FACILITY' ||
        $scope.entityFilter == 'GPE'
      ){
        $scope.namedFilter = 'NAM'
      } else {
        $scope.namedFilter = false;
      }
      var filtered = $filter('entityFilter')($scope.entities, $scope.entityFilter, $scope.namedFilter)
      $scope.entityArray = []
      angular.forEach(filtered, function(entity, eKey){
        $scope.entityArray.push(entity)
      })
    }

  });
