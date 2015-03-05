var GulpPluginRegistry = require('../src/gulp_plugin_registry');
var gulp = require('gulp');
var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('es6-promise').Promise;

describe('GulpPluginRegistry', function() {
  var gulpPluginRegistry, requireStub;

  describe('#get', function() {
    beforeEach(function() {
      requireStub = sinon.stub();
      npmModuleInstaller = {install: sinon.stub()};
      gulpPluginRegistry = new GulpPluginRegistry(npmModuleInstaller, requireStub);
    });

    it('returns dest', function(done) {
      gulpPluginRegistry.get('dest').then(function(gulpDest) {
        expect(gulpDest).to.equal(gulp.dest);
        done();
      });
    });

    it('returns plugins that are installed', function(done) {
      var somePlugin = 'some plugin';
      requireStub.withArgs('gulp-some-plugin').returns(somePlugin);
      gulpPluginRegistry.get('somePlugin').then(function(actualSomePlugin) {
        expect(actualSomePlugin).to.equal(somePlugin);
        done();
      });
    });

    it('attempts to install non existing plugins', function(done) {
      var somePlugin = 'some plugin';
      var installPromise = new Promise(function(resolve, reject) {
        installResolve = resolve;
      });

      requireStub.withArgs('gulp-some-plugin').throws();
      npmModuleInstaller.install.withArgs('gulp-some-plugin').returns(installPromise);
      gulpPluginRegistry.get('some-plugin').then(function(actualSomePlugin) {
        expect(actualSomePlugin).to.equal(somePlugin);
        done();
      });
      installResolve(somePlugin);
    });
  });
});
