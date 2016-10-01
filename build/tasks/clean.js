var gulp = require('gulp');
var paths = require('../paths');
var rimraf = require('gulp-rimraf');
var sequence = require('run-sequence');

gulp.task('clean', function(done) {
  sequence('clean:dist', 'clean:spec', done);
});

gulp.task('clean:dist', function() {
  return gulp.src([paths.output])
    .pipe(rimraf());
});

gulp.task('clean:spec', function() {
  return gulp.src([paths.spec + "**/*.js", paths.spec + "**/*.map"])
    .pipe(rimraf());
});