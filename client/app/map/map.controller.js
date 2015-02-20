'use strict';

angular.module('ariadneApp')
  .controller('MapCtrl', function ($scope, $filter, $timeout, uiGmapGoogleMapApi, apiFactory) {
    $scope.places = [];

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };

      var geocoder = new google.maps.Geocoder();
      var overflow = false;
      var overflowTimerActive = false;
      var overflowCount = 0;
      var overflowPlaces = [];
      var centerSet = false;

      $scope.codeAddress = function(place) {
        geocoder.geocode( { 'address': place.mentref[0]._}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var position = {
              latitude: results[0].geometry.location.k,
              longitude: results[0].geometry.location.C
            }
            var marker = {
              name: place.mentref[0]._,
              position: {
                latitude: results[0].geometry.location.k,
                longitude: results[0].geometry.location.C
              },
              geoData: results,
              entityData: place
            }
            if (centerSet == false){
              $scope.map.center = position;
              console.log($scope.map.center)
              centerSet = true;
            }
            $scope.places.push(marker)
            console.log(marker)
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
            overflow = true;
          }
        });
      }

      $scope.codeAddresses = function(places){
        console.log('coding')
        angular.forEach(places, function(place, key){
          if (overflow == false){
            $scope.codeAddress(place);
            console.log(key)
            $scope.placesQueue.splice(key, 1)
          }
        })
        console.log($scope.placesQueue)
        if (overflow == true){
          console.log('overflowed')
          $timeout(function(){
            overflow = false;
            overflowCount ++;
            $scope.codeAddresses($scope.placesQueue);
            console.log(overflowCount)
            // Overflow starts at 2 seconds and grows exponentially for each overflow
          }, 1000 * Math.pow((overflowCount+1),2));
        }
      }

      apiFactory.getEntities().then(function(data) {
        $scope.entities = data;
        $scope.placesQueue = $filter('entityFilter')($scope.entities, 'GPE');
        $scope.codeAddresses($scope.placesQueue)
      });

    });

  });
