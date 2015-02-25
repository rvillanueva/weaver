'use strict';

angular.module('ariadneApp')
  .factory('apiFactory', function ($q, $http, $filter) {
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


    var mentionIndex = function(data){
      var text = '';
      text = data.rep.doc[0].text[0];
      var distance = 100;
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

    var parseDate = function(text, ref, type){


    }


    // Public API here
    return {
      post: function (data, path) {
        db.push(data);
        return 'Success';
      },
      get: function () {
        var deferred = $q.defer();
        var retrieve = function(){
          deferred.resolve(db)
        }
        retrieve();
        return deferred.promise;
      },
      getSources: function () {
        return db.sources;
      },
      updateEntity: function (data, key) {
        console.log(db)
        db.entities[key] = data;
        return db.entities[key];
      },
      getEntities: function () {
        var deferred = $q.defer();
        var retrieve = function(){
          deferred.resolve(db.entities)
        }
        retrieve();
        return deferred.promise;
      },
      addSource: function (postData) {
        var deferred = $q.defer();
        var header = {
            sid: 'ie-en-news',
            rt: 'xml',
            txt: postData[0].text,
        }
        //$http.post('/api/watson/relationships', header).success(function(data) {
        $http.get('/app/dummy.json').success(function(data){
          console.log(data)
          var saved = {
            active: true,
            analysis: {
              relationships: data
            },
            text: data.rep.doc[0].text,
            date: postData[0].date,
            created: new Date(),
            title: postData[0].title,
          }
          var timestamp = Date.now()
          db.sources[timestamp] = saved;
          var entities = data.rep.doc[0].entities[0].entity;
          var relations = data.rep.doc[0].relations[0].relation;

          angular.forEach(entities, function(entity, key){
            db.entities[entity.$.eid] = entity

            // If date, parse using Chrono
            if (entity.$.type == "DATE"){
              var ref = null;
              if (saved.date){
                ref = new Date(saved.date);
              }
              var header = {
                text: entity.mentref[0]._,
                ref: ref
              }
              $http.post('/api/chrono/parse', header).success(function(data) {
                entity.date = data
                console.log(data)
              })
            }
          })
          // Attach relations to entities
          angular.forEach(relations, function(relation, key){
            db.relations[relation.$.rid] = relation;
            // If no relations tagged to entity, create array
            if (!db.entities[relation.rel_entity_arg[0].$.eid].relations){
              db.entities[relation.rel_entity_arg[0].$.eid].relations = [];
            }
            if (!db.entities[relation.rel_entity_arg[1].$.eid].relations){
              db.entities[relation.rel_entity_arg[1].$.eid].relations = [];
            }

            var source = relation.$;
            var target = relation.$;

            source.role = 'source'
            target.role = 'target'

            // Attach relation to source entity
            db.entities[relation.rel_entity_arg[0].$.eid].relations.push(source)

            // Attach relation to target entity
            db.entities[relation.rel_entity_arg[1].$.eid].relations.push(target)
          })


          mentionIndex(data);
          deferred.resolve(db)
        });
        return deferred.promise;
      },
      parseDate: function (text, ref, type) {
        var deferred = $q.defer();
        var header = {
          text: text,
          ref: ref
        }
        if(type=='full'){
          $http.post('/api/chrono/parse', header).success(function(data) {
            deferred.resolve(data);
          })
        } else {
          $http.post('/api/chrono/date', header).success(function(data) {
            deferred.resolve(data);
          })
        }
        return deferred.promise;
      },
    };
  });
