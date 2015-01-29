'use strict';

var expect = chai.expect;

describe('ngcUser directive', function() {
  beforeEach(module('ngcourse-example-directives'));

  var compile;
  var rootScope;

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    compile = $compile;
    rootScope = $rootScope;
  }));

  it('generates the appropriate HTML', function() {
    var scope = rootScope.$new();
    scope.userDisplayName = 'Alice';

    var element = compile(
      '<ngc-user user-display-name="userDisplayName"></ngc-user-display-name>')(scope);
    scope.$digest();

    expect(element.html()).to.contain('Hello, Alice.');
  });
});
