var gulp = require('gulp');

function promptUserToInstall(gulpPluginName) {
  console.log(gulpPluginName + ' not installed. Install now? (Y/n)');
}

function installNpmModule(moduleName) {
  var npm = require("npm");
  npm.load(function (err) {
    npm.commands.install([moduleName], function (er, data) {
      // log the error or data
    });
    npm.on("log", function (message) {
      console.log(message);
    });
  });
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
          plugins[name] = require(gulpPluginName);
        } catch (error) {
          console.log(error);
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
