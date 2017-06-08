/* ----------------------------------
*  Properties
*  Typescript property and attribute types
*  i.e. fields, functions
* -----------------------------------*/
class TsProp{

    constructor(name, brx){

      //decl props
      this.brx = brx;
      this.name = name;
      this.namespace = null;

      //boil commands
      this.boilCommands = [];
    }
    pushBoilCommand(bc){
      this.boilCommands.push(bc);
    }

    acceptsBoilCommands() {return false;}
}

/* ----------------------------------
*  Properties
*  i.e. TsField
*  i.e. TsFunction
* -----------------------------------*/
exports.TsField = class TsField extends TsProp{

  constructor(name, type, ...args){
    super(name, "prop-field");
    this.type = type || "any";
    this.required = args[0] || true;
    this.scope = args[1] || "";
  }
  static isInstance(o) { return o.brx === "prop-field"; }
}


exports.TsFunction = class TsFunction extends TsProp{

  constructor(name, ...args){
    super(name, "prop-function");
    this.name = name;
    this.type = args[0] || null;
    this.args = args[2] || [];
    this.body = args[3] || [];
    this.scope = args[4] || "public";
  }
  static isInstance(o) { return o.brx === "prop-function"; }
}

exports.TsFunctArg = class TsFunctArg extends TsProp{

  constructor(name, type, ...args){
    super(name, "funct-arg");
    this.type = type || "any";
    this.required = args[0] || true;
    this.defVal = args[1] || null;
  }
  static isInstance(o) { return o.brx === "funct-arg"; }
}
