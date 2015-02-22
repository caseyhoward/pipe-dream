var Proxy = require('harmony-proxy');
var GulpPluginRegistry = require('./src/gulp_plugin_registry');
var GulpPluginRunner = require('./src/gulp_plugin_runner');

module.exports = pipeDream;

function pipeDream(globString, options) {
  var object = {};
  var gulpPluginRegistry = new GulpPluginRegistry(options);
  var gulpPluginRunner = new GulpPluginRunner(globString, options, gulpPluginRegistry);
  pipeDream.registry = gulpPluginRegistry;

  var proxy = new Proxy(object, {
    get: function(target, name, receiver) {
      return function() {
        // TODO: Find out exactly why this hack is needed. It looks like gulp maybe calls 'then' on the return value of tasks to see if they are promises.
        if (name === 'then') return;
        gulpPluginRunner.run(name, arguments);
        return proxy;
      };
    }
  });

  return proxy;
};
