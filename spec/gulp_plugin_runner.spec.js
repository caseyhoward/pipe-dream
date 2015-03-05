var FunctionChainApplier = require('../src/function_chain_applier');
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
    this.timeout(10000);

    beforeEach(function() {
      var source = gulp.src('./spec/test-app/assets/**/*.js');
      var options = {};
      concatPluginPromise = new Promise(function(resolve, reject) {
        concatPluginResolve = resolve;
      });
      destPluginPromise = new Promise(function(resolve, reject) {
        destPluginResolve = resolve;
      });
      gulpPluginRegistry = {get: sinon.stub()};
      gulpPluginRunner = new GulpPluginRunner(source, options, new FunctionChainApplier(), gulpPluginRegistry);
      gulpPluginRegistry.get.withArgs('concat').returns(concatPluginPromise);
      gulpPluginRegistry.get.withArgs('dest').returns(destPluginPromise);
    });

    afterEach(function(done) {
      fs.unlink('tmp/all.js', function() {
        done();
      });
    });

    it('runs gulp plugins', function(done) {
      gulpPluginRunner.run(['concat'], ['all.js']).then(function() {
        return gulpPluginRunner.run(['dest'], ['tmp/']);
      }).then(function() {
        Promise.all([concatPluginPromise, destPluginPromise]).then(function() {
          // TODO: Get rid of this setTimeout
          setTimeout(function() {
            fs.readFile('tmp/all.js', function(error, data) {
              if (error) console.log(error);
              expect(data.toString()).to.equal('1\n\n2\n');
              done();
            });
          }, 1000);
        });
      });
      concatPluginResolve(require('gulp-concat'));
      destPluginResolve(gulp.dest);
    });

    it('runs gulp with functions', function(done) {
      gulpPluginRunner.run(['concat'], ['all.js']).then(function() {
        return gulpPluginRunner.run(['dest'], ['tmp/']);
      }).then(function() {
        Promise.all([concatPluginPromise, destPluginPromise]).then(function() {
          // TODO: Get rid of this setTimeout
          setTimeout(function() {
            fs.readFile('tmp/all.js', function(error, data) {
              if (error) console.log(error);
              expect(data.toString()).to.equal('1\n\n2\n');
              done();
            });
          }, 1000);
        });
      });
      concatPluginResolve(require('gulp-concat'));
      destPluginResolve(gulp.dest);
    });
  });
});

