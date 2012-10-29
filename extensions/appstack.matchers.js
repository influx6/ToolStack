 "use strict";
!function(name,func){
  //check for specific module's systems else add it to the global
  if(typeof define === "function") define(func)
  else if(typeof module !== "undefined") module.exports = func;
  else this[name] = func; 

}("Matchers",function(EM,MatcherError){

        EM.create("Matchers",function(toolchain){

            var generateResponse = function(){},
                logger = Logger("Martcher Assertions!"),
                matchers = {};
                matchers.item = null;
                matchers.obj = function(item){
                   this.item = item; return this;
                };
                matchers.createMatcher = function(name,message,fn){
                      var sandbox = this,scope = _scope,
                         matcher = function(should){
                            var res = fn.apply(sandbox,arguments),
                                response = generateResponse(name,sandbox.item,should,message,scope);
                            return (res ? responseHandler(true,response) : responseHandler(false,response));
                         };
                      
                      if(name in this) return false;
                      this[name] = matcher; return true;
                };

                matchers.createMatcher("toBe","is equal to",function(should){
                      if(this.item !== should) return false;
                      return true;
                });

                matchers.createMatcher("toBeNull","is null",function(){
                   _su.explode(arguments);
                   if(_su.isNull(this.item)) return true;
                   return false;
                });

                matchers.createMatcher("notToBe","is not equal to",function(should){
                   if(this.item !== should) return true;
                   return false;
                });

                return matchers;

        },["ToolChain","MatcherError","Logger"]);
});