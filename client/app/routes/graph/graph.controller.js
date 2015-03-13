'use strict';

angular.module('ariadneApp')
  .controller('GraphCtrl', function ($scope, $filter, $q, d3Factory, apiFactory, tutorialFactory) {
    tutorialFactory.demo();

    $scope.graphFilter = "PERSON";

    apiFactory.get().then(function(data) {
      $scope.analyzing = false;
      $scope.finished = true;
      console.log(data)
      $scope.db = data;
      $scope.entities = data.entities;
      $scope.links = data.relations;
      $scope.mention = data.mentions;
      var promises = []
      var deferred = $q.defer();
      angular.forEach($scope.db.mentions, function(mention, mKey){
        apiFactory.getSnippet(mKey, 2).then(function(data){
          mention.snippets = data;
          deferred.resolve('complete');
        })
        promises.push(deferred.promise);
      })
      $q.all(promises).then(function(){
        d3Factory.setForce($scope.db, $scope.index, $scope.graphFilter, $scope.graphSearch);
        d3Factory.updateForce($scope.db, $scope.graphFilter, $scope.graphSearch);
      })
    });

    $scope.redraw = function(type, index, data){
      console.log(type)
      d3Factory.updateForce($scope.db, type, index)
    }

    $scope.saveJSON = function(data, filename){

      if(!data) {
          console.error('Console.save: No data')
          return;
      }

      if(!filename) filename = 'relationships.json'

      if(typeof data === "object"){
          data = JSON.stringify(data, undefined, 4)
      }

      var blob = new Blob([data], {type: 'text/json'}),
          e    = document.createEvent('MouseEvents'),
          a    = document.createElement('a')

      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    }

  });
