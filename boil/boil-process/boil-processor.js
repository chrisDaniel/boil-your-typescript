const fs = require('fs');
const boiledTags = require('./subs/tags.boiled');
const fsUtils = require('./subs/fs.utils.js');
const extractor = require('./ts-extractor');
const generator = require('./ts-generator');

const Tsf = require('../ts-reflect/ts-file');

/*--------------------------------
* Main Processing function
*---------------------------------*/
module.exports = function(options, cb){

  //--------step - parse file---------//
  let step_parseInFile = function(file, oc){

    file.parse_start();

    extractor.extract(file, rf => {
      file.parse_end();
      oc(rf);
    });
  }

  //--------step - boil file---------//
  let step_runBoilPlugins = function(file){

      //case 1...
      //no boil commands
      let boilCommands = file.boilCommandsUsed;
      if(boilCommands <= 0){
        console.log("Process : No Boil Commands");
        return;
      }

      //case 2...
      //find and run plugins
      file.boil_start();
      boilCommands.forEach(bc => {
        var codeKey = bc.code;
        var plugin = options.getPlugin(codeKey);
        if(plugin) plugin.boil(file, bc.boilOpts);
      });
      file.boil_end();
  }
  let step_generateCode = function(file){
    var content = generator.generateBoiledCode(file);
    fs.writeFileSync(file.outPath, content);
  }

  let files = fsUtils.assembleFiles(options);
  files.forEach(file => {

    console.log("parsing file: " + file.fileName);
    step_parseInFile(file, rf => {
      console.log("boiling file: " + file.fileName);
      step_runBoilPlugins(rf);
      console.log("writing boiled file: " + file.fileName);
      step_generateCode(rf);
    });
    console.log("Process : File Boiled : " + file.fileName);
    console.log("--------------------------");
   });
}
