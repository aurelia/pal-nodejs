var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var paths = require('../paths');

/**
 * Run test once and exit
 */
gulp.task('test', () => {
  return gulp.src([paths.spec + "**/*.js" ])
    .pipe(jasmine({
      verbose: true,
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

