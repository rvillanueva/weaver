'use strict';

angular.module('ariadneApp')
  .controller('TimelineCtrl', function ($scope, $filter, apiFactory) {
    apiFactory.get().then(function(data) {
      $scope.entities = data.entities;
      $scope.dates = $filter('entityFilter')($scope.entities, 'DATE');
      $scope.mentions = data.mentions;
      var timelineData = {
          "timeline":
          {
              "headline":"Event Timeline",
              "type":"default",
              "text":"Events associated with a date will be displayed here.",
              "date": [
                  {
                      "placeholder": true,
                      "startDate":"2015,1,1",
                      "endDate":"2015,1,2",
                      "headline":"Event Example",
                      "text":"If there are recognized events in your content, they will be displayed here.",
                  }
              ],

          }
      }

      var placeholder = true;
      var times = ['year','month','day','hour','minute','second'];
      var knownVals = {
        year: 0,
        month: 1,
        day: 2,
        weekday: 2,
        hour: 3,
        minute: 4,
        second: 5
      }
      var bookends = ['start','end']

      angular.forEach($scope.dates, function(date, key){
        if (date.date.length > 0){
          var start = "";
          var end = "";
          var smallestKnown = {
            start: null,
            end: null
          }
          angular.forEach(date.date[0].start.knownValues, function(knownVal, kvKey){
            if (smallestKnown.start < knownVals[kvKey]){
              smallestKnown.start = knownVals[kvKey]
            }
          })
          if(date.date[0].end){
            angular.forEach(date.date[0].end.knownValues, function(knownVal, kvKey){
              if (smallestKnown.end < knownVals[kvKey]){
                smallestKnown.end = knownVals[kvKey]
              }
            })
          }
          angular.forEach(times, function(time, timeKey){
            if (timeKey <= smallestKnown.start){
              if (time !== 'year'){
                start = start.concat(",");
              };
              if (date.date[0].start.knownValues[time]){
                start = start.concat(date.date[0].start.knownValues[time])
              } else {
                start = start.concat(date.date[0].start.impliedValues[time])
              }
            }
            if (date.date[0].end && timeKey <= smallestKnown.end){
              if (time !== 'year'){
                end = end.concat(",");
              };
              if (date.date[0].end.knownValues[time]){
                end = end.concat(date.date[0].end.knownValues[time])
              } else {
                end = end.concat(date.date[0].end.impliedValues[time])
              }
            }
          })
          var pushed = {
            headline: date.$.eid,
            text: $scope.mentions[date.mentref[0].$.mid].snippets.pre + "<strong>"+$scope.mentions[date.mentref[0].$.mid].snippets.term+"</strong>"+$scope.mentions[date.mentref[0].$.mid].snippets.post,
            startDate: start,
            endDate: end,
            asset: {}
          }
          if($scope.dates.image){
            pushed.asset.media = $scope.dates.image
          }
          timelineData.timeline.date.push(pushed);
          if (timelineData.timeline.date[0].placeholder == true){
            timelineData.timeline.date.splice(0, 1)
          }
        }
      })
      console.log(timelineData)

      createStoryJS({
          width:              '100%',
          height:             '600',
          source:             timelineData,
          embed_id:           'timeline-embed'
      })

    });

  });
