var sinon = require('sinon');
var expect = require('chai').expect;

var StreamProxyCreator = require('../src/stream_proxy_creator');

describe.only('StreamProxyCreator', function() {
  var streamProxy, callback;

  beforeEach(function() {
    callback = sinon.spy();
    streamProxy = (new StreamProxyCreator()).create(callback);
  });

  it('calls the callback when called directly', function() {
    streamProxy();
    expect(callback.getCall(0).args).to.deep.equal([[], []]);
  });

  it('calls the callback with arguments when called directly', function() {
    streamProxy('some', 'args');
    expect(callback.getCall(0).args).to.deep.equal([[], ['some', 'args']]);
  });

  it('calls the callback with the function name', function() {
    streamProxy.a();
    expect(callback.getCall(0).args).to.deep.equal([['a'], []]);
  });

  it('calls the callback with the function name and arguments', function() {
    streamProxy.a('some', 'args');
    expect(callback.getCall(0).args).to.deep.equal([['a'], ['some', 'args']]);
  });

  it('allows chaining', function() {
    streamProxy.a.b.c('abc', 123).d.e(12);
    expect(callback.getCall(0).args).to.deep.equal([['a', 'b', 'c'], ['abc', 123]]);
    expect(callback.getCall(1).args).to.deep.equal([['d', 'e'], [12]]);
  });
});
