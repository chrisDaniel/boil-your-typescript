let _bopts_current = {};

module.exports = class Options{

    constructor(){
      this.srcDir = "";
      this.outDir = "";

      this.plugins = {};

      this.typD = ':';
      this.nl   = '';
      this.nl2  = '';
      this.tab  = '';
      this.tab2 = '';
      this.tab3 = '';
      this.formatter_useNice();
    }

    /* -----------------------
    *  directories
    * ----------------------- */
    setDirectories(src, out){
      this.srcDir = src;
      this.outDir = out || src;
    }


    /* -----------------------
    *  formatting
    * ----------------------- */
    formatter_useNice(){
      this.typD = ' : ';
      this.nl   = '\n';
      this.nl2  = '\n\n';
      this.tab  = '    ';
      this.tab2 = '         ';
      this.tab3 = '             ';
    }
    formatter_useMin(){
      this.typD = ':';
      this.nl   = '';
      this.nl2  = '';
      this.tab  = '';
      this.tab2 = '';
      this.tab3 = '';
    }

    /* -----------------------
    *  boilers
    * ----------------------- */
    registerPlugin(plugin){
      var tag = plugin.tag.toLowerCase();
      return this.plugins[tag] = plugin;
    }
    getPlugin(tag){
      return this.plugins[tag];
    }

    /* -----------------------
    *  static operations
    * ----------------------- */
    static setCurrent(opts){
      _bopts_current = opts ;
    }
    static getCurrent(){
      return _bopts_current;
    }
}
