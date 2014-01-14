var through = require('through');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function(fileName, opt){
  if (!fileName) throw new PluginError('gulp-hash',  'Missing fileName option for gulp-hash');
  if (!opt) opt = {};
  if (!opt.newLine) opt.newLine = gutil.linefeed;

  var buffer = [];

  function bufferContents(file){
    if (file.isNull()) return; // ignore
    if (file.isStream()) return this.emit('error', new PluginError('gulp-hash',  'Streaming not supported'));

    buffer.push(file.contents.toString('utf8'));
  }

  function endStream(){
    this.emit('end');
  }

  return through(bufferContents, endStream);
};
