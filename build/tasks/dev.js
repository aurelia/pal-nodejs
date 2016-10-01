var gulp = require('gulp');
var tools = require('aurelia-tools');
var sequence = require('run-sequence');

gulp.task('update-own-deps', function(){
  tools.updateOwnDependenciesFromLocalRepositories();
});

gulp.task('build-dev-env', function () {
  tools.buildDevEnv();
});

gulp.task('dev:pre-debug', ["clean"], function (done) {
  sequence('build', done);
});

gulp.task('dev:debug', function (done) {
  sequence('test', done);
});
