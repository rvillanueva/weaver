'use strict';

angular.module('ariadneApp')
  .factory('d3Factory', function ($q) {
    // Service logic

    var drawForce = function(graphData){
        console.log('drawing')
        var width = 960,
            height = 500

        var svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .gravity(.1)
            .distance(75)
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

    // Public API here
    return {
      drawForce: function (data) {
        drawForce(data)
      }
    };
  });
