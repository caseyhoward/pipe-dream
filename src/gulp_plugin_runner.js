var gulp = require('gulp');
var _ = require('lodash');

module.exports = GulpPluginRunner;

function GulpPluginRunner(stream, options, functionChainApplier, gulpPluginRegistry) {
  return {
    run: function run(pluginPath, pluginArguments) {
      if (_.isFunction(stream[pluginPath[0]])) {
        stream = stream[pluginPath[0]].apply(stream, pluginArguments);
      } else {
        return gulpPluginRegistry.get(pluginPath[0]).then(function(gulpPlugin) {
          var gulpPluginResult = functionChainApplier.applyOnObject(gulpPlugin, pluginPath.slice(1), pluginArguments);
          stream = stream.pipe(gulpPluginResult);
        });
      }
    }
  };
};

GulpPluginRunner.create = function(source, options, functionChainApplier, gulpPluginRegistry) {
  return new GulpPluginRunner(source, options, functionChainApplier, gulpPluginRegistry);
};
