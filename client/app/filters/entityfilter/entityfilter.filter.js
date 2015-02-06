'use strict';

angular.module('ariadneApp')
  .filter('entityFilter', function () {

    return function (entities, type) {
      var filtered = []
      angular.forEach(entities, function(entity, key){
        if(type == "EVENTS"){
          if(
            entity.$.type == "EVENT" ||
            entity.$.type == "EVENT_AWARD" ||
            entity.$.type == "EVENT_BUSINESS" ||
            entity.$.type == "EVENT_COMMUNICATION" ||
            entity.$.type == "EVENT_CRIME" ||
            entity.$.type == "EVENT_CUSTODY" ||
            entity.$.type == "EVENT_DEATH" ||
            entity.$.type == "EVENT_DEMONSTRATION" ||
            entity.$.type == "EVENT_DISASTER" ||
            entity.$.type == "EVENT_EDUCATION" ||
            entity.$.type == "EVENT_GATHERING" ||
            entity.$.type == "EVENT_LEGAL" ||
            entity.$.type == "EVENT_LEGISLATION" ||
            entity.$.type == "EVENT_MEETING" ||
            entity.$.type == "EVENT_PERFORMANCE" ||
            entity.$.type == "EVENT_PERSONNEL" ||
            entity.$.type == "EVENT_SPORTS" ||
            entity.$.type == "EVENT_VIOLENCE"
          ){
            filtered.push(entity);
          }
        } else if (entity.$.type == type){
          filtered.push(entity);
        }
      })
      return filtered;
    };
  });
