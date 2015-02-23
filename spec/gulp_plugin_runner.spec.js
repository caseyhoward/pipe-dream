var GulpPluginRegistry = require('../src/gulp_plugin_registry');
var GulpPluginRunner = require('../src/gulp_plugin_runner');
var gulp = require('gulp');
var expect = require('chai').expect;
var fs = require('fs');
var sinon = require('sinon');
var Promise = require('es6-promise').Promise;

describe('GulpPluginRunner', function() {
  var gulpPluginRegistry, gulpPluginRunner, concatPluginPromise, destPluginPromise, concatPluginResolve, destPluginResolve;

  describe('#run', function() {
    beforeEach(function() {
      var source = './spec/test-app/assets/**/*.js';
      var options = {};
      concatPluginPromise = new Promise(function(resolve, reject) {
        concatPluginResolve = resolve;
      });
      destPluginPromise = new Promise(function(resolve, reject) {
        destPluginResolve = resolve;
      });
      gulpPluginRegistry = {get: sinon.stub()};
      gulpPluginRunner = new GulpPluginRunner(source, options, gulpPluginRegistry);
      gulpPluginRegistry.get.withArgs('concat').returns(concatPluginPromise);
      gulpPluginRegistry.get.withArgs('dest').returns(destPluginPromise);
    });

    it('runs gulp plugins', function(done) {
      this.timeout = 10000;
      gulpPluginRunner.run('concat', ['all.js']);
      gulpPluginRunner.run('dest', ['tmp/']);
      Promise.all([concatPluginPromise, destPluginPromise]).then(function() {
        expect(fs.readFileSync('tmp/all.js').toString()).to.equal('1\n\n2\n');
        done();
      });
      concatPluginResolve(require('gulp-concat'));
      destPluginResolve(require('gulp').dest);
    });
  });
});

