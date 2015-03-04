var Promise = require('es6-promise').Promise;

module.exports = NpmModuleInstaller;

function NpmModuleInstaller() {
  this.install = function install(moduleName) {
    var npm = require("npm");
    return new Promise(function(resolve, reject) {
      npm.load({"save-dev": true}, function(error) {
        if (error) {
          reject(error);
        } else {
          npm.commands.install([moduleName], function(error, data) {
            if (error) {
              reject(error);
            } else {
              resolve(require(moduleName));
            }
          });
        }
        npm.on("log", function (message) {
          console.log(message);
        });
      });
    });
  };
}
