var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn(module.exports);
  this[name] = module.exports[name];
})('ToolStack',function(global){
     
      var ToolStack =  {},_each,lib = "./lib/";
          
      _each = function (arr, iterator) {
          if (arr.forEach) {
              return arr.forEach(iterator);
          }
          for (var i = 0; i < arr.length; i += 1) {
              iterator(arr[i], i, arr);
          }
      };

      ToolStack.ObjectClassName = "ToolStack";

      ToolStack.noConflict = function(){
        root.ToolStack = previousToolStack;
        return this; 
      };

      //the current in use version of Class
      ToolStack.version = "0.3.4";

      ToolStack.need = function(module){
        var self = this;
        if(typeof module === 'string' && !self[module]){
          throw new Error("Please Loadup library: "+module);
          return;
        }
        if(module instanceof Array){
          _each(module,function(e){
            if(!self[e]) throw new Error("Please Loadup library: "+e);
          })
        }

      };

      ToolStack.ns = function(space,fn,scope){
           var obj = scope || {},
              space = space.split('.'),
              len = space.length,
              pos = len - 1,
              index = 0,
              current = obj;

           _each(space,function(e,i){
               if(!current[e]) current[e] = {};
               current[e].parent = current;
               current = current[e];
               if(i === pos){
                current.parent[e] = fn;
               }
           });

           // obj = obj[space[0]];
           delete obj.parent;
           return obj;
      };

      if(typeof module !== 'undefined' && typeof require !== 'undefined'){
        // //simple comment what you dont want loaded or rather pass a custom object
        var fs = require('fs'),path = require('path'),
          ext = path.resolve(__dirname,lib).concat("/");
          console.log(ext);


        ToolStack.helper = function(module,fn){
            var mtch,item,self = this,split = module.toLowerCase().split('.'),
            mod = 'stack.'.concat(split.length === 1 ? split[0] : split[1]);
            require(ext.concat(mod))[module](self);
            if(fn) fn(self);
        };

        ToolStack.load = function(module,fn){
            if(typeof module === 'string' && !ToolStack[module]){
                ToolStack.helper(module,fn);
            } 
            if(module instanceof Array){
                var size = module.length,count = 1;
                module.forEach(function(e,i,d){
                  if(typeof e !== 'string') return;
                  if(count >= size){ 
                   ToolStack.helper(e,fn); return;
                  }
                  ToolStack.helper(e); count += 1;
                });
            }
        };

        // module.exports = ToolStack;
        
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

        ToolStack._worker = function(module,fn,completed) {
          var self = this,split = module.split('.'),item = (split.length === 1 ? split[0] : split[1]),
          script,mod = 'stack.'.concat(item)+".js",addr = lib.concat(mod.toLowerCase());

          if(ToolStack[item]) return;

          script = ToolStack.script(addr,function(s){
                global[item](self);
                if(fn && completed) fn(self);
                delete global[item];
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

      }

      return ToolStack;
});