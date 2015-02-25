'use strict';

angular.module('ariadneApp')
  .controller('TimelineCtrl', function ($scope, $filter, apiFactory) {
    apiFactory.get().then(function(data) {
      $scope.entities = data.entities;
      $scope.dates = $filter('entityFilter')($scope.entities, 'DATE');
      $scope.mentions = data.mentions;
      console.log($scope.dates['-E127'])
      var timelineData = {
          "timeline":
          {
              "headline":"Event Timeline",
              "type":"default",
              "text":"Events associated with a date will be displayed here.",
              "date": [
                  {
                      "startDate":new Date("2015,1,1"),
                      "endDate":"2011,12,11",
                      "headline":"Event Example",
                      "text":"If there are recognized events in your content, they will be displayed here.",
                  }
              ],

          }
      }

      var placeholder = true;

      angular.forEach($scope.dates, function(date, key){
        if (date.date.length > 0){
          var start = "" + date.date[0].start.impliedValues.year + "," +date.date[0].start.impliedValues.month + "," + date.date[0].start.impliedValues.day + "," + date.date[0].start.impliedValues.hour + "," + date.date[0].start.impliedValues.minute + "," + date.date[0].start.impliedValues.second;

          var pushed = {
            headline: date.$.eid,
            text: $scope.mentions[date.mentref[0].$.mid].snippets.pre + "<strong>"+$scope.mentions[date.mentref[0].$.mid].snippets.term+"</strong>"+$scope.mentions[date.mentref[0].$.mid].snippets.post,
            startDate: start,
          }

          if (date.date[0].end){
            var end = "" + date.date[0].end.impliedValues.year + "," + date.date[0].end.impliedValues.month + "," + date.date[0].end.impliedValues.day + "," + date.date[0].end.impliedValues.hour + "," + date.date[0].end.impliedValues.minute + "," + date.date[0].end.second;
            pushed.endDate = end
          }
          timelineData.timeline.date.push(pushed)
          if (placeholder == true){
            timelineData.timeline.date.splice(0)
            placeholder = false;
          }
        }
      })
          createStoryJS({
              width:              '100%',
              height:             '600',
              source:             timelineData,
              embed_id:           'timeline-embed',               //OPTIONAL USE A DIFFERENT DIV ID FOR EMBED
          })

    });

  });
