const Tsc = require('./ts-constructs');
const Tsp = require('./ts-props');

exports.TsFile = class TsFile{

    constructor(filename, srcdir, outdir){

      //file props
      this.fileName = filename;
      this.srcDir = srcdir;
      this.outDir = outdir;

      //parsed props
      this.parsing = false;
      this.insideBoiled = false;
      this.ubc = [];
      this.current = null;
      this.constructs = [];

      //in generation props
      this.boiling = false;
      this.boiledConstructs = [];
      this.boiledProps = [];
    }

    //functions....
    //while parsing
    checkParsing(){
      if(!this.parsing) throw Error("No Longer Parsing");
    }
    parse_start(){
      if(this.parsing) throw Error("Already Parsing");
      this.parsing = true;
      var ws = new Tsc.TsWhitespace();
      this.parse_pushConstruct(ws);
    }
    parse_end(){
      this.checkParsing();
      this.parse_flushBoilCommands(this.current, true);
      this.current = null;
      this.parsing = false;
    }

    //src code stuff
    parse_pushSrcCd(line){
      this.checkParsing();
      if(this.current) this.current.pushSrcCd(line);
    }
    parse_pushConstruct(c){
      this.checkParsing();
      this.constructs.push(c);
      this.current=c;
      this.parse_flushBoilCommands(c);
    }
    parse_pushProp(p){
      this.checkParsing();
      this.current.pushProp(p);
      this.parse_flushBoilCommands(p);
    }

    //boil commands
    parse_pushBoilCommand(bc){
      this.checkParsing();
      this.ubc.push(bc);
      this.parse_flushBoilCommands(bc);
    }
    parse_flushBoilCommands(to, force){
      if(this.ubc.length <= 0) return;

      if(force || this.current.acceptsBoilCommands()){
        this.ubc.forEach(bc => { to.pushBoilCommand(bc); });
        this.ubc = [];
      }
    }


    //functions....
    //while boiling
    checkBoiling(){
      if(!this.boiling) throw Error("Not Generating Now");
    }
    boil_start(){
      if(this.parsing) throw Error("Still Parsing");
      this.boiling = true;
    }
    boil_end(){
      this.checkBoiling();
      this.boiling = false;
    }
    boilConstruct(construct){
      this.checkBoiling();
      this.boiledConstructs.push(construct);
    }
    boilProperty(prop){
      this.checkBoiling();
      this.boiledProps.push(prop);
    }

    //helpers
    //functions...extrac
    get srcPath(){
      var p = this.srcDir + "/" + this.fileName;
      return p;
    }
    get outPath(){
      var p = this.outDir + "/" + this.fileName;
      return p;
    }
    get boilCommandsUsed(){
      var bc = [];
      this.constructs.forEach(tsc => {
        tsc.boilCommands.forEach(tsc_bc => {
          bc.push(tsc_bc);
        });
      });
      return bc;
    }
};
