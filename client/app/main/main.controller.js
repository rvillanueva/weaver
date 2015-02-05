'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.testRelationship = function(){
      var postData = {
          sid: 'ie-en-news',
          rt: 'xml',
          txt: $scope.documentText
      }
      console.log(postData)
      $http.post('/api/watson', postData).success(function(data) {
        console.log(data)
        $scope.watsonResponse = data;
      });
    };

  });
