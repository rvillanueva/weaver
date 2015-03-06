'use strict';

describe('Service: geocodeFactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var geocodeFactory;
  beforeEach(inject(function (_geocodeFactory_) {
    geocodeFactory = _geocodeFactory_;
  }));

  it('should do something', function () {
    expect(!!geocodeFactory).toBe(true);
  });

});
