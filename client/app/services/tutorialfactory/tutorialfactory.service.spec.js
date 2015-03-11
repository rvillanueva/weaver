'use strict';

describe('Service: tutorialfactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var tutorialfactory;
  beforeEach(inject(function (_tutorialfactory_) {
    tutorialfactory = _tutorialfactory_;
  }));

  it('should do something', function () {
    expect(!!tutorialfactory).toBe(true);
  });

});
