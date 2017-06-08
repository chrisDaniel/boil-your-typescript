const boil = require(boil);

const customPlugins = [];
const pluginClassMaker = require('../examples/class-maker/custom-boiler');
customPlugins.push(pluginClassMaker);

let optsC = {
  srcDir : __dirname + '/src/test-c',
  plugins : customPlugins
};

boil.boil(optsC);
