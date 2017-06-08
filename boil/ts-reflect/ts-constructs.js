/* ----------------------------------
*  Constructs
*  Typescript structures which can hold other constructs
*  i.e. interface, class, whitespace
* -----------------------------------*/
class TsConstruct{

    constructor(name, brx){

      //decl props
      this.brx = brx;
      this.name = name;
      this.namespace = null;

      //src stuff
      this.srcCd = [];
      this.boilCommands = [];
      this.props = [];

      //boiled code
      this.boiledProps = [];
    }

    //push...
    //src stuff
    pushSrcCd(line){
      this.srcCd.push(line);
    }
    pushBoilCommand(bc){
      this.boilCommands.push(bc);
    }
    pushProp(prop){
      this.props.push(prop);
    }

    //push...
    //boiled stuff
    boilProperty(prop){
      this.boiledProps.push(prop);
    }

    //inspect...
    //get boil by tag
    findBoilCommandByTag(_tag){
      var tag = _tag || "";
      tag = tag.toLowerCase();

      var found = null;
      this.boilCommands.forEach(bc => {
        if(bc.code == tag) {found = bc.boilOpts;}
      });
      return found;
    }
}


/* ----------------------------------
*  Whitespace
* ----------------------------------*/
exports.TsWhitespace = class TsWhitespace extends TsConstruct{

  constructor(){
    super("", "cons-whitespace");
  }
  acceptsBoilCommands() {return false;}
  static isInstance(o) { return o.brx === "cons-whitespace"; }
}


/* ----------------------------------
*  Interface
* ----------------------------------*/
exports.TsInterface = class TsInteface extends TsConstruct{

  constructor(name){
    super(name, "cons-inteface");
  }
  acceptsBoilCommands() {return true;}
  static isInstance(o) { return o.brx === "cons-inteface"; }
}


/* ----------------------------------
*  Class
* ----------------------------------*/
exports.TsClass = class TsClass extends TsConstruct{

  constructor(name){
    super(name, "cons-class");
    this.cons = null;
  }
  acceptsBoilCommands() {return true;}
  static isInstance(o) { return o.brx === "cons-class"; }
}
exports.TsClassConstructor = class TsClassConstructor{
  constructor(){
    this.args = [];
    this.body = [];
    this.scope = "";
  }
}


/* ----------------------------------
*  Inner Space
* ----------------------------------*/
exports.TsInnerSpace = class TsInnerSpace extends TsConstruct{

  constructor(){
    super("innerspace", "cons-innerspace");
  }
  acceptsBoilCommands() {return false;}
  static isInstance(o) { return o.brx === "cons-innerspace"; }
}
