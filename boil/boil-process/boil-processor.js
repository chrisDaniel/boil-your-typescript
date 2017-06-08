const fs = require('fs');
const boiledTags = require('./subs/tags.boiled');
const fsUtils = require('./subs/fs.utils.js');
const extractor = require('./ts-extractor');
const generator = require('./ts-generator');

const Tsf = require('../ts-reflect/ts-file');

/*--------------------------------
* Main Processing function
*---------------------------------*/
module.exports.process = function(options){

  fsUtils.assembleFiles(options, files => {
    files.forEach(file => {
      processor_doFile(file);
    });
  });
}
processor_doFile = function(file){

  step_parseInFile(file, rf => {

    console.log("--------------------------");
    console.log("Process : Parsing File : " + file.fileName);
    help_logFile(file);
    console.log("\n");

    console.log("Process : Boiling : " + file.fileName);
    step_runBoilPlugins(rf);
    help_logFile(file);

    console.log("Process : Writing Out : " + file.fileName);
    step_generateCode(rf);

    console.log("Process : File Boiled : " + file.fileName);
    console.log("--------------------------");
  });
}
step_parseInFile = function(file, oc){

  file.parse_start();

  extractor.extract(file, rf => {
    file.parse_end();
    oc(rf);
  });
}
step_runBoilPlugins = function(file){

    //case 1...
    //no boil commands
    let boilCommands = file.boilCommandsUsed;
    if(boilCommands <= 0){
      console.log("Process : No Boil Commands");
      return;
    }

    //case 2...
    //find and run plugins
    var options = require('../commons/Options').getCurrent();

    file.boil_start();
    boilCommands.forEach(bc => {
      var codeKey = bc.code;
      var plugin = options.getPlugin(codeKey);
      if(plugin){
        console.log("Process : Boil Plugin - " + codeKey);
        plugin.boil(file, bc.boilOpts);
      }
    });
    file.boil_end();
}
step_generateCode = function(file){

  var content = generator.generateBoiledCode(file);

  try{
    fs.writeFileSync(file.outPath, content);
  }
  catch(err){
    console.error("Process : " + "Write Failure : " + err);
  }
}


/*-------------------
* Helpers
*---------------------*/
help_logFile = function(file){
  if(1==1) return;
  console.log("File State: " );
  console.log(JSON.stringify(file, null, 4));
}
