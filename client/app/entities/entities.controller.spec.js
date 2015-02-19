'use strict';

describe('Controller: EntitiesCtrl', function () {

  // load the controller's module
  beforeEach(module('ariadneApp'));

  var EntitiesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntitiesCtrl = $controller('EntitiesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
