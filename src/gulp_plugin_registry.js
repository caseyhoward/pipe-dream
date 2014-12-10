var gulp = require('gulp');

function promptUserToInstall(gulpPluginName) {
  console.log(gulpPluginName + ' not installed. Install now? (Y/n)');
}

module.exports = function GulpPluginRegistry(options) {
  var plugins = {};
  plugins.dest = gulp.dest;
  options = options || {};

  return {
    get: function(name) {
      var gulpPluginName = 'gulp-' + name;
      var shouldAttemptToInstall;

      if (!plugins[name]) {
        try {
          console.log('require ' + gulpPluginName);
          plugins[name] = require(gulpPluginName);
          console.log('success');
        } catch (error) {
          if (typeof options.autoInstall === 'undefined') {
            shouldAttemptToInstall = promptUserToInstall(gulpPluginName, function() {

            });
          } else {
            shouldAttemptToInstall = options['autoInstall'];
          }
          if (shouldAttemptToInstall) {
            installNpmModule(gulpPluginName);
            plugins[name] = require(gulpPluginName);
          }
        }
      }
      return plugins[name];
    },
    remove: function(name) {
      plugins[name] = undefined;
    }
  };
};
