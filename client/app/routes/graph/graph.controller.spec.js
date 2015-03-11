'use strict';

describe('Controller: GraphCtrl', function () {

  // load the controller's module
  beforeEach(module('ariadneApp'));

  var GraphCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GraphCtrl = $controller('GraphCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
