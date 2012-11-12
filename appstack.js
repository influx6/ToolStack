!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func)
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func; 
}("AppStack",(function(root){
     
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

      AppStack.extensions = {};

      AppStack.extmgr = (function(){

         var   signature = "__extensions__",
               validate_args = function(name,meta,fn){
                  //tiny assertions to ensure we follow extensions rules
                  if(!name || typeof name !== 'string') throw new Error("Please the first argument must be a string of the name of the extension")
                  if(!meta || typeof meta !== 'object') throw new Error(" Please include a meta object that contains meta info(build,version,dependencies ..");
                  if(!fn) throw new Error(" Please include a meta object that contains meta info(build,version,dependencies ..");

                  //assertions of the meta objects for specific details
                  //basic meta checks
                  if(!meta.version || typeof meta.version !== 'string') throw new Error("Extension has no valid version information");
                  if(!meta.author || typeof meta.author !== 'string') throw new Error("Extension has no valid author information");
                  if(!meta.description || typeof meta.description !== 'string') throw new Error("Extension has no valid description information");

                  //extra meta data checks
                  if(!meta.licenses) throw new Error("Extension has no valid licenses information");
                  if(meta.dependencies && typeof meta.dependencies !== 'object') throw new Error("Extension has no valid licenses information");
               };


            return {

               _loader : null,

               use: function(o){ if(o && o.get) this._loader = o; },

               create: function(name,meta,fn){
                  var self = this;
                  //call validation of correctness of arguments passed
                  validate_args(name,meta,fn);
                  AppStack.extensions[name] = {
                        __name__ : name,
                        __meta__ : meta,
                        __source__ : fn,
                        __imports__ : (function(root){
                           if(meta.dependencies){
                              if(!root._loader) throw new Error("Please supply a dependency loader! \n simple supply it to AppStack.use to set it!");
                              return root._loader.get(meta.dependencies);
                           }
                        })(self),
                        signature: signature,
                        init: function(){}
                  };
               },

            };

      })();

      

      return AppStack;
  
}()));
