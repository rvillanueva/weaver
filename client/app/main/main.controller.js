'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $location, $modal, $filter, $http, apiFactory) {

  $scope.documents = [];

  $scope.viewer = {
    index: null
  }

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

    $scope.getRelation = function(){
      $scope.analyzing = true;
      $scope.postData = []
      var count = '';
      angular.forEach($scope.documents, function(doc, key){
        $scope.postData.push(doc);
        count = count + doc.text;
      })

      if(count.length < 100000){
        apiFactory.addSource($scope.postData).then(function(data) {
          $scope.analyzing = false;
          $location.path('/graph')
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
       var oldest = new Date(3000, 1, 1);
       if($scope.viewer.date < oldest){
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

      if(!filename) filename = 'saved.json'

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

    $scope.sampleDocs = [{
      title: 'News Search: \"Al Qaeda\"',
      url: '/assets/sample_data/alqaeda.json',
      image: '/assets/images/alqaeda.jpg'
    },{
      title: 'Wikileaks Embassy Cables: \"China\"',
      url: '/assets/sample_data/china.json',
      image: '/assets/images/china.jpg'
    }]

    $scope.setDocs = function(url){
      console.log(url)
     $http.get(url).success(function(data){
       $scope.documents = data;
       $scope.viewDoc(0);
     })
   }

   $scope.alerts = [];

   $scope.addAlert = function(msg) {
     $scope.alerts.push({msg: msg});
   };

   $scope.closeAlert = function(index) {
     $scope.alerts.splice(index, 1);
   };

  });


angular.module('ariadneApp').controller('DocModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.addText = {
    type: 'text'
  };

  $scope.ok = function () {
    $modalInstance.close($scope.addText);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.clear = function () {
    $scope.addText.date = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd-MMMM-yyyy';
});

angular.module('ariadneApp').controller('UrlModalInstanceCtrl', function ($scope, $modalInstance, apiFactory) {

  $scope.ok = function () {
    apiFactory.getUrl($scope.addUrl.url).then(function(data){
      var date = $scope.addUrl.date;
      $scope.addUrl = data;
      $scope.addUrl.type = 'url'
      if (date){
        $scope.addUrl.date = date;
      }
      $modalInstance.close($scope.addUrl);
    })
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.clear = function () {
    $scope.addUrl.date = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd-MMMM-yyyy';
});

angular.module('ariadneApp').controller('SearchModalInstanceCtrl', function ($scope, $modalInstance, apiFactory) {

  $scope.api = 'yahoo'

  $scope.search;

  $scope.ok = function (){
    $scope.analyzing = true;

    var params = {
      q: $scope.search.term,
      format: 'json'
    }
    if ($scope.api == 'webhose'){
      params.language = 'english';
      params.size = 10;
      params.site_type = 'news';
    } else {
      params.count = 10;
    }
    apiFactory.getNews(params, $scope.api).then(function(data){
      $modalInstance.close(data);
    })
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.clear = function () {
    $scope.addUrl.date = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd-MMMM-yyyy';
});
