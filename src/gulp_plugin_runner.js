var gulp = require('gulp');

module.exports = GulpPluginRunner;

function GulpPluginRunner(source, options, functionChainApplier, gulpPluginRegistry) {
  var stream = gulp.src(source);

  return {
    run: function run(pluginPath, pluginArguments) {
      return gulpPluginRegistry.get(pluginPath[0]).then(function(gulpPlugin) {
        var gulpPluginResult = functionChainApplier.applyOnObject(gulpPlugin, pluginPath.slice(1), pluginArguments);
        stream = stream.pipe(gulpPluginResult);
      });
    }
  };
};

GulpPluginRunner.create = function(source, options, functionChainApplier, gulpPluginRegistry) {
  return new GulpPluginRunner(source, options, functionChainApplier, gulpPluginRegistry);
};
