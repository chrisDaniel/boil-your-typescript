const Tsc = require('../../ts-reflect/ts-constructs');
const Tsp = require('../../ts-reflect/ts-props');


/* ---------------------------------
* Required Exports
* Tag and Boil function
* ---------------------------------*/
module.exports.tag = "getters";

module.exports.boil = function(file, boilOpts){

  var content = "";

  //find the constructs we need a bulder for
  file.constructs
  .filter(construct =>{
    return Tsc.TsClass.isInstance(construct);
  })
  .forEach(cons => {

    var consOpts = cons.findBoilCommandByTag("getters");
    if(!consOpts){
      return;
    }
    cons.props.filter(consProp => {
      return Tsp.TsField.isInstance(consProp);
    })
    .forEach(fp => {
      var useName = fp.name.substr(1);
      var getterName = "get " + useName;

      var gf = new Tsp.TsFunction(getterName);
      gf.type = fp.type;
      gf.scope = "public";

      var bfl = "return this" + "." + fp.name + ";";
      gf.body = [bfl];

      cons.boilProperty(gf);
    });
  });

  return file;
};
