
//Step 1...
//Configure Options
module.exports = function(boilOptions, cb){

  //Step 0...
  //Prep the Options
  boilOptions = boilOptions || {};
  if(!boilOptions.srcDir) throw Error("Options must define a Source Directory :srcDir:")

  const srcDir = boilOptions.srcDir;
  const outDir = boilOptions.outDir || srcDir;
  const customPlugins = boilOptions.plugins || [];

  const Options = require('./commons/options');
  const opts = new Options();
  opts.setDirectories(srcDir, outDir);

  //Step 1...
  //Configure Core Plugins
  const builderPlugin = require('./plugins-core/builder/boil');
  opts.registerPlugin(builderPlugin);
  const getterPlugin  = require('./plugins-core/getset/boil-getters');
  opts.registerPlugin(getterPlugin);
  const setterPlugin  = require('./plugins-core/getset/boil-setters');
  opts.registerPlugin(setterPlugin);

  //Step 2...
  //Configure Custom Plugins
  customPlugins.forEach(cp => {
    opts.registerPlugin(cp)
  });


  //Step 3...
  //Run Boil Process
  Options.setCurrent(opts);
  const process = require('./boil-process/boil-processor');
  process(opts);
}
