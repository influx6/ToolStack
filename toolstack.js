var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn(module.export);
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

      return ToolStack;
      
});
