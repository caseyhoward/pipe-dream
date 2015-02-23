module.exports = NpmModuleInstaller;

function NpmModuleInstaller() {
  this.install = function install(moduleName) {
    var npm = require("npm");
    return new Promise(function(resolve, reject) {
      npm.load(function(error) {
        npm.commands.install(moduleName, function (error, data) {
          resolve(require(moduleName));
        });
        npm.on("log", function (message) {
          console.log(message);
        });
      });
    });
  };
}
