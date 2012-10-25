var Jaz = (function(EM){

   EM.create("Jaz",function(su,ascolor){

      var _su = extensions.SU,
            Time = Date,
            newline = "\n",
            tabline = "\t",
            spaceline = " ",
             //ascii colors range from 30 t0 36,where 30 is black
            asc = globals.asc,
            Failed = _su.makeString("",asc.extra.boldOn , asc.fg.red ,"Failed!", asc.reset),
            Passed = _su.makeString("",asc.extra.boldOn , asc.fg.green ,"Passed!", asc.reset),
            clockIt = function(fn){
               var start = Time.getTime();
               fn.call(this);
               var end = Time.getTime() - start;
               return end;
            },
            cres = function(message,color,reset){
                  return _su.makeString(" ",asc.extra.boldOn,color,message,reset,asc.extra.boldOff);
            },
                 TerminalConsole = {
         display:function(message){
            console.log(asc.reset,message);
         },
         warn:function(message){
            console.log(asc.fg.margenta,message,asc.reset);
         },
         error:function(message){
            console.log(asc.fg.red,message,asc.reset);
         }
      },
      DOMConsole = {
         display:function(message){
            //
         },
         warn:function(message){
            //
         },
         error:function(message){
            //
         }
      },
      Logger = (function(title,debug){
         var title = title, debug = debug,logs = [];

         return {

            log: function(message){
               logs.push(message);
               return this;
            },

            warn: function(message){
               logs.push(_su.makeString(ascolor()))
            },

            print: function(){
               var count = 0;
               if(title && debug) TerminalConsole.display(title);
               var iterator = _su.iterable(logs,function(e,i,b){
                  TerminalConsole.display(_su.makeString("\n",e));
                  count += 1;
               },function(e,i,b){
                  if(!debug) return;
                  TerminalConsole.display(_su.makeString("",cres("Total Log Count:",asc.fg.cyan,asc.reset),count));
               });

               while(iterator.next());
            },

            flush: function(){
               _su.explode(logs);
            }
         }

      }),
      LoggerManager = (function(){
         return {
            assert: Logger("Assert Log Reports:"),
            expect: Logger("Expectations Log Reports:"),
            suite: Logger("Suite Log Reports:"),
            report: function(){
               // this.assert.log(" ");
               // this.expect.log(" ");

               this.suite.print();
               this.assert.print();
               this.expect.print();
               TerminalConsole.display(" ");

               //clear

               this.suite.flush();
               this.assert.flush();
               this.expect.flush();
            }
         }
      })(), 
      Asserts = (function(_scope){
               if(!_scope) _scope = {desc : "Asserts"};

               var wrapToString = function(code){ return ("'"+code+"'"); },
                   generateResponse = function(op,could,should,message,scope){
                     if(_su.isString(could)) could = wrapToString(could);
                     if(_su.isString(should)) should = wrapToString(should);
                     if(_su.isDate(could)) could = could.getTime();
                     if(_su.isDate(should)) should = should.getTime();

                     var passed = _su.makeString(" ",asc.fg.margenta,"  - Assertion:",cres(op,asc.fg.cyan,asc.reset),
                           asc.fg.margenta,"Status:",Passed, asc.fg.margenta,"From:",cres(scope.desc,asc.fg.white,asc.reset)),
                         failed = _su.makeString(" ",asc.fg.margenta,"  - Assertion:",cres(op,asc.fg.cyan,asc.reset),
                           asc.fg.margenta,"Status:",Failed,asc.fg.margenta,"From:",cres(scope.desc,asc.fg.cyan,asc.reset)),
                         body = _su.makeString(" ","   ",asc.fg.green," + Checked:",asc.reset,"if",could,message,(should ? should : " "));
                        
                        return {
                           pass: _su.makeString("\n",passed,body),
                           fail: _su.makeString("\n",failed,body)
                        }
                   },
                   Log = LoggerManager.assert,
                   AssertError = new Error("Assertion Error!"),
                   responseHandler = function(state,response){
                        if(!state){ Log.log(response.fail); throw AssertError; return false; }
                        Log.log(response.pass);
                        return true;

                   },
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
            });
            

      return {
         name: "AppStack.Jaz",
         description:" a lightweight tdd style testing framework",
         licenses: [{ type:"mit", url:"http://mths.be/mit"}],
         author: "Alexander Adeniyi Ewetumo",
         version: "0.0.1",
         suite: Suite,
         expects: Expects,
         asserts: Asserts,
         logger: Logger,
         logman: LoggerManager,
      };

   )};

});

module.exports = Jaz;
