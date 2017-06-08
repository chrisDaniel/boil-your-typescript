
module.exports.TsBoilCommand = class TsBoilCommand{

  constructor(str){
    if(!str){
      throw Error("No Boil Command Content");
    }

    this.str = str;
    var pieces = str.split("\|");
    this.code = pieces[0].toLowerCase();
    this.boilOpts = pieces[1] || "empty";
  }
}
