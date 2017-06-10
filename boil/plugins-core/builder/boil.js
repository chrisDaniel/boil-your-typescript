const Tsc = require('../../ts-reflect/ts-constructs');
const Tsp = require('../../ts-reflect/ts-props');


/* ---------------------------------
* Required Exports
* Tag and Boil function
* ---------------------------------*/
module.exports.tag = "builder";

exports.boil = function(file, boilOpts){

  var content = "";

  //find the constructs we need a bulder for
  file.constructs.forEach(cons => {

    var consOpts = cons.findBoilCommandByTag("builder");
    if(!consOpts){
      return;
    }

    var builderClassName = "Builder";
    var builderClassRef = cons.name + "." + builderClassName;

    //Step 1...
    //Main Entry Methods
    var mbf = new Tsp.TsFunction("builder");
    mbf.type = builderClassRef;
    mbf.body = [];
    mbf.body.push("return new " + builderClassRef + "();");
    mbf.namespace = cons.name;
    file.boilProperty(mbf);


    var mcf = new Tsp.TsFunction("clone", builderClassRef);
    var mcfa = new Tsp.TsFunctArg("toClone");
    mcfa.type = cons.name;
    mcf.args = [mcfa];
    mcf.body = [];
    mcf.body.push("return new " + builderClassRef + "(toClone);");
    mcf.namespace = cons.name;
    file.boilProperty(mcf);

    //Step 2....
    //The builder class
    var bCons = new Tsc.TsClassConstructor();
    var bConsArg = new Tsp.TsFunctArg("seed");
    bConsArg.defVal = "{}";
    bCons.args = [bConsArg];
    bCons.body = [];
    bCons.body.push("this.m = seed;");

    var bClass = new Tsc.TsClass(builderClassName);
    bClass.namespace = cons.name;
    bClass.cons = bCons;

    var bprop = new Tsp.TsField("m");
    bClass.boilProperty(bprop);

    file.boilConstruct(bClass);

    //prop methods
    cons.props
    .filter(consProp => {
      return Tsp.TsField.isInstance(consProp);
    })
    .forEach(consProp => {
      var bf = new Tsp.TsFunction(consProp.name);
      bf.type = builderClassRef;

      var bfa = new Tsp.TsFunctArg(consProp.name);
      bfa.type = consProp.type;
      bf.args = [bfa];

      var bfl1 = "this.m." + consProp.name + "=" + consProp.name + ";";
      var bfl2 = "return this;";
      bf.body = [bfl1, bfl2];
      bClass.boilProperty(bf);
    });

    //build method
    var buildF = new Tsp.TsFunction("build");
    buildF.type = cons.name;
    var buildFl1 = "return this.m;";
    buildF.body = [buildFl1];
    bClass.boilProperty(buildF);
  });

  return file;
}
