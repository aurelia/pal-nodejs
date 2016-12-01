var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var path = require('path');
var merge = require('merge2');
var sequence = require('run-sequence');

var paths = require('../paths');

gulp.task('build', function (done) {
  sequence('build:source', 'build:spec', done);
});

gulp.task('build:source', function () {
  var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
  });

  var tsResult =
    //hack fix for https://github.com/ivogabe/gulp-typescript/issues/422
    gulp.src([paths.source + '**/*.ts'])
      .pipe(sourcemap.init())
      .pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest(paths.output)),
    tsResult.js
      //hack fix for https://github.com/ivogabe/gulp-typescript/issues/395
      .pipe(sourcemap.write('.', {
        sourceRoot: function (file) {
          var relative = path.relative(file.path, path.normalize(path.join(__dirname, "..", "..", paths.source)));
          var relativeSource = path.join(relative, paths.source)
          return relativeSource;
        }
      }))
      .pipe(gulp.dest(paths.output))
  ]);
});

gulp.task('build:spec', function () {
  var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
  });

  var tsResult =
    gulp.src([paths.spec + '**/*spec.ts'])
      .pipe(sourcemap.init())
      .pipe(tsProject());

  return tsResult.js
    //hack fix for https://github.com/ivogabe/gulp-typescript/issues/395
    .pipe(sourcemap.write('.', {
      sourceRoot: function (file) {
        var relative = path.relative(file.path, path.normalize(path.join(__dirname, "..", "..", paths.spec)));
        var relativeSource = path.join(relative, paths.spec)
        return relativeSource;
      }
    }))
    .pipe(replace(/(require\("\..\/src\/)/g, 'require("..\/dist\/'))
    .pipe(gulp.dest(paths.spec));
});
