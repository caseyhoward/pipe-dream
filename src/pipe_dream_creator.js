var Proxy = require('harmony-proxy');
var GulpPluginRunner = require('./gulp_plugin_runner');
var Promise = require('es6-promise').Promise;
var gulp = require('gulp');

module.exports = PipeDreamCreator;

function PipeDreamCreator(gulpPluginRegistry, streamProxyCreator) {
  streamProxyCreator = streamProxyCreator || new StreamProxyCreator();
  this.create = function(globString, options) {
    var stream = gulp.src(globString);
    return streamProxyCreator.create(stream, {}, function(functionName) {
      // TODO: Find out exactly why this hack is needed.
      // It looks like gulp maybe calls 'then' on the return value of tasks to see if they are promises.
      if (functionName !== 'then') {
        return gulpPluginRegistry.get(functionName);
      }
    });
  };
};

function StreamProxyCreator() {
  this.create = function(stream, options, callback) {
    var object = {};
    var lastCommand = new Promise(function(resolve) { resolve(); });

    var proxy = new Proxy(object, {
      get: function(target, name, receiver) {
        return function() {
          var pluginArguments = Array.prototype.slice.call(arguments);

          lastCommand = lastCommand.then(function() {
            return callback(name).then(function(plugin) {
              stream = stream.pipe(plugin.apply(null, pluginArguments));
            });
          });

          return proxy;
        };
      }
    });

    return proxy;
  };
}
