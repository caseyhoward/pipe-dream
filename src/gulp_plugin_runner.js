var gulp = require('gulp');

module.exports = GulpPluginRunner;

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
