angular.module('ariadneApp').controller('voiceController', function ($scope, $http, voiceFactory) {
  $scope.voiceActive = false;
  $scope.voiceToggle= function(){
    if($scope.voiceActive){
      $scope.voiceActive = false;
      voiceFactory.listenEnd();
    } else {
      $scope.voiceActive = true;
      voiceFactory.listenStart();
      voiceFactory.toSpeech('Welcome to Weaver. How can I help you?',0)
    }
  }

//  var sttParams = {
//      url: 'assets/sample1.wav'
//  }

//  $http.post('/', sttParams).success(function(data) {
//    var response = data;
//    console.log(response)
//  });

  //var testSocket = io.connect('http://localhost:9000');
  //testSocket.on('news', function(data){
  //  console.log(data);
  //})


});
