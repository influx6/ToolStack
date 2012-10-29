!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func)
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func; 
}("AppStack",(function(){

      var AppStack =  {};

      AppStack.ObjectClassName = "AppStack";

      AppStack.noConflict = function(){
        root.AppStack = previousAppStack;
        return this; 
      };

      //the current in use version of Class
      AppStack.version = "0.3.2";

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

      AppStack.load = function(name){

      };

      AppStack.require = AppStack.load;

      return AppStack;
  
}()));
