(function(r){
      //all functions/methods with an '_' starting their names are hidden and are
      //not to be called directly unless you need to test those specific
      //operations directly,please use such a convention for a better modularizing
      //of code

      var root = r;

      var previousAppStack = root.AppStack;

      var AppStack;
      

      if(root.exports !== undefined){
         root.exports = AppStack;
      }else{
         AppStack = root.AppStack = function(){};
      }

      AppStack.ObjectClassName = "AppStack";

      AppStack.noConflict = function(){
        root.AppStack = previousAppStack;
        return this; 
      };

      //the current in use version of Class
      AppStack.version = "0.3.2";

      //config option to decide if Class that are created are to have the
      //Class.Events available as part of their prototype or not
     // AppStack.useEvents = true;

      //this class level method handles classic-type inheritance,ensure to use it before
      //assigning any properties to the child prototype,incase of using the Class class without
      //using its create method
      AppStack.inherit = function(child,parent){
         
         function empty(){};
         empty.prototype = parent.prototype;
         
         child.prototype = new empty();
         
         child.prototype.constructor = child;
         child.parent = parent.prototype;
         
         parent.prototype.constructor = parent;

      };

      //please note that AppStack.mixin and AppStack.SU.extends careless about wether
      //the arguments passed are objects or pure prototypes,they require you to
      //specify,if its from a prototype to a prototype or they will walk with any
      //object you give them as they are without looking or trying to add to this
      //objects/functions prototype,its done this way to allow more flexibility 
      //when desire to not just mix between prototypes but also between objects or
      //objects constructors
      AppStack.mixin = function(from,to){
         for(var e in from){
            if(e in to) return;
            to[e] = from[e];
         }
      };

       
      AppStack.ns = function(space,fn){
         var self = this,
            space = space.split('.'),
            splen = space.length,
            index = 0,
            current = null,
            adder = function(obj,space){ 
               if(!obj[space]) obj[space] = {};
               obj[space]._parent = obj;
               return obj[space];
            };

         while(true){
            if(index >= splen){
                self._parent[current] = fn;
                break;
            };
            //we get the item,we add and move into lower levels
            current = space[index];
            self = adder(self,current);
            index++;
         };

         self = this;
         return self;
      };


  
})(this);
