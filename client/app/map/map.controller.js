'use strict';

angular.module('ariadneApp')
  .controller('MapCtrl', function ($scope, $filter, $timeout, uiGmapGoogleMapApi, apiFactory) {
    $scope.places = [];
    $scope.markers = [];

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 4 };

      var geocoder = new google.maps.Geocoder();
      var overflow = false;
      var overflowTimerActive = false;
      var overflowCount = 0;
      var overflowPlaces = [];
      var centerSet = false;

      // Attach marker data to place data and push to markers
      var addMarker = function(place){
        var marker = place;
        marker.options = {
          show: false,
          onClick: function(){
            console.log('Clicked!');
            ret.show = !ret.show;
          }
        }
        marker.mentions = [];
        angular.forEach(marker.mentref, function(mention, key){
          var snippet = $scope.source.mentions[mention.$.mid].snippets.term;
          marker.mentions.push(snippet)
        })
        $scope.markers.push(marker);
      }

      $scope.codeAddress = function(place) {
        geocoder.geocode( { 'address': place.mentref[0]._}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var position = {
              latitude: results[0].geometry.location.k,
              longitude: results[0].geometry.location.C
            }
            place.geo = {
              latitude: results[0].geometry.location.k,
              longitude: results[0].geometry.location.C,
              data: results,
            },
            place.id = place.$.eid;
            if (centerSet == false){
              $scope.map.center = position;
              centerSet = true;
            }
            addMarker(place)
            // Update place data with geocode data
            apiFactory.updateEntity(place, place.$.eid)
            console.log(place)
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
            // Overflow starts at 2 seconds and grows exponentially for each overflow
          }, 1000 * Math.pow((overflowCount+1),2));
        }
      }

      apiFactory.get().then(function(data) {
        $scope.source = data;
        $scope.entities = data.entities;
        $scope.allPlaces = $filter('entityFilter')($scope.entities, 'GPE');
        $scope.placesQueue = []

        angular.forEach($scope.allPlaces, function(place, key){
          if (!place.geo){
            $scope.placesQueue.push(place)
            console.log(key)
          } else {
            addMarker(place)
          }
        })
        $scope.codeAddresses($scope.placesQueue)
      });


    });

  });
