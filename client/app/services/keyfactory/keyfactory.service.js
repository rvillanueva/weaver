'use strict';

angular.module('ariadneApp')
  .factory('keyFactory', function ($filter) {
    // Service logic

    // Public API here
    return {
      mentionIndex: function (data) {
        var index = {}
        var text = '';
        text = data.rep.doc[0].text[0];
        console.log(text)
        var distance = 70;
        var mentions = data.rep.doc[0].mentions[0].mention;
        angular.forEach(mentions, function(mention, key){
          var pre = text.substring((mention.$.begin*1 - distance), mention.$.begin*1);
          var term = text.substring(mention.$.begin*1, mention.$.end*1 + 1);
          var post = text.substring(mention.$.end*1 + 1, mention.$.end*1 + distance);
          index[mention.$.mid] = {
            begin: mention.$.begin,
            end: mention.$.end,
            snippets: {
              pre: pre,
              term: term,
              post: post
            },
          }
        })
        return index;
      }
    };
  });
