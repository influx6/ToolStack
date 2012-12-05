 "use strict";
!function(name,func){
  //check for specific module's systems else add it to the global
  if(typeof define === "function") define(func)
  else if(typeof module !== "undefined") module.exports = func;
  else this[name] = func; 

}("ToolStack.Matchers",function(ToolStack){

        if(!ToolStack.Logger) throw new Error("Please loadup ToolStack.Logger first");
        if(!ToolStack.ToolChain) throw new Error("Please loadup ToolStack.ToolChain first");

        var logger = ToolStack.Logger("Matcher Assertions!"),
            generateResponse = function(name,item,should,message,scope){
                var success = ToolChain.makeString(" ","Matcher:",name,"From:",scope,
                  "Status:","Passed!","\n","\t","Checked:",item,message,should);
                var failed = ToolChain.makeString(" ","Matcher:",name,"From:",scope,
                  "Status:","Passed!","\n","\t","Checked:",item,message,should);

                return { pass: success, fail: failed };
            },
            responseHandler = function(state,response){
                if(state) throw new Error(response.pass);
                else throw new Error(response.fail);
            },
            matchers = {
                 name: "Matchers",
                 version: "1.0.0",
                 description: "simple lightweight tdd style testing framework",
                 licenses:[ { type: "mit", url: "http://mths.be/mit" }],
                 author: "Alexander Adeniyin Ewetumo",
            };
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

});