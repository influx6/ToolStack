(function(){
     
      var ToolStack =  {};
          

      ToolStack.ObjectClassName = "ToolStack";

      ToolStack.noConflict = function(){
        root.ToolStack = previousToolStack;
        return this; 
      };

      //the current in use version of Class
      ToolStack.version = "0.3.2";

      if(typeof module !== 'undefined' && typeof require !== 'undefined'){
        // //simple comment what you dont want loaded or rather pass a custom object
        var fs = require('fs'),
          lib = __dirname+'/lib/';


        ToolStack._lib = function(module,fn){
            var mtch,self = this,split = module.split('.'),
            mod = 'stack.'.concat(split.length === 1 ? split[0] : split[1]);

            fs.readdir(lib,function(err,item){
              if(err) throw err;
              item.forEach(function(e,i,d){
                mtch = e.match(/(\w+)\W(\w+)/)[0];
                if(mtch === mod){
                  require(lib.concat(e))(self);
                  if(fn) fn();
                }
              });
            });
        };

        ToolStack.load = function(module,fn){
            if(typeof module === 'string') ToolStack._lib(module,fn);
            if(module instanceof Array){
                var size = module.length,count = 1;
                module.forEach(function(e,i,d){
                  if(count >= size){ 
                   ToolStack._lib(e,fn); return;
                  }
                  ToolStack._lib(e); count += 1;
                });
            }
        };

        module.exports = ToolStack;
        
      };

  
})();