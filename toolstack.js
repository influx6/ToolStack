var ToolStack =  {},_each,
    module = module || { exports: {}};

module.exports.ToolStack = ToolStack;

_each = function (arr, iterator) {
          if (arr.forEach) {
              return arr.forEach(iterator);
          }
          for (var i = 0; i < arr.length; i += 1) {
              iterator(arr[i], i, arr);
          }
};
          

ToolStack.ObjectClassName = "ToolStack";

// ToolStack.noConflict = function(){
//         root.ToolStack = previousToolStack;
//         return this; 
// };

//the current in use version of Class
ToolStack.version = "0.3.4";


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

