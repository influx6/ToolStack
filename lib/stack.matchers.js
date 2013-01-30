ToolStack.Matchers = (function(ToolStack){
        
        ToolStack.ASColors();
    
        var Console = ToolStack.Console,
        util = ToolStack.Utility,
        matchError = ToolStack.Errors.MatcherError,
        makeString = function(split){
              var split = split || "",
              args = ([].splice.call(arguments,0));
              return args.splice(1,args.length).join(split);
            },
            generateResponse = function(name,item,should,message,scope){
            	var template = util.templateIt(message,should),
                  head  = makeString(" ","Matcher:".bold.blue,name.bold.yellow);
                  // checked = makeString(" "," if",item,template,"\n").white;

            	  if(scope) head = head.concat(makeString(" ","  From:".bold.blue,scope.bold.yellow));
                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green,"\n","\t")),
                failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t"));

                // var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green,"\n","\t","Checked:".magenta)),
                // failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t","Checked:".magenta));
                // success = success.concat(checked);
                // failed = failed.concat(checked);
                  
                return { pass: success, fail: failed };
            },

            responseHandler = function(state,response){
              if(!Console.log) Console.init('console');
              if(state) Console.log(response.pass);
              else{ Console.log(response.fail); throw new matchError(response.fail); }
            },

            matchers = {
                 name: "Matchers",
                 version: "1.0.0",
                 description: "simple lightweight tdd style testing framework",
                 licenses:[ { type: "mit", url: "http://mths.be/mit" }],
                 author: "Alexander Adeniyin Ewetumo",
            };

            matchers.scope = null;
            matchers.item = null;

            matchers.obj = function(item){
              if(util.isNull(item)) this.item = 'null';
              else if(util.isUndefined(item)) this.item = 'undefined';
              else this.item = item;
              return this;
            };

            matchers.createMatcher = function(name,message,fn){
                if(!name || typeof message !== 'string') throw new Error("Please provide a name for the matcher");
                if(!message || typeof message !== 'string') throw new Error("Please provide a message for the matcher");
                if(!fn || typeof fn !== 'function') throw new Error("Please provide function for the matcher");


                  var sandbox = matchers,
                      matcher = function(){
                          var should = util.arranize(arguments);
                          var desc = (util.isString(sandbox.scope) ? sandbox.scope : (util.isObject(sandbox.scope) ? sandbox.scope.desc : ''));
                          var res = fn.apply(sandbox,should),
                              response = generateResponse(name,util.processIt(sandbox.item),util.processIt(should),message,desc);
                          return (res ? responseHandler(true,response) : responseHandler(false,response));
                      };
                
                  if(name in this) return false;
                  this[name] = matcher; return true;
            };

            matchers.createMatcher("is","is equal to "+"{0}".green,function(should){
                  if(this.item !== should) return false;
                  return true;
            });

            // matchers.createMatcher("is","is null",function(){
            //    util.explode(arguments);
            //    if(util.isNull(this.item)) return true;
            //    return false;
            // });

            matchers.createMatcher("isNot","is not equal to "+"{0}".red,function(should){
               if(this.item !== should) return true;
               return false;
            });

            matchers.createMatcher("isTypeOf","is of type "+"{0}".magenta,function(should){
               if(this.item !== should) return true;
               return false;
            });
             
            matchers.createMatcher("isValid","is a valid object",function(should){
                if(!util.isEmpty(this.item) && !util.isNull(this.item) && !util.isUndefined(this.item)) return true;
                return false;
            });

            matchers.createMatcher("isInstanceOf","is a instance of "+"{0}".green,function(should){
               if(this.item !== should) return true;
               return false;
            });

            matchers.createMatcher('hasKey',' has property '+"{0}".red,function(key){
                if(util.has(this.item,key)) return true;
                return false;
            });

            matchers.createMatcher('isTrue',' is '+"True".green,function(){
                if(this.item === true) return true;
                return false;
            });

            matchers.createMatcher('isEmpty',' is '+"Empty".red,function(){
                if(util.isEmpty(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isFalse',' is '+"False".red,function(){
                if(this.item === false) return true;
                return false;
            });

            matchers.createMatcher('hasKeyForm','has property '+ "{0}".red +' of type '.white+ "{1}".red,function(key,form){
                if(util.matchType(this.item[key],form)) return true;
                return false;
            });

          return function Shell(scope){
            matchers.scope = scope;
            return matchers;
          };

})(ToolStack);