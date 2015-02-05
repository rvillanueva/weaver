'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http, d3Factory) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    var graphData = [];

    $scope.testRelationship = function(){
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
        angular.forEach($scope.links, function(link, key){
          var sourceLong = link.rel_entity_arg[0].$.eid
          var targetLong = link.rel_entity_arg[1].$.eid
          var pushed = {
            source: parseInt(sourceLong.substring(2)),
            target: parseInt(targetLong.substring(2)),
            value: link.relmentions[0].relmention[0].$.score
          }
          console.log(pushed)
          graphData['links'].push(pushed);
        })
        angular.forEach($scope.entities, function(entity, key){
          var pushed = {
            name: entity.mentref[0]._,
            group: entity.$.type
          }
          graphData['nodes'].push(pushed);
        });

          console.log('graphData')
          console.log(graphData)

      });
    };
    $scope.drawForce = function(){
      console.log('drawing')
      var width = 960,
          height = 500

      var svg = d3.select("#canvas").append("svg")
          .attr("width", width)
          .attr("height", height);

      var force = d3.layout.force()
          .gravity(.05)
          .distance(100)
          .charge(-100)
          .size([width, height]);

      force
          .nodes(graphData.nodes)
          .links(graphData.links)
          .start();

      var link = svg.selectAll(".link")
          .data(graphData.links)
        .enter().append("line")
          .attr("class", "link");

      var node = svg.selectAll(".node")
          .data(graphData.nodes)
        .enter().append("g")
          .attr("class", "node")
          .call(force.drag);

      node.append("image")
          .attr("xlink:href", "https://github.com/favicon.ico")
          .attr("x", -8)
          .attr("y", -8)
          .attr("width", 16)
          .attr("height", 16);

      node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text(function(d) { return d.name });

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });

    }
  });
