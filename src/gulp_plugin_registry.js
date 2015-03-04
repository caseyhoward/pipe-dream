var gulp = require('gulp');
var Promise = require('es6-promise').Promise;
var prompt = require('prompt');

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
            prompt.start();

            prompt.get({
              properties: {
                install: {
                  description: (gulpPluginName + ' not installed. Install now (Y/n)').green
                }
              }
            }, function (err, result) {
              if (result.install === 'y' || result.install === 'Y' || result.install === '') {
                npmModuleInstaller.install(gulpPluginName).then(function(plugin) {
                  plugins[name] = plugin;
                  resolve(plugins[name]);
                }, reject)
              } else {
                throw error;
              }
            });
          }
        }
      });
      return promise;
    }
  };
};
