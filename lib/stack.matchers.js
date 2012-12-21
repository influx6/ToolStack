 "use strict";
!function(name,func){
  //check for specific module's systems else add it to the global
  if(typeof define === "function") define(func)
  else if(typeof module !== "undefined") module.exports = func;
  else this[name] = func; 

}("Matchers",function(ToolStack){

        ToolStack.need('ASColors');

        ToolStack.ASColors();

        var makeString = function(split){
              var split = split || "",
              args = ([].splice.call(arguments,0));
              return args.splice(1,args.length).join(split);
            },
            generateResponse = function(name,item,should,message,scope){
            	var head  = makeString(" ","Matcher:".bold.blue,name.bold.yellow),
                  checked = makeString(" "," if",item,message,should,"\n").white;

            	if(scope) head = head.concat(makeString(" "," From:".bold.blue,scope));

                var success = head.concat(makeString(" ","    Status:".bold.blue,"Passed!".bold.green,"\n","\t","Checked:".magenta)),
                failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t","Checked:".magenta));

                success = success.concat(checked);
                failed = failed.concat(checked);
                  
                return { pass: success, fail: failed };
            },
            responseHandler = function(state,response){
                if(state) console.log(response.pass);
                else{
                  console.log(response.fail); 
                  throw new Error(response.fail);
                };
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
                  var sandbox = this,
                      desc = (!sandbox.scope ? '' : ((typeof sandbox.scope === 'string') ? sandbox.scope : sandbox.scope.desc)),
                      matcher = function(should){
                          var res = fn.apply(sandbox,arguments),
                              response = generateResponse(name,sandbox.item,should,message,desc);
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

            matchers.createMatcher("isTypeOf","is of type ",function(should){
               if(this.item !== should) return true;
               return false;
            });
             
          var o = { 
            createMatchers: matchers.CreateMatcher,
            use: function(item,scope){ 
              if(!item) throw new Error('Please supply the item to match against');
              matchers.scope = scope;
              matchers.item = item; 
              return matchers; 
            }
          };

          if(ToolStack) ToolStack.Matchers = o;
          else return o;

});