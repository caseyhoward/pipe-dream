var FunctionChainApplier = require('./src/function_chain_applier');
var GulpPluginRegistry = require('./src/gulp_plugin_registry');
var PipeDreamCreator = require('./src/pipe_dream_creator');
var NpmModuleInstaller = require('./src/npm_module_installer');

var npmModuleInstaller = new NpmModuleInstaller();
var gulpPluginRegistry = new GulpPluginRegistry(npmModuleInstaller, require);
var functionChainApplier = new FunctionChainApplier();

module.exports = (new PipeDreamCreator(gulpPluginRegistry, functionChainApplier)).create;
