const fs = require('fs');
const Tsf = require('../../ts-reflect/ts-file');

exports.assembleFiles = function(options, cb) {

  var srcDir = options.srcDir;
  var outDir = options.outDir;

  walk(srcDir, (err, results) =>{

    if(err){
      console.log("file system err : " + err);
      return [];
    };

    var returnData = [];

    results.forEach(file => {
      var relPath = file.substr(srcDir.length);
      var lastSlash = relPath.lastIndexOf("\/");
      var relPostfix = relPath.substr(0, lastSlash);

      var fileName = relPath.substr(lastSlash+1);
      var fileInDir = srcDir + relPostfix;
      var fileOutDir = outDir + relPostfix;

      if (!fs.existsSync(fileOutDir)){
          fs.mkdirSync(fileOutDir);
      }

      var file = new Tsf.TsFile(fileName, fileInDir, fileOutDir);
      returnData.push(file);
    });

    cb(returnData);
  })
}
var walk = function(dir, done) {

  var results = [];

  fs.readdir(dir, function(err, list) {

    if (err) return done(err);
    var i = 0;

    (function next() {

      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;

      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
