'use strict';

describe('Service: snippetfactory', function () {

  // load the service's module
  beforeEach(module('ariadneApp'));

  // instantiate service
  var snippetfactory;
  beforeEach(inject(function (_snippetfactory_) {
    snippetfactory = _snippetfactory_;
  }));

  it('should do something', function () {
    expect(!!snippetfactory).toBe(true);
  });

});
