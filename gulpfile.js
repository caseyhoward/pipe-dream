var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
  gulp.src('spec/**/*.spec.js', {read: false}).pipe(mocha());
});

gulp.task('watch', ['default'], function() {
  gulp.watch(['spec/**/*.js'], ['default']);
  gulp.watch(['src/**/*.js'], ['default']);
});
