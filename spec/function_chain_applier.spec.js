var expect = require('chai').expect;
var sinon = require('sinon');

var FunctionChainApplier = require('../src/function_chain_applier');

describe('FunctionChainApplier', function() {
  var functionChainApplier = new FunctionChainApplier();

  it('calls a function', function() {
    someFunction = sinon.stub().withArgs('abc', 123).returns('return value');
    expect(functionChainApplier.applyOnObject(someFunction, [])).to.equal('return value');
  });

  it('calls a function on an object', function() {
    var object = {
      someFunction: function() {
        return 'return value';
      }
    };
    expect(functionChainApplier.applyOnObject(object, ['someFunction'])).to.equal('return value');
  });

  it('calls a function on an object with arguments', function() {
    var object = {
      someFunction: sinon.stub()
    };
    object.someFunction.withArgs('abc', 123).returns('returnValue');
    expect(functionChainApplier.applyOnObject(object, ['someFunction'], ['abc', 123])).to.equal('returnValue');
  });

  it('calls a nested function', function() {
    var object = {
      nested: {
        someFunction: function() {
          return 'return value';
        }
      }
    };
    expect(functionChainApplier.applyOnObject(object, ['nested', 'someFunction'])).to.equal('return value');
  });
});
