var gulp = require('gulp');
var typescriptFormatter = require('gulp-typescript-formatter');

var paths = require('../paths');

function format(sourcePattern, targetDir) {
  return gulp.src(sourcePattern)
    .pipe(typescriptFormatter({
      baseDir: '.',
      tslint: true, // use tslint.json file ?
      editorconfig: true, // use .editorconfig file ?
      tsfmt: true, // use tsfmt.json ?
    }))
    .pipe(gulp.dest(targetDir));
}

gulp.task('format:sources', function () {
  return format(paths.source + '**/*.ts', paths.source);
});

gulp.task('format:specs', function () {
  return format(paths.spec + '**/*.ts', paths.spec);
});

gulp.task('format', ['format:sources', 'format:specs'], function () { });
