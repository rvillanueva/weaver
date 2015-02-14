'use strict';

angular.module('ariadneApp')
  .factory('d3Factory', function ($q) {

    var svg;
    var node;
    var activeColor = "#E8871E";
    var passiveColor = "#A0ACAD"
    var highlightColor = "#3B3B58"
    var width = 800,
        height = 600

    var parseData = function(entities, links, search){

      var graphData = {
        nodes: [],
        links: []
      };
      var entityKey = {};
      var entityInt = 0;
      var searchedEntityKey;

      // If the search term matches the entity, push entity
      // If search term matches an entity that's linked to this entity, push entity
      // If link includes an entity that matches the search term, push link
      angular.forEach(entities, function(entity, key){
        // If no search terms, for each entity check to see if there is an associated link.
        // If so, push entity to graph
          var linkCheck = false;
          var searchCheck = false;
          console.log('search: ' + search)
          angular.forEach(links, function(link, key){
            // If search term is present and entity id is equal to either entity id of the link, toggle link check to true
            if (entity.$.eid == link.rel_entity_arg[0].$.eid || entity.$.eid == link.rel_entity_arg[1].$.eid){
                linkCheck = true;
            }
          })

          if (search == entity.$.eid){

          }

          // If link check is true, push entity
          if (linkCheck == true){
            var pushed = {
              name: entity.mentref[0]._,
              group: entity.$.type
            }
            // Add entry to indicate the graph index associated with the entity eid
            entityKey[entity.$.eid] = entityInt;
            entityInt += 1;
            graphData['nodes'].push(pushed);
          }
        });
      angular.forEach(links, function(link, key){
        // If
        if (typeof entityKey[link.rel_entity_arg[0].$.eid] !== 'undefined' && typeof entityKey[link.rel_entity_arg[1].$.eid] !== 'undefined'){
          var pushed = {
            source: entityKey[link.rel_entity_arg[0].$.eid],
            target: entityKey[link.rel_entity_arg[1].$.eid],
            value: link.relmentions[0].relmention[0].$.score
          }
          graphData['links'].push(pushed);
        }
      })
      return graphData;
    }

    var setForce = function(entities, links, search){

      var graphData = parseData(entities, links, search);

        console.log('graphData')
        console.log(graphData)

        svg = d3.select("#canvas").append("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .gravity(.1)
            .distance(100)
            .charge(-200)
            .size([width, height]);

        force
            .nodes(graphData.nodes)
            .links(graphData.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graphData.links)
          .enter().append("line")
            .attr("class", "link");

        node = svg.selectAll(".node")
            .data(graphData.nodes)
          .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        link.style("stroke-width", 2)
            .style("fill", "#AAAAAA")
            .on("mouseover", function(d){
              var linkSelection = d3.select(this).style("stroke-width", 4)
              .on('mouseout', function(d) { linkSelection.style('stroke-width', 2); })
            })


        node.append("svg:circle")

        node.append("text")

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

    }
    var updateForce = function(type, search, index){
      node.selectAll("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .style("fill", "#AAAAAA")
        .on("mouseover", function(d){
          $("#details").html(d.group)
          var nodeSelection = d3.select(this).style("fill", activeColor)
          .on('mouseout', function(d) {
            if(d.group == type){
              nodeSelection.style("fill", highlightColor);
            } else {
              nodeSelection.style("fill", passiveColor);
            }
          })
        })
      node.selectAll("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) {
          var textSelection = d3.select(this).style("fill", passiveColor)
          return d.name;
        });
      var filteredNode = node.filter(function(d) {
        return d.group == type;
      })
      filteredNode.selectAll("circle")
        .transition()
        .attr("r",8)
        .style("fill", highlightColor)

      filteredNode.selectAll("text")
        .transition()
        .style("font-size","14px")
        .style("fill", highlightColor)
      console.log(filteredNode)
    }

    // Public API here
    return {
      setForce: function (entities, links, search) {
        setForce(entities, links, search)
      },
      updateForce: function(type, index){
        updateForce(type, index);
      }
    };
  });
