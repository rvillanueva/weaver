'use strict';

describe('Filter: entityFilter', function () {

  // load the filter's module
  beforeEach(module('ariadneApp'));

  // initialize a new instance of the filter before each test
  var entityFilter;
  beforeEach(inject(function ($filter) {
    entityFilter = $filter('entityFilter');
  }));

  it('should return the input prefixed with "entityFilter filter:"', function () {
    var text = 'angularjs';
    expect(entityFilter(text)).toBe('entityFilter filter: ' + text);
  });

});
