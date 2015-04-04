'use strict';

describe('Service: voicefactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var voicefactory;
  beforeEach(inject(function (_voicefactory_) {
    voicefactory = _voicefactory_;
  }));

  it('should do something', function () {
    expect(!!voicefactory).toBe(true);
  });

});
