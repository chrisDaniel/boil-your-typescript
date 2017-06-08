const fs = require('fs');

const tagsBoiled = require('../commons/tags.boiled.js');
const strUtils = require('../commons/str.utils');

const Bc  = require('../ts-reflect/ts-boil-command');
const Tsf = require('../ts-reflect/ts-file');
const Tsc = require('../ts-reflect/ts-constructs');
const Tsp = require('../ts-reflect/ts-props');

/* -----------------------------------*
* The Main Extract function
*
* ----------------------------------- */
const B_RegExStart = tagsBoiled.getRegExOpenTag();
const B_RegExEnd = tagsBoiled.getRegExClosedTag();
const B_CommandRegEx = /(^.*)\@Boil\((.*)\)/;    //--> boil commands = $1

const I_RegEx = /(^.*)interface\s+(\w+)(\s?.*)$/;  //--> name = $2
const C_RegEx = /(^.*)class\s+(\w+)(\s?.*)$/;      //--> name = $2

const F_RegEx = /(\w+)\s?:(.*);/;   //--> name = $1, type =$2 (need to trim)

exports.extract = function(file, cb){

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file.srcPath)
  });

  lineReader.on('line', line => {
    processFile_line(line, file);
  });

  lineReader.on('close', () => {
    process.nextTick(() => cb(file));
  });
}
processFile_line = function(line, file){

    //check 1...
    //are we inside a "boiled" code block
    if(line.match(B_RegExStart)){
      file.insideBoiled = true;
      return;
    }
    if(line.match(B_RegExEnd)){
      file.insideBoiled = false;
      return;
    }
    if(file.insideBoiled){
      return;
    }

    //step 2...
    //process source code ... handle new constructs
    file.parse_pushSrcCd(line);
    if(line.match(B_CommandRegEx)){
       var command = line.replace(B_CommandRegEx, '$2');
       var bc = new Bc.TsBoilCommand(command);
       file.parse_pushBoilCommand(bc);
       return;
    }
    if(line.match(I_RegEx)){
       var name = line.replace(I_RegEx, '$2');
       var i = new Tsc.TsInterface(name);
       file.parse_pushConstruct(i);
       return;
    }
    if(line.match(C_RegEx)){
       var name = line.replace(C_RegEx, '$2');
       var c = new Tsc.TsClass(name);
       file.parse_pushConstruct(c);
       return;
    }
    if(line.match(F_RegEx)){

      var fieldName = line.replace(F_RegEx, '$1');
      fieldName = strUtils.trim(fieldName);
      var fieldType = line.replace(F_RegEx, '$2');
      fieldType = strUtils.trim(fieldType);

      var f = new Tsp.TsField(fieldName, fieldType);
      file.parse_pushProp(f);
      return;
    }
}
