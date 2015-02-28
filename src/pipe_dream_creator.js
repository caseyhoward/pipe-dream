var Proxy = require('harmony-proxy');
var GulpPluginRunner = require('./gulp_plugin_runner');
var Promise = require('es6-promise').Promise;

module.exports = PipeDreamCreator;

function PipeDreamCreator(gulpPluginRegistry) {
  this.create = function(globString, options) {
    var object = {};
    var gulpPluginRunner = GulpPluginRunner.create(globString, options, gulpPluginRegistry);
    var lastCommand = new Promise(function(resolve) { resolve(); });

    var proxy = new Proxy(object, {
      get: function(target, name, receiver) {
        return function() {
          var pluginArguments = Array.prototype.slice.call(arguments);

          // TODO: Find out exactly why this hack is needed.
          // It looks like gulp maybe calls 'then' on the return value of tasks to see if they are promises.
          if (name === 'then') return;

          lastCommand = lastCommand.then(function() {
            return gulpPluginRunner.run(name, pluginArguments);
          });

          return proxy;
        };
      }
    });

    return proxy;
  };
};

