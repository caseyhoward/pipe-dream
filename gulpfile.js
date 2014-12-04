var guzzle = require('guzzle');
var gulp = require('gulp');

guzzle.register('mocha');

gulp.task('default', function() {
  guzzle.src('spec/**/*.spec.js', {read: false}).mocha();
});

guzzle.task('watch', ['default'], function() {
  gulp.watch(['spec/**/*.js'], ['default']);
  gulp.watch(['src/**/*.js'], ['default']);
});
