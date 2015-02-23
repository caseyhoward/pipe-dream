var Proxy = require('harmony-proxy');
var GulpPluginRegistry = require('./src/gulp_plugin_registry');
var GulpPluginRunner = require('./src/gulp_plugin_runner');
var NpmModuleInstaller = require('./src/npm_module_installer');
var Promise = require('es6-promise').Promise;

module.exports = pipeDream;

function pipeDream(globString, options) {
  var object = {};
  var npmModuleInstaller = new NpmModuleInstaller();
  var gulpPluginRegistry = new GulpPluginRegistry(npmModuleInstaller, require);
  var gulpPluginRunner = new GulpPluginRunner(globString, options, gulpPluginRegistry);
  pipeDream.registry = gulpPluginRegistry;
  var lastCommand = new Promise(function(resolve) { resolve(); });

  var proxy = new Proxy(object, {
    get: function(target, name, receiver) {
      return function() {
        // TODO: Find out exactly why this hack is needed. It looks like gulp maybe calls 'then' on the return value of tasks to see if they are promises.
        var pluginArguments = arguments;
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
