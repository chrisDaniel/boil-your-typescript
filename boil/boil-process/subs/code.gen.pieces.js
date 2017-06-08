
/* ---------------------------------
* Generate Inner Namespace
*
* ---------------------------------*/
exports.innerspace = function(name, depth){

  var o = getFormatting(depth);

  var s = o.ps + 'export namespace';
  s    += ' ' + name + ' ';
  s    += '{' + o.nl;
  return s;
}

/* ---------------------------------
* Generate Interface
*
* ---------------------------------*/
exports.interfaceDeclaration = function(name, depth){

  var o = getFormatting(depth);

  var s = o.ps + 'export interface';
  s    += ' ' + name + ' ';
  s    += '{' + o.nl + o.nl;
  return s;
}
exports.constructFunction = function(f, depth){

  var o = getFormatting(depth);

  var s = o.ps + "export function " + f.name;
  s    += helpFunctionArgs(f.args, o);
  s    += o.typD + f.type;
  s    += helpFunctionBody(f.body, o);
  s    += o.nl;

  return s;
}

/* ---------------------------------
* Generate Class
*
* ---------------------------------*/
exports.classDecl = function(name, depth){

  var o = getFormatting(depth);

  var s = o.ps + 'export class ' + name;
  s    += '{' + o.nl;
  return s;
}
exports.classConstructor = function(cons, depth){

  var o = getFormatting(depth);

  var s = o.ps + helpScope(cons.scope) + 'constructor';
  s    += helpFunctionArgs(cons.args, o);
  s    += helpFunctionBody(cons.body, o);
  s    += o.nl;

  return s;
}

/* ---------------------------------
* General
*
* ---------------------------------*/
exports.field = function(f, depth){

  var o = getFormatting(depth);

  var s = o.ps;
  s    += helpScope(f.scope) + f.name;
  if(!f.required) s += "?";
  s    += o.typD + f.type + ";"
  s    += o.nl;
  return s;
}
exports.function = function(f, depth){

  var o = getFormatting(depth);

  var s = o.ps + helpScope(f.scope);
  s    += f.name
  s    += helpFunctionArgs(f.args, o);
  s    += helpFunctionType(f.type, o);
  s    += helpFunctionBody(f.body, o);
  s    += o.nl;

  return s;
}

exports.lineBreak = function(ct){
  var o = getFormatting(0);
  var total = ct || 1;

  var s = "";
  for(var i =0; i<total; i++){
    s += o.nl;
  }
  return s;
}
exports.blockClose = function(depth){

  var o = getFormatting(depth);

  var s = o.ps + '}' + o.nl;
  return s;
}


/* ---------------------------------
* Help
*
* ---------------------------------*/
helpScope = function(scope){

  var s = "";
  if(!scope || scope.length <=0){
    return s;
  }
  s += scope + " ";
  return s;
}
helpFunctionType = function(t, o){

  let type = t || "";

  let s = "";
  if(type.length > 0){
    s += o.typD + type;
  }
  return s;
}
helpFunctionArgs = function(args, o){

  //case 1...
  //no body
  if(args.length <= 0){
    var e = '()';
    return e;
  }

  //case 2...
  //body of lines
  var s =  '(';

  args.forEach(arg =>{

    s    += arg.name;
    if(!arg.required) s += "?";
    s    += o.typD + arg.type;
    if(arg.defVal)       s += "=" + arg.defVal;
    s    += ", ";
  });

  s = s.slice(0, -2);
  s+= ')';
  return s;
}

helpFunctionBody = function(body, o){

  //case 1...
  //no body
  body = body || [];
  if(body.length <= 0){
    var e = '{}' + o.nl;
    return e;
  }

  //case 2...
  //body of lines
  var s =  '{' + o.nl;

  body.forEach(bodyLine => {
      s += o.ps + o.tab + bodyLine + o.nl;
  });
  s += o.ps + '}';
  return s;
}
getFormatting = function(depth){

  var o = require('../../commons/options').getCurrent();

  //figure pre space from depth
  var ps = '';
  depth = depth || 0;
  for(var i = 0; i < depth; i++){
    ps += '    ';
  }

  //return formatting
  return {
      ps    : ps,
      nl    : o.nl,
      tab   : o.tab,
      tab2  : o.tab2,
      typD  : o.typD,
  }
}
