require("babel-register")(require('../babel-options').test());
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var paths = require('../paths');

/**
 * Run test once and exit
 */
gulp.task('test', () => {
  gulp.src([paths.source, paths.specsSrc])
    .pipe(jasmine({
      includeStackTrace: true
   }));
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', () => {
  // TODO
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', () => {
  // TODO
});

