'use strict';

angular.module('ariadneApp')
  .controller('MapCtrl', function ($scope, $filter, $timeout, $q, uiGmapGoogleMapApi, apiFactory, geocodeFactory, tutorialFactory) {
    tutorialFactory.demo();

    $scope.places = [];
    $scope.markers = [];

    uiGmapGoogleMapApi.then(function(maps) {

      var myLatlng = new google.maps.LatLng(41.210722,-73.803173);

      var geocoder = new google.maps.Geocoder();

      var mapOptions = {
        zoom: 6,
        center: myLatlng
      }

      var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

      var overflow = false;
      var overflowTimerActive = false;
      var overflowCount = 0;
      var overflowPlaces = [];
      var centerSet = false;

      // Attach marker data to place data and push to markers
      var addMarker = function(place){
        console.log('marker placed')
        var position = new google.maps.LatLng(place.geo.latitude,place.geo.longitude);
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: place.mentref[0]._,
            animation: google.maps.Animation.DROP,
            //icon: "/assets/images/war.png",
            mentions: []
        });

        var prom = [];

        var contentString = '<strong>' + marker.title + '</strong><br><br><ul>';
        angular.forEach(place.relation)
        angular.forEach(place.mentref, function(mention, mKey){
          var deferred = $q.defer();
          apiFactory.getSnippet(mention.$.mid,1).then(function(data){
            var snippet = data;
            if(mKey < 5){
              contentString = contentString + '<li>' + snippet.phrase + '</li>';
            }
            marker.mentions.push(snippet);
            deferred.resolve('complete')
          });
          prom.push(deferred.promise)
        })

        $q.all(prom).then(function(){
          contentString = contentString + '</ul>'
          var infowindow = new google.maps.InfoWindow({
              content: contentString
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
          $scope.markers.push(marker);
        })

      }



      $scope.codeAddress = function(place, key) {
        var term = geocodeFactory.geocode(place.mentref[0]._)
        geocoder.geocode( { 'address': term}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            place.geo = {
              latitude: results[0].geometry.location.k,
              longitude: results[0].geometry.location.B,
              data: results,
            };
            console.log(results)
            var position = new google.maps.LatLng(place.geo.latitude, place.geo.longitude)

            place.id = place.$.eid;
            if (centerSet == false){
              if(place.geo.latitude && place.geo.longitude){
                map.setCenter(position)
              }
              centerSet = true;
            }
            addMarker(place);

            // Update place data with geocode data
            apiFactory.updateEntity(place, place.$.eid);
            $scope.placesQueue.splice(key, 1);
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
            overflow = true;
          }
        });
      }

      $scope.codeAddresses = function(places){
        angular.forEach(places, function(place, key){
          if (overflow == false){
            $scope.codeAddress(place, key);
          }
        })
        console.log($scope.placesQueue)
        if (overflow == true){
          var waitTime = (overflowCount+1)*3
          console.log('overflowed, waiting ' + waitTime + ' seconds');
          $timeout(function(){
            overflow = false;
            overflowCount ++;
            $scope.codeAddresses($scope.placesQueue);
            // Overflow starts at 2 seconds and grows exponentially for each overflow
            console.log(overflowCount + ' geocode attempt');
          }, 1000 * waitTime);
        }
      }

      apiFactory.get().then(function(data) {
        $scope.source = data;
        $scope.entities = data.entities;
        $scope.allPlaces = $filter('entityFilter')($scope.entities, 'GPE', 'NAM');
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
