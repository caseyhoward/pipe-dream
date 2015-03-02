var sinon = require('sinon');
var expect = require('chai').expect;
var Promise = require('es6-promise').Promise;

var StreamProxyCreator = require('../src/stream_proxy_creator');

describe('StreamProxyCreator', function() {
  var streamProxy, callback;

  beforeEach(function() {
    callback = sinon.spy();
    streamProxy = (new StreamProxyCreator()).create(callback);
  });

  it('calls the callback when called directly', function(done) {
    streamProxy();
    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([[], []]);
      done();
    }, 0);
  });

  it('calls the callback with arguments when called directly', function(done) {
    streamProxy('some', 'args');
    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([[], ['some', 'args']]);
      done();
    }, 0);
  });

  it('calls the callback with the function name', function(done) {
    streamProxy.a();
    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([['a'], []]);
      done();
    }, 0);
  });

  it('calls the callback with the function name and arguments', function(done) {
    streamProxy.a('some', 'args');
    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([['a'], ['some', 'args']]);
      done();
    }, 0);
  });

  it('allows chaining', function(done) {
    streamProxy.a.b.c('abc', 123).d.e(12);
    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([['a', 'b', 'c'], ['abc', 123]]);
      expect(callback.getCall(1).args).to.deep.equal([['d', 'e'], [12]]);
      done();
    }, 0);
  });

  it('works with promises', function(done) {
    var promiseAResolve;

    var promiseA = new Promise(function(resolve, reject) {
      promiseAResolve = resolve;
    });

    var callback = sinon.spy(function(callChain, callArguments) {
      if (callChain.length === 1 && callChain[0] === 'a') {
        return promiseA;
      }
    });

    streamProxy = (new StreamProxyCreator()).create(callback);

    streamProxy.a(1).b(2);

    setTimeout(function() {
      expect(callback.getCall(0).args).to.deep.equal([['a'], [1]]);
      expect(callback.calledOnce).to.equal(true);

      promiseAResolve();

      setTimeout(function() {
        expect(callback.getCall(1).args).to.deep.equal([['b'], [2]]);
        done();
      }, 0);
    }, 0);
  });
});
