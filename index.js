var Proxy = require('harmony-proxy');
var gulp = require('gulp');

module.exports = function(globString, options) {
  var gulpPluginRegistry = GulpPluginRegistry();
  var gulpPluginRunner = new GulpPluginRunner(globString, options, gulpPluginRegistry);
  var object = {};

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

function GulpPluginRegistry(options) {
  var plugins = {};
  plugins.dest = gulp.dest;
  options = options || {};

  return {
    get: function(name) {
      var gulpPluginName = 'gulp-' + name;
      var shouldAttemptToInstall;

      if (!plugins[name]) {
        plugins[name] = require(gulpPluginName);
      }
      return plugins[name];
    }
  };
};
