var PipeDreamCreator = require('../src/pipe_dream_creator');
var GulpPluginRunner = require('../src/gulp_plugin_runner');
var sinon = require('sinon');
var Promise = require('es6-promise').Promise;
var expect = require('chai').expect;

describe('PipeDreamCreator', function() {
  var pipeDreamCreator, gulpPluginRegistry, gulpPluginRunner, npmModuleInstaller;
  var concatResolve, destResolve, concatPromise, destPromise;
  var concatPromise = new Promise(function(resolve, reject) {
    concatResolve = resolve;
  }).then(function() {
    console.log('hi');
  });
  var destPromise = new Promise(function(resolve, reject) {
    destResolve = resolve;
  });

  beforeEach(function() {
    gulpPluginRegistry = 'gulpPluginRegistry stub';
    gulpPluginRunner = {
      run: function(callChain, pluginArguments) {
        console.log(callChain, pluginArguments);
        if (callChain[0] === 'concat' && pluginArguments.length === 1 && pluginArguments[0] === 'all.js') {
          return concatPromise;
        } else if (callChain[0] === 'dest' && pluginArguments.length === 1 && pluginArguments[0] === 'tmp') {
          return destPromise;
        } else {
          throw "invalid arguments";
        }
      }
    };
    concatPromise = new Promise(function(resolve, reject) {
      concatResolve = resolve;
    });
    destPromise = new Promise(function(resolve, reject) {
      destResolve = resolve;
    });
    gulpPluginRunner.run = sinon.spy(gulpPluginRunner, 'run');
    sinon.stub(GulpPluginRunner, 'create').withArgs('src/*.js', {some: 'option'}, gulpPluginRegistry).returns(gulpPluginRunner);
    pipeDreamCreator = new PipeDreamCreator(gulpPluginRegistry);
    pipeDream = pipeDreamCreator.create('src/*.js', {some: 'option'});
  });

  afterEach(function() {
    GulpPluginRunner.create.restore();
    sinon.restore();
  });

  xit('calls plugins sequentially', function(done) {
    pipeDream.concat('all.js').dest('tmp');

    setTimeout(function() {
      concatPromise.then(function() {
        expect(gulpPluginRunner.run.withArgs(['concat'], ['all.js']).called).to.equal(true);
        expect(gulpPluginRunner.run.withArgs(['dest'], ['tmp']).called).to.equal(true);
        done();
      });
    }, 0);

    concatResolve();
  });
});
