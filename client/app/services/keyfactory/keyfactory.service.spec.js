'use strict';

describe('Service: keyfactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var keyfactory;
  beforeEach(inject(function (_keyfactory_) {
    keyfactory = _keyfactory_;
  }));

  it('should do something', function () {
    expect(!!keyfactory).toBe(true);
  });

});
