'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $http, d3Factory, $filter, $modal) {
    var graphData = [];
    $scope.documents = [];
    $scope.getRelation = function(){
      var concatenated = '';
      angular.forEach($scope.documents, function(doc, key){
        concatenated = concatenated.concat(doc.txt);
        console.log(concatenated)
      })
      console.log(concatenated)
      var postData = {
          sid: 'ie-en-news',
          rt: 'xml',
          txt: concatenated,
      }
      $http.post('/api/watson', postData).success(function(data) {
        console.log(data)
        $scope.relationships = data;
        $scope.entities = $scope.relationships.rep.doc[0].entities[0].entity;
        $scope.links = $scope.relationships.rep.doc[0].relations[0].relation;
        $scope.persons = $filter('entityFilter')($scope.entities, 'PERSON');
        $scope.organizations = $filter('entityFilter')($scope.entities, 'ORGANIZATION');
        d3Factory.drawForce($scope.entities, $scope.links);
        console.log('drew')
      });

    };


    $scope.open = function (size) {
       var modalInstance = $modal.open({
         templateUrl: 'myModalContent.html',
         controller: 'ModalInstanceCtrl',
         size: size,
         resolve: {
           items: function () {
             return $scope.items;
           }
         }
       });

       modalInstance.result.then(function (pushed) {
         $scope.documents.push(pushed);
       }, function () {
         console.log('Modal dismissed at: ' + new Date());
       });
     };

});


angular.module('ariadneApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.ok = function () {
    $modalInstance.close($scope.addDoc);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
