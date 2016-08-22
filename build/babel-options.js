var path = require('path');
var paths = require('./paths');

exports.base = function(isTest) {
  var config = {
    filename: '',
    filenameRelative: '',
    sourceMap: true,
    sourceRoot: '',
    moduleRoot: path.resolve('src').replace(/\\/g, '/'),
    moduleIds: false,
    comments: false,
    compact: false,
    code: true,
    presets: [ 'es2015-loose', 'stage-1' ],
    plugins: [
      'syntax-flow',
      'transform-decorators-legacy',
    ]
  };
  if (!paths.useTypeScriptForDTS && !isTest) {
    config.plugins.push(
      ['babel-dts-generator', {
          packageName: paths.packageName,
          typings: '',
          suppressModulePath: true,
          suppressComments: false,
          memberOutputFilter: /^_.*/,
          suppressAmbientDeclaration: true
      }]
    );
  };
  config.plugins.push('transform-flow-strip-types');
  return config;
}

exports.commonjs = function() {
  var options = exports.base();
  options.plugins.push('transform-es2015-modules-commonjs');
  return options;
};

exports.amd = function() {
  var options = exports.base();
  options.plugins.push('transform-es2015-modules-amd');
  return options;
};

exports.system = function() {
  var options = exports.base();
  options.plugins.push('transform-es2015-modules-systemjs');
  return options;
};

exports.es2015 = function() {
  var options = exports.base();
  options.presets = ['stage-1']
  return options;
};

exports['native-modules'] = function() {
  var options = exports.base();
  options.presets[0] = 'es2015-loose-native-modules';
  return options;
}

exports.test = function() {
  var baseOptions = exports.base(true);
  var options = {
    presets: baseOptions.presets,
    plugins: baseOptions.plugins
  };
  return options;
}
