var gulp = require('gulp');

module.exports = GulpPluginRunner;

function GulpPluginRunner(source, options, gulpPluginRegistry) {
  var stream = gulp.src(source);

  return {
    run: function run(name, pluginArguments) {
      return gulpPluginRegistry.get(name).then(function(gulpPlugin) {
        if (gulpPlugin) {
          try {
            stream = stream.pipe(gulpPlugin.apply(null, pluginArguments));
          } catch (error) {
            console.error(error);
            throw error;
          }
        } else {
          throw 'Failed to run ' + name + ' plugin';
        }
      });
    }
  };
};

GulpPluginRunner.create = function(source, options, gulpPluginRegistry) {
  return new GulpPluginRunner(source, options, gulpPluginRegistry);
};
