'use strict';

describe('Service: d3factory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var d3factory;
  beforeEach(inject(function (_d3factory_) {
    d3factory = _d3factory_;
  }));

  it('should do something', function () {
    expect(!!d3factory).toBe(true);
  });

});
