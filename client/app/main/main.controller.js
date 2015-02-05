'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.testRelationship = function(){
      $http.post('/api/watson').success(function(data) {
        console.log(data)
      });
    };

  });
