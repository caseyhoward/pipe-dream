var gulp = require('gulp');
var Proxy = require('harmony-proxy');
var Promise = require('es6-promise').Promise;

var GulpPluginRunner = require('./gulp_plugin_runner');
var StreamProxyCreator = require('./stream_proxy_creator');

module.exports = PipeDreamCreator;

function PipeDreamCreator(gulpPluginRegistry, functionChainApplier, streamProxyCreator) {
  streamProxyCreator = streamProxyCreator || new StreamProxyCreator();
  this.create = function(globString, options) {
    gulpPluginRunner = GulpPluginRunner.create(globString, options, functionChainApplier, gulpPluginRegistry);
    return streamProxyCreator.create(function(callChain, callArguments) {
      // if (callChain[callChain.length - 1] !== 'then') {
        return gulpPluginRunner.run(callChain, callArguments);
      // }
    });
  };
};
