const Tsc = require('../../ts-reflect/ts-constructs');
const Tsp = require('../../ts-reflect/ts-props');

/* ---------------------------------
* Required Exports
* Tag and Boil function
* ---------------------------------*/
exports.tag = "setters";

exports.boil = function(file, boilOpts){

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
      var setterName = "set " + useName;

      var sf = new Tsp.TsFunction(setterName);
      sf.scope = "public";

      var sfa = new Tsp.TsFunctArg(useName);
      sfa.type = fp.type;
      sf.args = [sfa];

      var bfl = "this" + "." + fp.name + "=" + useName + ";";
      sf.body = [bfl];

      cons.boilProperty(sf);
    });
  });

  return file;
};
