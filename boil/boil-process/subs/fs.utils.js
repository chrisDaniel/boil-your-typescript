const fs = require('fs');
const Tsf = require('../../ts-reflect/ts-file');

exports.assembleFiles = function(options) {

  let srcDir = options.srcDir;
  let outDir = options.outDir;
  let returnData = [];

  let toExpand = [srcDir];
  let files = [];

  while(toExpand.length > 0) {

    let currDir = toExpand.pop();
    let genDir = currDir.replace(srcDir, outDir);
    console.log("****currDir: " + currDir + " -> " + genDir);
    let contents = fs.readdirSync(currDir);

    contents.forEach(name => {
      let fullPath = currDir + '/' + name;
      let stat = fs.statSync(fullPath);
      let finalPath = fullPath.replace(srcDir, outDir);

      if(stat && stat.isDirectory()){
        if(!fs.existsSync(finalPath)){
          fs.mkdirSync(finalPath);
        }
        toExpand.push(fullPath)
      }
      else if(stat && stat.isFile()){
        console.log("****found file: " + name);
        var file = new Tsf.TsFile(name, currDir, genDir);
        files.push(file);
      }
    });
  }
  return files;
}
