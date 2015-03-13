'use strict';

angular.module('ariadneApp')
  .factory('tutorialFactory', function ($modal, localStorageService) {

    var tutorials = {
      intro: {
        name: null,
        stages:{
          main: null
        }
      },
      bokoharam: {
        name: null,
        stages:{
          start:{
            header: 'The Friends and Foes of Boko Haram',
            text: 'This is a search for al-Nasser.'
          },
          map: {
            header: 'Mapping Combat',
            text: 'Where is violence occurring in Nigeria? Who controls which area?<br><br>Who is gaining ground? What other geographic regions are affected? How?'
          },
          timeline: {
            header: 'A History of Boko Haram',
            text:'What happened between 2012 and 2013 to Ansaru?'
          },
          graph: {
            header: 'A Who\'s Who of Radical Islamists',
            text:'What is Boko Haram’s relationship to Abu Bakr al-Baghdadi? Who is al-Baghdadi?'
          },
        }
      },
      measles: {
        name: null,
        stages:{
          start:{
            header: 'Tracking Measles',
            text: 'A search for \'measles outbreak\' on March 11, 2015.'
          },
          map: {
            header: 'The Outbreak Battleground',
            text: 'What US state is showing the most widespread outbreak? What is the infection rate in Quebec? Why is measles affecting Western Africa?'
          },
          timeline: {
            header: 'A Disease Across Generations',
            text:'What were the major early benchmarks of the measles vaccine? What was the earliest reported measles elimination in the United States?'
          },
        }
      },
      alqaeda: {
        name: null,
        stages:{
          start:{
            header: 'The Trial of Naseer',
            text: 'This is a search for Nasser.'
          }
        }
      },

    }

    var localData = localStorageService.get('myTutorials')
    var myTutorials;

    if(localData){
      myTutorials = localData
    } else {
      myTutorials = {
        intro: {
          stages: {
          }
        }
      }
    }


    var store = function(){
      localStorageService.set('myTutorials', myTutorials)
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
       })
     }

    var demo = function (page, review) {
      if(typeof tutorials[currentTutorial].stages[page] !== 'undefined'){
        if(typeof myTutorials[currentTutorial] == 'undefined'){
          myTutorials[currentTutorial] = {
            stages: {}
          }
        }
        if(typeof myTutorials[currentTutorial].stages[page] == 'undefined'){
          myTutorials[currentTutorial].stages[page] = {
            completed: false
          }
        }
        if(tutorials[currentTutorial].stages[page] && !myTutorials[currentTutorial].stages[page].complete || review){
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
      demo: function(page, review){
        demo(page, review)
      },
      toggleTutorial: function(tutorial, status){
        // Unused
        if(typeof status !== 'undefined'){
          myTutorials[tutorial].show = status;
        } else {
          myTutorials[tutorial].show = !myTutorials[tutorial].show
        }
        store();
      },
      updateTutorial: function(tutorial, page){
        if(typeof myTutorials[tutorial] == 'undefined'){
          myTutorials[tutorial] = {
            stages: {}
          };
        }
        if(typeof myTutorials[tutorial].stages[page] == 'undefined'){
          myTutorials[tutorial].stages[page] = {
            complete: true
          }
        } else {
          myTutorials[tutorial].stages[page].complete = true
        }
        var incomplete = false;
        angular.forEach(myTutorials[tutorial].stages, function(stage, sKey){
          if (!stage.complete){
            incomplete = true;
          }
        })
        if(!incomplete){
          myTutorials[tutorial].complete = true;
        }
        store();
      }
    };
  });
