'use strict';

angular.module('ariadneApp')
  .factory('snippetFactory', function ($q, apiFactory) {
    // Service logic
    // ...

    var sentsIndex = {};
    var docsIndex = [];
    var db;
    var sents
    var getDocs = function(){
      apiFactory.get().then(function(data){
        db = data;
        if(typeof db.sources.analysis.relationships !== 'undefined'){
          sents = db.sources.analysis.relationships.rep.doc[0].sents[0].sent;
        }

        angular.forEach(sents, function(sent, sKey){
          for (var i = 0; i < db.sources.docs.length; i++){
            console.log(sent)
              if(sent.$.begin >= db.sources.docs[i].$.begin &&  sent.$.begin > db.sources.docs[i].$.end){
                sent.docId = i;
              }
          }
        })
      });
    }

    getDocs();


    // Public API here
    return {
      getSnippet: function (mention, buffer) {
        if(!sents){
          getDocs();
        }
        var deferred = $q.defer();
        var beginning = db.mentions[mention].begin;
        var targetDocIndex = sents[sid].docId
        var text = db.sources.analysis.relationships.text;
        var term = text.slice(db.mentions[mention].begin, db.mentions[mention].begin);
        var pre = '';
        var post = '';
        angular.forEach(sents, function(sent, sKey){
          var preFound = false;
          var postFound = false;
          for (var i = buffer; i > 0; i--){
            console.log(i)
            if(sents[sKey-i] > 0 && sents[sKey-i].docIndex == targetDocIndex && !preFound){
              pre = text.slice(sents[sKey-i].begin, db.mentions[mention].begin-1);
            }
            if(sents[sKey+i] > 0 && sents[sKey+i].docIndex == targetDocIndex && !postFound){
              post = text.slice(db.mentions[mention].end+1, sents[sKey+i].end);
            }
          }
          if (term && pre && post){
            var postData = {
              pre: pre,
              post: post,
              term: term
            }
            deferred.resolve(postData);
          }
        })

        return deferred.promise;
      }
    };
  });
