const boil = require('../index.js');

/* ------------------------------------
* Test A - In Directory to Out Directory
* -------------------------------------*/
const optsA = {
  srcDir : __dirname + '/src/test-a/in',
  outDir : __dirname + '/src/test-a/out'
};
boil.boil(optsA);


/* ------------------------------------
* Test B - Overwrite Same Directory
* -------------------------------------*/
const optsB = {
  srcDir : __dirname + '/src/test-b',
  formatting : "min"
};
boil.boil(optsB);


/* ------------------------------------
* Test C - Custom Plugin
* -------------------------------------*/
const customPlugins = [];
const pluginClassMaker = require('../examples/class-maker/custom-boiler');
customPlugins.push(pluginClassMaker);

const optsC = {
  srcDir : __dirname + '/src/test-c',
  plugins : customPlugins
};
boil.boil(optsC);


/* ------------------------------------
* Test D - Wildness
* -------------------------------------*/
