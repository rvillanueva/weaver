'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $rootScope, $window, $location, $modal, $filter, $http, apiFactory, tutorialFactory) {

    tutorialFactory.intro();

  $scope.documents = [];

  $scope.viewer = {
    index: null
  }

  $scope.addButton = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.addButton.isopen = !$scope.addButton.isopen;
  };


  var getSources = function(){
    console.log('starting')
    apiFactory.getSources().then(function(data){
      var sources = data;
      console.log(sources)
      if (sources.docs){
        if (sources.docs.length > 0){
          $scope.documents = sources.docs;
        }
      }
    })
  }

  getSources();


    $scope.removeDoc = function(index){
      if ($scope.viewer.index == index){
        if ($scope.viewer.index != 0){
          $scope.viewer = $scope.documents[0];
        } else if ($scope.documents[1]){
          $scope.viewer = $scope.documents[1];
        }
      } else if (index == 0 && $scope.documents.length == 1){
        $scope.viewer = null;
      }
      $scope.documents.splice(index, 1);

    }

    $scope.getRelation = function(demoKey){
      $scope.analyzing = true;
      $scope.postData = []
      var count = '';
      angular.forEach($scope.documents, function(doc, key){
        $scope.postData.push(doc);
        count = count + doc.text;
      })

      if(count.length < 100000){
        apiFactory.addSource($scope.postData, demoKey).then(function(data) {
          console.log(data)
          $scope.analyzing = false;
          $scope.completed();
        }, function(error){
          $scope.addAlert('There seems to be a problem with the Watson Relationship Extraction API. Please try again later.')
          $scope.analyzing = false;
        });
      } else {
        $scope.analyzing = false;
        $scope.addAlert('Sources contain ' + $filter('number')(count.length,0) + ' characters. Limit is 100,000 characters.');
      }



    };

    $scope.add = function (type) {
       var modalInstance;
      if (type == 'text'){
        modalInstance = $modal.open({
         templateUrl: '../components/docmodal/docmodal.html',
         controller: 'DocModalInstanceCtrl',
         size: 'lg',
         backdrop: true,
       });
      }
      if (type == 'url'){
        modalInstance = $modal.open({
         templateUrl: '../components/urlmodal/urlmodal.html',
         controller: 'UrlModalInstanceCtrl',
         size: 'lg',
         backdrop: true,
       });
      }

       modalInstance.result.then(function (pushed) {
         if (!pushed.title){
           pushed.title = 'Untitled';
         }
         $scope.documents.push(pushed);
       });
     };

     $scope.viewDoc = function(index){
       $scope.viewer = $scope.documents[index];
       $scope.viewer.index = index;

       //Just a hack to fix dates from Yahoo. Should figure out why happening.
       if($scope.viewer.date < 1625496897){
         $scope.viewer.date = $scope.viewer.date*1000;
       }
     }

     $scope.addSearch = function () {
        var modalInstance = $modal.open({
          templateUrl: '../components/searchmodal/searchmodal.html',
          controller: 'SearchModalInstanceCtrl',
          size: 'lg',
          backdrop: true,
       });

        modalInstance.result.then(function (docs) {
          angular.forEach(docs, function(doc, rKey){
            $scope.documents.push(doc)
          })
          if ($scope.viewer){
            $scope.viewDoc(0);
          }
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      };

    if($scope.documents && $scope.documents.length > 0){
      $scope.viewDoc(0);
    }

    $scope.saveJSON = function(data, filename){
      console.log(data)
      if(!data) {
          console.error('Console.save: No data')
          return;
      }

      if(!filename) {
        filename = 'saved.json'
      }

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

    $scope.completed = function () {
       var modalInstance = $modal.open({
         templateUrl: '../components/selectmodal/selectmodal.html',
         controller: 'SelectModalInstanceCtrl',
         size: 'lg',
         backdrop: true,
      });
     };

    $scope.retrieved = tutorialFactory.getTutorials();
    $scope.sampleDocs = [];
    angular.forEach($scope.retrieved, function(doc, dKey){
      var pushed = doc;
      pushed.id = dKey;
      $scope.sampleDocs.push(pushed)
    })

    console.log($scope.sampleDocs)
    $scope.otherDocs = [
      {
        id: 'ferguson',
        title: 'Ferguson/Michael Brown DOJ Documents',
        url: '/assets/sample_data/ferguson.json',
        image: '/assets/images/ferguson.jpg'
      }
    ]

    $scope.setDocs = function(url){
      console.log(url)
     $http.get(url).success(function(data){
       $scope.documents = data;
       $scope.viewDoc(0);
     })
   }

   $scope.setDemo = function(id){
     tutorialFactory.setDemo(id);
     tutorialFactory.demo('start');
   }

   $scope.alerts = [];

   $scope.addAlert = function(msg) {
     $scope.alerts.push({msg: msg});
   };

   $scope.closeAlert = function(index) {
     $scope.alerts.splice(index, 1);
   };

   $scope.analyzed = $rootScope.analyzed;
   $rootScope.$on('analyzed', function (event) {
     $scope.analyzed = true;
   });

   $scope.clearAll = function(){
     $window.location.reload()
   }

  });
