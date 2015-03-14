'use strict';

angular.module('ariadneApp')
  .filter('entityFilter', function () {

    return function (entities, type, level, strict) {
      var filtered = []
      angular.forEach(entities, function(entity, key){
        if(type == "EVENTS"){
          if(
            entity.$.type.indexOf('EVENT') >= 0
          ){
            filtered.push(entity);
          }
        } else if (entity.$.type == type && (entity.$.level == level || !level)){
          filtered.push(entity);
        }
      })
      return filtered;
    };
  });
