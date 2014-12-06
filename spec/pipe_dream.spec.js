var pipeDream = require('../index.js');
var fileSystem = require('fs');
var expect = require('chai').expect;

describe('pipeDream', function() {
  it('works when the plugins used are already installed', function(done) {
    fileSystem.readFile('./tmp/all.js', 'utf-8', function(error, data) {
      expect(data).to.equal('1\n\n2\n');
      done();
    });
  });
});

