'use strict';

angular.module('ariadneApp')
  .factory('voiceFactory', function ($q, $document, $timeout, $rootScope, $location) {

    // Speech to Text
    var recording = false,
      speech = new SpeechRecognizer({
        ws: '',
        model: 'WatsonModel'
      });

    speech.onstart = function() {
      console.log('demo.onstart()');
    };

    speech.onerror = function(error) {
      console.log('demo.onerror():', error);
      recording = false;
    };

    speech.onend = function() {
      console.log('demo.onend()');
        recording = false;
    };

    speech.onresult = function(data) {
      console.log('demo.onresult()');
      //showResult(data);
      findCommand(data)
      console.log(data)
    };

    //function showResult(data) {
      //console.log(data);
      //if there are transcripts
      //if (data.results && data.results.length > 0) {

        //if is a partial transcripts
        //if (data.results.length === 1 ) {
          //var text = data.results[0].alternatives[0].transcript || '';

          //Capitalize first word
          //text = text.charAt(0).toUpperCase() + text.substring(1);
          // if final results, append a new paragraph
          //if (data.results[0].final){
          //}
        //}
      //}
    //}

    var commandVerbs = {
      nav: ['go to', 'navigate to', 'show']
    }

    function findCommand(data){
      var phrase = data.results[0].alternatives[0].transcript;
      var verbFound = false;
      if (data.results[0].final){
        if(phrase.indexOf('watson') >= 0){
          //Find a verb
          angular.forEach(commandVerbs, function(verb, vKey){
            angular.forEach(verb, function(term, tKey){
              if(phrase.indexOf(term) >= 0){
                verbFound = true;
                if (vKey == 'nav'){
                  commandNavigate(phrase)
                }
              }
            })
          })
          //}
          console.log('Command identified!')
        }
      }
    }

    function commandNavigate(phrase){
      console.log('navigating')
      if(phrase.indexOf('graph') >= 0){
        $location.path('/graph')
        toSpeech('Here\'s a network graph of how entities in your documents relate to each other.')
      } else if(phrase.indexOf('map') >= 0){
        $location.path('/map')
        toSpeech('Here\'s a map of all the locations mentioned in your data.')
      } else if(phrase.indexOf('document') >= 0 || phrase.indexOf('source') >= 0){
        $location.path('/sources')
        toSpeech('Here\'s all the documents you analyzed.')
      } else if(phrase.indexOf('timeline') >= 0){
        $location.path('/timeline')
        toSpeech('Here\'s a timeline of all the events I could identify.')
      } else if(phrase.indexOf('entities') >= 0 || phrase.indexOf('entity') >= 0){
        $location.path('/entities')
        toSpeech('Here\'s a list of all mentioned entities.')
      }
    }

    function displayError(error) {
      var message = error;
      try {
        var errorJson = JSON.parse(error);
        message = JSON.stringify(errorJson, null, 2);
      } catch (e) {
        message = error;
      }
      console.log('ERROR: ' + message)
    }


    // Text to Speech

    var audioElement = $document[0].createElement('audio');
    var toSpeech = function(text, pause){
      var processing = $q.defer();
      var timeout = 0;
      console.log('speeching...')
      var params = {
        accept: 'audio/ogg; codecs=opus',
        voice: 'VoiceEnUsMichael',
        text: text
      }
      var parametrize = '/api/watson/tts/synthesize?' + $.param(params);
      if (pause && pause == parseInt(pause, 10)){
        timeout = pause;
      }
      $timeout(function(){
        audioElement.src = parametrize;
        audioElement.play();
        audioElement.addEventListener("ended", function(){
          audioElement.currentTime = 0;
          audioElement.pause();
          processing.resolve('ended')
        });
      }, timeout)
      return processing.promise;
    }

    return {
      toSpeech: function(text, pause) {
        return toSpeech(text, pause);
      },
      listenStart: function(text, pause) {
        speech.start();
      },
      listenEnd: function(text, pause) {
        speech.stop();
      }
    }
  });
