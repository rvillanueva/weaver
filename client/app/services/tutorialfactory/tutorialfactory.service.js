'use strict';

angular.module('ariadneApp')
  .factory('tutorialFactory', function ($modal ) {

    var tutorials = {
      intro: {
        name: null,
        stages:{
          start: 'Test'
        }
      },
      alqaeda: {
        name: null,
        stages:{
          start:{
            header: 'The Trial of Nasser',
            text: 'This is a search for al-Nasser.'
          }
        }
      },

    }

    var myTutorials = {
      intro: {
      }
    }

    var currentTutorial = null;

    var getTutorial = function(tutorial, page){
      tutorials[tutorial].stages[page];
    }

    var showIntro = function () {
       var modalInstance = $modal.open({
         templateUrl: '../components/intromodal/intromodal.html',
         controller: 'IntroModalInstanceCtrl',
         size: 'lg',
         backdrop: true,
      });

       modalInstance.result.then(function (data) {
         myTutorials.intro.complete = true;
         console.log('completed')
       }, function () {
         console.log('Modal dismissed at: ' + new Date());
       });
     };

    var demo = function (page) {
      if(currentTutorial && page){
        if(tutorials[currentTutorial]){
          if(tutorials[currentTutorial].stages[page]){
              var modalInstance = $modal.open({
                templateUrl: '../components/tutorialmodal/tutorialmodal.html',
                controller: 'TutorialModalInstanceCtrl',
                size: 'lg',
                backdrop: true,
                resolve: {
                  tutorial: function () {
                    return tutorials[currentTutorial].stages[page];
                  }
                }
              });


               modalInstance.result.then(function (data) {
               }, function () {
                 console.log('Modal dismissed at: ' + new Date());
               });
            }
         }
        }

      };

    // Public API here
    return {
      intro: function () {
        if(!myTutorials.intro.complete){
          showIntro();
        }
      },
      setDemo: function(demo){
        currentTutorial = demo;
      },
      demo: function(page){
        demo(page)
      },
      toggleTutorial: function(tutorial){
      }
    };
  });
