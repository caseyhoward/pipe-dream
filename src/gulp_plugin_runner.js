var gulp = require('gulp');

module.exports = GulpPluginRunner;

function GulpPluginRunner(source, options, gulpPluginRegistry) {
  var stream = gulp.src(source);

  return {
    run: function run(pluginPath, pluginArguments) {
      return gulpPluginRegistry.get(pluginPath[0]).then(function(gulpPlugin) {
        stream = stream.pipe(gulpPlugin.apply(null, pluginArguments));
      });
    }
  };
};

GulpPluginRunner.create = function(source, options, gulpPluginRegistry) {
  return new GulpPluginRunner(source, options, gulpPluginRegistry);
};
