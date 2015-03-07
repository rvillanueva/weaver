'use strict';

angular.module('ariadneApp')
  .factory('snippetFactory', function ($q, apiFactory) {
    // Service logic
    // ...


    var getDocs = function(){
      apiFactory.get().then(function(data){
        var db = data;
        if(typeof db.sources.analysis.relationships !== 'undefined'){
          sents = db.sources.analysis.relationships.rep.doc[0].sents[0].sent;
          mentionIndex(data);
        }


      });
    }

    var docIndex = function(mid){
      console.log('docindex')
      console.log(db)
      var docInd;
      var start = db.mentions[mid].begin;
      var doc = db.sources.docs;
      console.log(doc)
      for (var i = 0; i < doc.length; i++) {
        console.log(i)
        console.log(doc[i])
        if(doc[i].start <= start && doc[i].end >= start){
          docInd = i
        }
      }
      console.log(docInd)
      return docInd;
    }

    getDocs();


    // Public API here
    return {

      docIndex: function (mid) {
        return docIndex(mid)
      }
    };
  });
