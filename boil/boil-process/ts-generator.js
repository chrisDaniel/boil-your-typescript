const Tsc = require('../ts-reflect/ts-constructs');
const Tsp = require('../ts-reflect/ts-props');
const G = require('./subs/code.gen.pieces');
const BT = require('./subs/tags.boiled');
const strUtils = require('../commons/str.utils');

/* -----------------------------------*
* The Main Extract function
*
* ----------------------------------- */
exports.generateBoiledCode = function(file){

  var content = "";

  //step 1...
  //for the files primary constructs...
  //we take the original constructs source code
  //use boiled props to gen code
  file.constructs.forEach(cons => {

    //chunk 1...src code of the construct
    let i = 0;
    for(i; i<cons.srcCd.length-1; i++){
      content += cons.srcCd[i] + "\n";
    }

    //chunk 2...add in our boiled
    if(cons.boiledProps.length > 0){
      content = strUtils.chopNewLines(content);
      content += BT.genOpenTag({lb:3,depth:1});
      cons.boiledProps.forEach(cbp => {
        content += gen_boiledProp(cbp, 1);
      });
      content += BT.genClosedTag({lb:0,depth:1});
    }

    //chunk 3...finish the src codes last line
    for(i; i<cons.srcCd.length; i++){
      content += cons.srcCd[i] + "\n";
    }
  });

  //step 2...
  //for the props boiled directly into the file
  //gen code for them and attach to bottom
  if(file.boiledConstructs.length <= 0 && file.boiledProps.length <= 0){
    return content;
  }
  content = strUtils.chopNewLines(content);
  content += BT.genOpenTag({lb:3});
  file.boiledConstructs.forEach(bc => {
    content += gen_boiledConstruct(bc)
  });
  file.boiledProps.forEach(bp => {
    content += gen_boiledConstruct(bp);
  });
  content += BT.genClosedTag({lb:0});
  return content;
}


/* ---------------------------
* Generating Boiled Construct Type
* --------------------------- */
gen_boiledConstruct = function(con, d){

    let myContent = "";
    let depth = d || 0;

    //Step 0...
    //Are we inside a namespace?
    if(con.namespace){
      myContent += G.innerspace(con.namespace, 0);
      depth++;
    }

    //Step 1...
    //Generate what I need
    if(Tsc.TsInterface.isInstance(con)){
      myContent += gen_Interface(con, depth);
    }
    else if(Tsc.TsClass.isInstance(con)){
      myContent += gen_Class(con, depth);
    }
    else if(Tsp.TsFunction.isInstance(con)){
      myContent += gen_ConstructFunction(con, depth);
    }

    if(con.namespace){
      myContent += G.blockClose(depth-1);
    }
    return myContent;
}
gen_Interface = function(i, d){

  var s  = G.interfaceDeclaration(i.name, d);

  i.boiledProps.forEach(subProp => {
    s += gen_boiledProp(subProp, d+1);
  });

  s += G.blockClose(d);
  return s;
}
gen_Class = function(c, d){

  //decl
  var s  = '';
  s     += G.classDecl(c.name, d);

  //field properties
  s+=G.lineBreak();
  c.boiledProps.filter(subProp => {
    return Tsp.TsField.isInstance(subProp);
  })
  .forEach(fp => {
    s += gen_boiledProp(fp,d+1);
  });

  //cons
  if(c["cons"]){
    s += G.lineBreak();
    s += G.classConstructor(c["cons"], d+1);
  }

  //function props
  s+=G.lineBreak();
  c.boiledProps.filter(subProp => {
    return Tsp.TsFunction.isInstance(subProp);
  })
  .forEach(fup => {
    s += gen_boiledProp(fup,d+1);
  });

  //done
  s += G.blockClose(d);
  return s;
}
gen_ConstructFunction = function(f, d){

  var s   = G.constructFunction(f, d);
  return s;
}

/* ---------------------------
* Generating Boiled Prop Types
* --------------------------- */
gen_boiledProp = function(bp, depth){

  let myContent = "";

  if(Tsp.TsField.isInstance(bp)){
      myContent += G.field(bp, depth);
  }
  if(Tsp.TsFunction.isInstance(bp)){
      myContent += G.function(bp, depth);
  }
  return myContent;
}
