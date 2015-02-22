var fileSystem = require('fs-extra');
var expect = require('chai').expect;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var temp = require('temp');
var denodify = require('lie-denodify');
var copy = denodify(require('ncp').ncp);

function runTest(preinstalledPlugins, done) {
  preinstalledPlugins.unshift('install', 'gulp', 'harmony-proxy', 'es6-promise');
  temp.mkdir('pipe-dream', function(error, temporaryDirectoryPath) {
    var appPath = temporaryDirectoryPath + '/test-app';
    copy('./spec/test-app', appPath).then(function() {
      copy('./index.js', appPath + '/index.js');
    }).then(function() {
      copy('./src', appPath + '/src');
    }).then(function() {
      var npmProcess = exec('npm ' + preinstalledPlugins.join(' '), {cwd: appPath}, function(err, stdout, stderr) {
        // console.log(stdout);
        // console.log(stderr);
        // console.log(err);
        var nodeProcess = exec('node --harmony pipedream.js ' + process.cwd(), {cwd: appPath}, function(err, stdout, stderr) {
          // console.log(stdout);
          // console.log(stderr);
        });

        nodeProcess.on('exit', function(code) {
          if (code != 0) {
            console.log('Failed: ' + code);
          }
          fileSystem.readFile(appPath + '/dest/all.js', 'utf-8', function(error, data) {
            expect(data).to.equal('1\n\n2\n');
            done();
          });
        });
      });
    }, function(error) { console.log(error); });
  });
}

describe('pipeDream', function() {
  it('works when the plugins used are already installed', function(done) {
    this.timeout(20000);
    fileSystem.remove('./tmp/all.js', function() {
      runTest(['gulp-concat', 'gulp-jshint'], done);
    });
  });

  it('works when the plugins used are not installed', function(done) {
    this.timeout(20000);
    fileSystem.remove('./tmp/all.js', function() {
      runTest([], done);
    });
  });
});

