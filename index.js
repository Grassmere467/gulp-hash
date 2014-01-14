var through = require('through');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var sha1 = require('sha1');


module.exports = function(fileName, opt){
  if (!fileName) throw new PluginError('gulp-hash',  'Missing fileName option for gulp-hash');
  if (!opt) opt = {};
  if (!opt.newLine) opt.newLine = gutil.linefeed;

  var objects = [];
    var firstFile = null;

  function bufferContents(file){
    if (file.isNull()) return; // ignore
    if (file.isStream()) return this.emit('error', new PluginError('gulp-hash',  'Streaming not supported'));
    //console.log(JSON.stringify(file));
    //console.log(file.path);

    if (!firstFile) firstFile = file;

    var extName = path.extname(file.path);
    var fileName = path.basename(file.path, extName);
    var hash = sha1(fileName);


    obj = {
        base: file.base,
        path: file.path,
        filename: fileName,
        extension: extName,
        newFilename: fileName + hash + extName 
    };

    objects.push(obj);
  }

  function endStream(){
    //console.log(JSON.stringify(objects));  

    var assetsFile = new File({
        cwd: firstFile.cwd,
        base: firstFile.base,
        path: path.join(firstFile.base, fileName),
        contents: new Buffer(JSON.stringify(objects))   
    }); 

    this.emit('data', assetsFile);
    this.emit('end');
  }

  return through(bufferContents, endStream);
};
