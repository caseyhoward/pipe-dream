var gulp = require('gulp');
var Promise = require('es6-promise').Promise;

module.exports = function GulpPluginRegistry(npmModuleInstaller, requireFunction) {
  var plugins = {};
  plugins.dest = gulp.dest;

  return {
    get: function(name) {
      var gulpPluginName = 'gulp-' + name;

      var promise = new Promise(function(resolve, reject) {
        if (plugins[name]) {
          resolve(plugins[name]);
        } else {
          try {
            plugins[name] = requireFunction(gulpPluginName);
            resolve(plugins[name]);
          } catch (error) {
            npmModuleInstaller.install(gulpPluginName).then(function(plugin) {
              plugins[name] = plugin;
              resolve(plugins[name]);
            });
          }
        }
      });
      return promise;
    }
  };
};
