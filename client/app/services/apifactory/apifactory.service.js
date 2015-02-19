'use strict';

angular.module('ariadneApp')
  .factory('apiFactory', function ($q, $http) {
    // Service logic
    var db = {
      "events" : {
        "hash" : {
          "mentions" : [ {
            "mentref" : "-E48",
            "set" : "hash"
          } ],
          "name" : "War",
          "traits" : {
            "time" : "February 2002"
          }
        }
      },
      entities: {},
      relations: {},
      mentions:{},
      "persons" : {
        "hash" : {
          "mentions" : [ {
            "mentref" : "-E48",
            "set" : "hash"
          } ],
          "name" : "John Kerry"
        }
      },
      "sources" : {
        "hash" : {
          "active" : true,
          "analysis" : {
            "relationships" : "relationshipdata",
            "usermodel" : "usermodeldata"
          },
          "text" : "text here",
          "title" : "title here",
          "type" : "text"
        }
      }
    }





    // Public API here
    return {
      post: function (path, data) {
        db.push(data);
        return 'Success';
      },
      get: function (path) {

        return db;
      },
      getSources: function (path) {
        return db.sources;
      },
      addSource: function (postData) {
        var deferred = $q.defer();
        var header = {
            sid: 'ie-en-news',
            rt: 'xml',
            txt: postData,
        }
        $http.post('/api/watson/relationships', header).success(function(data) {
          console.log(data)
          var saved = {
            active: true,
            analysis: {
              relationships: data
            },
            text: data.rep.doc[0].text,
            //title: postData.title
          }
          var timestamp = Date.now()
          db.sources[timestamp] = saved;
          var entities = data.rep.doc[0].entities[0].entity;
          var relations = data.rep.doc[0].relations[0].relation;

          angular.forEach(entities, function(entity, key){
            db.entities[entity.$.eid] = entity
          })
          angular.forEach(relations, function(relation, key){
            db.relations[relation.$.rid] = relation;
          })
          //$scope.persons = $filter('entityFilter')($scope.entities, 'PERSON');
          //$scope.organizations = $filter('entityFilter')($scope.entities, 'ORGANIZATION');
          //$scope.events = $filter('entityFilter')($scope.entities, 'EVENTS');
          var mentionIndex = function(){
            var text = '';
            text = data.rep.doc[0].text[0];
            console.log(text)
            var distance = 70;
            var mentions = data.rep.doc[0].mentions[0].mention;
            angular.forEach(mentions, function(mention, key){
              var pre = text.substring((mention.$.begin*1 - distance), mention.$.begin*1);
              var term = text.substring(mention.$.begin*1, mention.$.end*1 + 1);
              var post = text.substring(mention.$.end*1 + 1, mention.$.end*1 + distance);
              db.mentions[mention.$.mid] = {
                begin: mention.$.begin,
                end: mention.$.end,
                snippets: {
                  pre: pre,
                  term: term,
                  post: post
                },
              }
            })
          }

          mentionIndex();

          deferred.resolve(db)
        });
        return deferred.promise;
      }
    };
  });
