'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http, d3Factory, $filter) {

    var graphData = [];

    $scope.getRelation = function(){
      var postData = {
          sid: 'ie-en-news',
          rt: 'xml',
          txt: $scope.documentText
      }
      $http.post('/api/watson', postData).success(function(data) {
        console.log(data)
        $scope.relationships = data;
        $scope.entities = $scope.relationships.rep.doc[0].entities[0].entity;
        $scope.links = $scope.relationships.rep.doc[0].relations[0].relation;
        $scope.persons = $filter('entityFilter')($scope.entities, 'PERSON');
        $scope.organizations = $filter('entityFilter')($scope.entities, 'ORGANIZATION');
        console.log($scope.persons)
      });
    };
    $scope.drawForce = function(){
      d3Factory.drawForce($scope.entities, $scope.links);
    }

  });
