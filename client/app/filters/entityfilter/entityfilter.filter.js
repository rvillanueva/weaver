'use strict';

angular.module('ariadneApp')
  .filter('entityFilter', function () {

    return function (entities, type) {
      var filtered = []
      angular.forEach(entities, function(entity, key){
        console.log(entity.$.type)
        if (entity.$.type == type){
          filtered.push(entity);
        }
      })
      return filtered;
    };
  });
