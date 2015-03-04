var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
  gulp.src('spec/**/*.spec.js', {read: false}).pipe(mocha()).on('error', gulpUtil.log);
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['spec/**/*.js'], ['default']);
  gulp.watch(['src/**/*.js'], ['default']);
});
