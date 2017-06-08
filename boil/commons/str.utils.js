
module.exports.trim = function(str){
  const Rem_RegEx = /(\s|\;)/gi;
  var trimmed = str.replace(Rem_RegEx, "");
  return trimmed;
}

module.exports.chopNewLines = function(str){
  const Bad_RegEx = /(.*)(\n+)$/;
  if(str.match(Bad_RegEx)){
    str = str.replace(Bad_RegEx, '$1');
  }
  return str;
}
