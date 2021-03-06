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
            generateResponse = function(name,item,should,message,scope,verbose){
              var template = util.templateIt(message,should),
                  head  = makeString(" ","Matcher:".bold.blue,name.bold.yellow);
                  checked = makeString(" ","\n","\t","Checked:".magenta," if",item,template,"\n").white;

                if(scope) head = head.concat(makeString(" ","  From:".bold.blue,scope.bold.yellow));
                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green,"\n","\t")),
                failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t"));

                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green)),
                failed = head.concat(makeString(" ","  Status:".bold.blue,"Failed!".bold.red));

                if(verbose){
                  success = success.concat(checked);
                  failed = failed.concat(checked);
                }else{
                  success = success.concat('\n');
                  failed = failed.concat('\n');
                }
                  
                return { pass: success, fail: failed };
            },

            responseHandler = function(state,response,throwable){
              if(!Console.log) Console.init('console');
              if(state) Console.log(response.pass);
              else{ Console.log(response.fail); 
                if(throwable) throw new matchError(response.fail); 
              }
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
            matchers.compliant = false;
            matchers.verbose = true;

            matchers.scoped = function(scope){
              this.scope = scope;
              return this;
            };

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
                              response = generateResponse(name,util.processIt(sandbox.item),util.processIt(should),message,desc,sandbox.verbose);
                          return (res ? responseHandler(true,response,sandbox.compliant) : responseHandler(false,response,sandbox.compliant));
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
            
            matchers.createMatcher('indicate','operation indicated as'+"{0}".green,function(should){
                if(should === true) return true;
                return false;
            });

            matchers.createMatcher("isNot","is not equal to "+"{0}".red,function(should){
               if(this.item !== should) return true;
               return false;
            });

            // matchers.createMatcher("isTypeOf","is of type "+"{0}".magenta,function(should){
            //    if(this.item !== should) return true;
            //    return false;
            // });
             
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

            matchers.createMatcher('isType',' is type of '+"{0}".green,function(key){
                if(util.matchType(this.item,key)) return true;
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

            matchers.createMatcher('isObject',' is an '+"Object".red,function(){
                if(util.isObject(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isArray',' is an '+"Array".red,function(){
                if(util.isArray(this.item)) return true;
                return false;
            });

            matchers.createMatcher('isFalse',' is '+"False".red,function(){
                if(this.item === false) return true;
                return false;
            });

            matchers.createMatcher('isKeyOfType','has property '+ "{0}".magenta +' of type '.white+ "{1}".green,function(key,form){
                if(util.matchType(this.item[key],form)) return true;
                return false;
            });

            matchers.createMatcher('isKeyWithValue','has property '+ "{0}".magenta +' with value '.white+ "{1}".green,function(key,value){
                if(this.item[key] === value) return true;
                return false;
            });

            matchers.createMatcher('isFunction','is a function!',function(){
                if(util.isFunction(this.item)) return true;
                return false;
            });

            // matchers.createMatcher('andFunctions','all operations are true'.green,function(){
            //   var state = true, args = util.arranize(arguments);
            //   util.each(args,function(){},this,function(e,i,o){
            //     if(util.isFunction(e) && e(this.item)) return false;
            //     state = false;
            //     return true;
            //   })
            //   return state;
            // });

            return matchers;

})(ToolStack);