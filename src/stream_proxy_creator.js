var Proxy = require('harmony-proxy');

module.exports = function StreamProxyCreator() {
  this.create = function(callback) {
    var callChain = [];

    var proxy = new Proxy(function() {}, {
      apply: function(target, name, argumentList) {
        callback(callChain, argumentList);
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
