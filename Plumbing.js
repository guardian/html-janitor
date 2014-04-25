var all       = require('plumber-all');
// var bower     = require('plumber-bower');
var glob      = require('plumber-glob');
var requirejs = require('plumber-requirejs');
var uglifyjs  = require('plumber-uglifyjs')();
var write     = require('plumber-write');
var traceur   = require('plumber-traceur');

module.exports = function (pipelines) {
  var requireJSConfig = {
      // FIXME: auto?
      preserveLicenseComments: false
  };

  var toBuildDir = write('./build');
  pipelines['build:es6'] = [
    // TODO: use bower operation to find main of this component?
    // As per: https://github.com/bower/bower/issues/1090
    // bower('html-janitor'),
    glob('./src/html-janitor.js'),
    traceur(),
    // Back to the world of Grunt!
    write('./build/temp')
  ];

  pipelines['build:rjs'] = [
    // This re-reads from disk, which breaks everything. Hence the multple
    // pipelines.
    glob('./build/temp/html-janitor.js'),
    requirejs(requireJSConfig),
    // Send the resource along these branches
    all(
      [uglifyjs, toBuildDir],
      toBuildDir
    )
  ];
};
