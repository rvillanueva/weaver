'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http, d3Factory) {

    var graphData = [];

    $scope.getRelation = function(){
      var postData = {
          sid: 'ie-en-news',
          rt: 'xml',
          txt: $scope.documentText
      }
      $http.post('/api/watson', postData).success(function(data) {
        console.log(data)
        $scope.watsonResponses = data;
        $scope.entities = $scope.watsonResponses.rep.doc[0].entities[0].entity;
        $scope.links = $scope.watsonResponses.rep.doc[0].relations[0].relation;
        console.log($scope.entities)
        graphData = {
          nodes: [],
          links: []
        };
        var entityKey = {};
        var entityInt = 0;
        angular.forEach($scope.entities, function(entity, key){
          var pushed = {
            name: entity.mentref[0]._,
            group: entity.$.type
          }
          entityKey[entity.$.eid] = entityInt;
          entityInt += 1;
          graphData['nodes'].push(pushed);
        });
        angular.forEach($scope.links, function(link, key){
          var pushed = {
            source: entityKey[link.rel_entity_arg[0].$.eid],
            target: entityKey[link.rel_entity_arg[1].$.eid],
            value: link.relmentions[0].relmention[0].$.score
          }
          console.log(pushed)
          graphData['links'].push(pushed);
        })

          console.log('graphData')
          console.log(graphData)

      });
    };
    $scope.drawForce = function(){
      d3Factory.drawForce(graphData);
    }
  });
