'use strict';

describe('Service: apifactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var apifactory;
  beforeEach(inject(function (_apifactory_) {
    apifactory = _apifactory_;
  }));

  it('should do something', function () {
    expect(!!apifactory).toBe(true);
  });

});
