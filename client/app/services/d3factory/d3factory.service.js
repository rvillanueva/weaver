'use strict';

angular.module('ariadneApp')
  .factory('d3Factory', function ($q) {
    // Service logic

    var force = function(){

    }

    // Public API here
    return {
      force: function (data) {
        var deferred = $q.defer();

        var entities = data.rep.doc[0].entities[0].entity;
        var links = data.rep.doc[0].relations[0].relation;

        return graphData;
      }
    };
  });
