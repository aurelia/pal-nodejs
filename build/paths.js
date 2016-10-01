var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

module.exports = {
  source: "src/",
  output: 'dist/',
  doc:'doc/',
  packageName: pkg.name,
  spec: 'spec/',
};
