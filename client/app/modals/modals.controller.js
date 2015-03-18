'use strict';

angular.module('ariadneApp')
  .controller('DocModalInstanceCtrl', function ($scope, $modalInstance) {

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

  $scope.language = 'en'

  $scope.ok = function () {
    $scope.analyzing = true;
    apiFactory.getUrl($scope.addUrl.url, $scope.language).then(function(data){
      var date = $scope.addUrl.date;
      $scope.addUrl = data;
      $scope.addUrl.type = 'url'
      if (date){
        $scope.addUrl.date = date;
      }
      $scope.analyzing = false;
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

  $scope.language={
    webhose: 'english',
    yahoo: 'en'
  }

  $scope.ok = function (){

    $scope.analyzing = true;

    var params = {
      q: $scope.search.term
    }
    if ($scope.api == 'webhose'){
      params.language = $scope.language.webhose;
      params.size = 20;
      params.site_type = ['blogs','forums'];
    } else {
      params.count = 15;
      if($scope.language.yahoo !== 'en'){
        params.market = $scope.language.yahoo;
      }
    }
    apiFactory.getNews(params, $scope.api).then(function(data){
      var responses = data;
      var charCount = 0;
      var posted = []
      angular.forEach(responses, function(response, rKey){
        if((charCount + response.text.length) < 100000){
          charCount = charCount + response.text.length;
          posted.push(response)
        }
      })
      $modalInstance.close(posted);
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

angular.module('ariadneApp').controller('SelectModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.dismiss('ok');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

angular.module('ariadneApp').controller('IntroModalInstanceCtrl', function ($scope, $modalInstance, tutorialFactory, localStorageService) {

  $scope.ok = function () {
    tutorialFactory.updateTutorial('intro', 'main')
    $modalInstance.close('complete');
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

});

angular.module('ariadneApp').controller('TutorialModalInstanceCtrl', function ($scope, $modalInstance, tutorial, tutorialFactory) {

console.log(tutorial)

  $scope.modal = {
    header: tutorial.header,
    body: tutorial.text,
  }

  $scope.ok = function () {
    tutorialFactory.updateTutorial(tutorial.tutorial, tutorial.page)
    $modalInstance.close('ok');

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

})
