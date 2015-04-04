angular.module('ariadneApp').controller('voiceController', function ($scope, voiceFactory) {
  $scope.voiceActive = false;
  $scope.voiceToggle= function(){
    if($scope.voiceActive){
      $scope.voiceActive = false;
    } else {
      $scope.voiceActive = true;
      voiceFactory.toSpeech('Welcome to Weaver. How can I help you?',0)
    }
  }
});
