(function(){
     
      var ToolStack =  {},_each;
          
      _each = function (arr, iterator) {
          if (arr.forEach) {
              return arr.forEach(iterator);
          }
          for (var i = 0; i < arr.length; i += 1) {
              iterator(arr[i], i, arr);
              // if(i === arr.length && completed) completed();
          }
      };

      ToolStack.ObjectClassName = "ToolStack";

      ToolStack.noConflict = function(){
        root.ToolStack = previousToolStack;
        return this; 
      };

      //the current in use version of Class
      ToolStack.version = "0.3.2";

      ToolStack.need = function(module){
        if(typeof module === 'string') throw new Error("Please Loadup library:",name);
      };

      if(typeof module !== 'undefined' && typeof require !== 'undefined'){
        // //simple comment what you dont want loaded or rather pass a custom object
        var fs = require('fs'),
          lib = __dirname+'/lib/';


        ToolStack._lib = function(module,fn){
            var mtch,item,self = this,split = module.split('.'),
            mod = 'stack.'.concat(split.length === 1 ? split[0] : split[1]);

            item = fs.readdirSync(lib);
            item.forEach(function(e,i,d){
              mtch = e.match(/(\w+)\W(\w+)/)[0];
              if(mtch === mod){
                require(lib.concat(e))(self);
                if(fn) fn(self);
              }
            });
        };



        ToolStack.load = function(module,fn){
            if(typeof module === 'string' && !ToolStack[module]){
                ToolStack._lib(module.toLowerCase(),fn);
            } 
            if(module instanceof Array){
                var size = module.length,count = 1;
                module.forEach(function(e,i,d){
                  if(typeof e !== 'string') return;
                  if(count >= size){ 
                   ToolStack._lib(e.toLowerCase(),fn); return;
                  }
                  ToolStack._lib(e.toLowerCase()); count += 1;
                });
            }
        };

        module.exports = ToolStack;
        
      };

      if(typeof window !== 'undefined'){
        var lib = "./lib/";

        ToolStack.script = function(src,fn,id){
          var script = document.createElement('script');
          script.setAttribute('id',id.toLowerCase());
          script.type = "text/javascript";
          script.src = src;

          script.onload = script.onreadystatechange = function(){
            if(!script.readyState || script.readyState.match(/^completed$|^loaded$/ig)){
              (function(a){ fn(a); })(script)
              script.onload = script.onreadystatechange = null;
            }
          };

          return script;
        };

        ToolStack._worker = function load(module,fn,completed) {
          var self = this,split = module.split('.'),item = (split.length === 1 ? split[0] : split[1]),
          script,mod = 'stack.'.concat(item)+".js",addr = lib.concat(mod.toLowerCase());

          if(ToolStack[item]) return;

          script = ToolStack.script(addr,function(s){
                window[item](self);
                if(fn && completed) fn(self);
                document.head.removeChild(s);
            },item);
          document.head.appendChild(script);

        };

        ToolStack.load = function(module,fn){
            if(typeof module === 'string' ){
              ToolStack._worker(module,fn,true);
            }
            if(module instanceof Array){
              _each(module,function(e,i,d){
                ToolStack._worker(e,fn,(i === d.length - 1 ? true : false));
              });
            }
        }

        window.ToolStack = ToolStack;
      }

  
})();