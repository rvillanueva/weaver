'use strict';

angular.module('ariadneApp')
  .controller('MainCtrl', function ($scope, $location, $modal, apiFactory) {
    $scope.documents = [{
      title: 'Ukraine Crisis',
      txt: 'Ukraine crisis: Leaders in new diplomatic push for peace. Ukrainian soldiers stand on a military vehicle in the village of Horlivka, Donetsk region - 4 February 2015 More than 5,000 people have been killed in the war in eastern Ukraine Continue reading the main story Ukraine crisis Why is east hit by conflict? Shattered lives "Shooting all day long" Is Russia stoking war? Diplomatic efforts are under way to end renewed fighting in eastern Ukraine. French President Francois Hollande and German Chancellor Angela Merkel have arrived in the capital Kiev to present a new peace initiative. US Secretary of State John Kerry, who is also in Kiev, said the US wanted a diplomatic solution, but would not close its eyes to Russian aggression. Fighting between Ukrainian forces and pro-Russian rebels has killed more than 5,000 people since last April. Ukraine and the West have accused Russia of arming rebels in eastern Ukraine and sending regular troops across the border. Russia denies direct involvement but says some Russian volunteers are fighting alongside the rebels. Speaking at a joint news conference with Mr Kerry, Ukrainian Prime Minister Arseniy Yatsenyuk said: "We need to get peace. But we will never consider anything that undermines territorial integrity... of Ukraine." Mr Kerry said the US was committing an additional $16.5m (£11m) in aid to support Ukrainians affected by the conflict in the east. He accused Russia of violating Ukraine"s sovereignty, saying that Russia had been acting with "impunity", crossing the Ukrainian border "at will with weapons, with personnel, with the instruments of death". Jump media playerMedia player helpOut of media player. Press enter to return or tab to continue. BBC News assesses the spearhead force"s capacity - in 60 seconds "The only way that it ends is through diplomacy. We have no illusions that there is a "military solution"... we are choosing a peaceful solution through diplomacy - but you cannot have a one-sided peace," Mr Kerry said. However, he added that Mr Obama was "reviewing all options", including the possibility of providing "defensive weapons" to Ukraine, due to the dangerous escalation in violence. The US is currently only providing "non-lethal" assistance. Russian Foreign Ministry spokesman Alexander Lukashevich said any decision by the US to supply weapons to Ukraine would "inflict colossal damage to Russian-American relations". Several senior Western officials have also expressed concern at the prospect of US arms being sent to Ukraine. German Foreign Minister Frank-Walter Steinmeier likened the option to "throwing more weapons on the bonfire", while Nato commander Philip Breedlove said governments must take into account that the move "could trigger a more strident reaction from Russia". line Analysis: Jonathan Marcus, BBC diplomatic correspondent Should the West arm Ukraine? Might such a move - by giving Ukraine more effective defences - reduce the risk of a major escalation? Or might it simply add fuel to the fire, encouraging Moscow to mount a major offensive westwards to punch through to the territory it already holds in the Crimea? Nato countries are increasingly divided on this crucial question. The consensus view up to now has been not to supply weapons, but to give non-lethal support like radars, medical gear, body-armour and so on. Only Poland has explicitly stated that it might arm Ukraine if asked. Now the balance of the debate is shifting in the US too, but still there is no clear will to provide weapons to the Kiev government. There is a growing sense of urgency and concern within Nato and if diplomacy fails, arming Kiev may become a serious option. Nato readjusts as Ukraine crisis looms line "Ukraine at war" Speaking earlier on Thursday, Mr Hollande said that he and Mrs Merkel would present a new peace proposal based on the "territorial integrity" of Ukraine, which could be "acceptable to all". However, he warned that diplomacy "cannot go on indefinitely". "Ukraine is at war. Heavy weapons are being used and civilians are being killed daily," the French leader said. A child waits on a bus to leave the town of Debaltseve, Ukraine, 3 February 2015 About 1.2 million Ukrainians have fled their homes since the conflict began last April Pro-Russian rebels arrive at the hospital of Donetsk"s Tekstilshik district after it was hit by shelling, 4 February 2015 Three people were killed when a shell hit a hospital in the rebel-held city of Donetsk on Wednesday Residents fetch water from a well in Donetsk"s Kievski district, Ukraine, 5 February 2015 The cities of Donetsk and Luhansk are under rebel control Mr Hollande and Mrs Merkel will meet Russian President Vladimir Putin in Moscow on Friday. A spokesman for the Kremlin said Mr Putin would discuss "the fastest possible end to the civil war in south-eastern Ukraine". The talks in Kiev come as Nato unveils details of a plan to bolster its military presence in Eastern Europe in response to the Ukraine crisis. Nato chief Jens Stoltenberg says it will be the biggest reinforcement of its collective defence since the end of the Cold War. Jump media playerMedia player helpOut of media player. Press enter to return or tab to continue. James Reynolds reports from Debaltseve, "a town almost too dangerous to live in" A new rapid reaction "spearhead" force of up to 5,000 troops is expected to be announced, with its lead units able to deploy at two days" notice. Nato is also establishing a network of small command centres in Estonia, Lithuania, Latvia, Poland, Romania, and Bulgaria. Mr Stoltenberg said the bloc was responding to "the aggressive actions we have seen from Russia, violating international law and annexing Crimea". New sanctions Meanwhile, officials said on Thursday that the European Union is adding 19 people, including five Russians, to its sanctions list over the Ukraine crisis. Nine "entities" will also be targeted by the sanctions, which were reportedly agreed at an emergency meeting of EU foreign ministers last week. map Fighting has intensified in eastern Ukraine in recent weeks amid a rebel offensive. On Thursday, both government and rebel officials said several civilians had been killed in clashes over the past 24 hours. Ukraine"s military said five of its soldiers had died in the same period. The fiercest fighting has been near the town of Debaltseve, where rebels are trying to surround Ukrainian troops. The town is a crucial rail hub linking the rebel-held cities of Donetsk and Luhansk. Some 1.2 million Ukrainians have fled their homes since last April, when the rebels seized a big swathe of the Luhansk and Donetsk regions following Russia"s annexation of Crimea.'
    }];

    $scope.details = {}

    $scope.removeDoc = function(index){
      console.log(index)
      $scope.documents = $scope.documents.slice(index+1)
    }

    $scope.getRelation = function(){
      $scope.analyzing = true;
      var concatenated = '';
      angular.forEach($scope.documents, function(doc, key){
        $scope.postData = concatenated.concat(doc.txt);
      })

      apiFactory.addSource($scope.postData).then(function(data) {
        $scope.analyzing = false;
        $scope.finished = true;
        console.log(data)
        $location.path('/graph')
      });

    };

    $scope.open = function (size) {
       var modalInstance = $modal.open({
         templateUrl: '../components/docmodal/docmodal.html',
         controller: 'DocModalInstanceCtrl',
         size: size,
         backdrop: true,
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


angular.module('ariadneApp').controller('DocModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.ok = function () {
    $modalInstance.close($scope.addDoc);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
