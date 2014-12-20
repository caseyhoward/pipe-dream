var fileSystem = require('fs-extra');
var expect = require('chai').expect;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var temp = require('temp');
var denodify = require('lie-denodify');
var copy = denodify(fileSystem.copy);

function runTest(preinstalledPlugins, done) {
  preinstalledPlugins.unshift('install', 'gulp', 'harmony-proxy', 'es6-promise');
  temp.mkdir('pipe-dream', function(error, temporaryDirectoryPath) {
    console.log(temporaryDirectoryPath);
    copy('./spec/sandbox/pipedream.js', temporaryDirectoryPath + '/pipedream.js').then(function() {
      return copy('./spec/assets/1.js', temporaryDirectoryPath + '/assets/1.js');
    }).then(function() {
      return copy('./spec/assets/2.js', temporaryDirectoryPath + '/assets/2.js');
    }).then(function() {
      // For some reason exec "works" and "spawn" doesn't. If you know why, please let me know caseyhoward@caseyhoward.com
      var npmProcess = exec('npm ' + preinstalledPlugins.join(' '), {cwd: temporaryDirectoryPath}, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
        setTimeout(function() {
          var nodeProcess = spawn('/usr/bin/env', ['node', '--harmony', 'pipedream.js', process.cwd()], {cwd: temporaryDirectoryPath});
          nodeProcess.stdout.on('data', function(data) { console.log(data.toString()); });
          nodeProcess.on('exit', function(code) {
            if (code != 0) {
              console.log('Failed: ' + code);
            }
            setTimeout(function() {
              fileSystem.readFile(temporaryDirectoryPath + '/dest/all.js', 'utf-8', function(error, data) {
                expect(data).to.equal('1\n\n2\n');
                done();
              });
            }, 1000);
          });
        }, 1000);
        console.log('sleeping 1 second');
      });
    }, function(error) { console.log(error) });
  });
}

describe('pipeDream', function() {
  it('works when the plugins used are already installed', function(done) {
    this.timeout(20000);
    fileSystem.remove('./tmp/all.js', function() {
      runTest(['gulp-concat', 'gulp-jshint'], done);
    });
  });
});

