var Proxy = require('harmony-proxy');
var Promise = require('es6-promise').Promise;

module.exports = function StreamProxyCreator() {
  this.create = function(callback) {
    var callChain = [];
    var promise = new Promise(function(resolve) { resolve(); });

    var proxy = new Proxy(function() {}, {
      apply: function(target, name, argumentList) {
        var callChainCopy = callChain.slice();
        promise = promise.then(function() {
          return callback(callChainCopy, argumentList);
        });
        callChain = [];
        return proxy;
      },
      get: function(target, property, receiver) {
        callChain.push(property);
        return proxy;
      }
    });

    return proxy;
  };
}
