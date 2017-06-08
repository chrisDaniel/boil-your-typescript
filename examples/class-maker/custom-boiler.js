const boil = require('../../index.js');

/* ---------------------------------
* Required Exports
* Tag and Boil function
* ---------------------------------*/
exports.tag = "classMaker";

exports.boil = function(file, boilOpts){

    let defObj = {}

    if(boilOpts == "defOne"){
      defObj = require('./def-one');
    }
    else if(boilOpts == "defTwo"){
      defObj = require('./def-two');
    }

    if(defObj){

      let tsInterface = new boil.TsInterface(defObj.name);
      
      defObj.fields.forEach(f => {

          let fReq  = f["required"] || false;
          let tsField = new boil.TsField(f.name, f.type, fReq);
          tsInterface.boilProperty(tsField);
      });

      file.boilConstruct(tsInterface);
    }
    return file;
}
