var Proxy = require('harmony-proxy');
var gulp = require('gulp');
var GulpPluginRegistry = require('./src/gulp_plugin_registry');

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

function GulpPluginRunner(source, options, gulpPluginRegistry) {
  var stream = gulp.src(source);

  return {
    run: function run(name, arguments) {
      var gulpPlugin = gulpPluginRegistry.get(name);
      if (gulpPlugin) {
        stream = stream.pipe(gulpPlugin.apply(null, arguments));
      } else {
        throw 'Failed to run ' + name + ' plugin';
      }
    }
  };
};
