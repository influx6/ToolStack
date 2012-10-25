var Jaz = (function(EM){

   EM.create("Jaz", function(){

      //first setup extensions
      var extensions = {},
          extmgr = globals.extmgr(extensions);
        
         //execute the extenions
         globals.su(extmgr);

      //main functions 
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

                };

         var matchers = {}; matchers.item = null;
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
         }),
         Expects = (function(){
            var Console = LoggerManager.expect,
                expectations = {},
                rejections = {},
                expectDetail = function(color,reset,type,i,message){
                  return _su.makeString(" ",type,i,cres(message,color,reset));
                };

            return{

               done: function(){
                  _su.forEach(expectations,function(e,i){
                     if(!e){
                        Console.log(expectDetail(asc.fg.red,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Expectation:",asc.reset),
                        i,"is still unfullfilled!"));
                        return;
                     }
                        Console.log(expectDetail(asc.fg.green,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Expectation:",asc.reset),
                        i,"is fullfilled!"));
                        return;
                  },this);
                  _su.forEach(rejections,function(e,i){
                     if(!e){
                        Console.log(expectDetail(asc.fg.green,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Rejection:",asc.reset),
                        i,"is rejected!"));
                        return;
                     }
                        Console.log(expectDetail(asc.fg.red,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Rejection:",asc.reset),
                        i,"is still unrejected!"));
                        return;
                  },this);

                  _su.explode(expectations,rejections);

               },

               fulfill: function(e){
                  if(e in expectations && !expectations[e]){
                     expectations[e] = true;
                  }
                  return this;
               },

               reject: function(e){
                  if(e in rejections && rejections[e]){
                     rejections[e] = false;
                  }
                  return this;
               },

               agreeTo: function(e){
                  if(e in expectations) return;
                  expectations[e] = false;
                  return this;
               },

               refuseTo: function(e){
                  if(e in rejections) return;
                  rejections[e] = true;
                  return this;
               },

           };

         }),

         Suite = (function(){
            var sig = "__suites__",
            SuiteManager  = {
               lists : [],
               add: function(o){ 
                  if(!o.signature || o.signature !== sig) return;
                  this.lists.push(o);
               },
               run: function(){
                  var self=this,
                  iterator = _su.iterable(self.lists,function(e,i,b){
                     if(!e.signature || e.signature !== sig) return;
                     e.run();

                  },function(e,i,b){
                     //_su.explode(self.lists);
                  });

                  while(iterator.next());
               }

            },

            Suites = function(){

                  return {
                     signature: sig,
                     showDebug: false,
                     logger : LoggerManager.suite,
                     specs : {},
                     before : null,
                     after : null,
                     total : 0,
                     passed : 0,
                     failed : 0,
                     sandbox: {},
                     it : function(desc,fn){
                        //add the desc as a property of fn 
                        fn.desc = desc; fn.suite = this.title; Array.prototype.push.call(this.specs,fn);
                        this.total = this.specs.length;
                     },
                     beforeEach : function(fn){
                         var self = this;
                         this.before = function(){ return fn.call(self.sandbox); };
                     },
                     afterEach : function(fn){
                        var self = this;
                        this.after = function(){ return fn.call(self.sandbox); };
                     },
                     run: function(){
                        //handle and run all the specs 

                        var self = this,
                            it = _su.iterable(this.specs,function(e,i,b){
                               //make a clean scope
                              try{
                                 //using forceful approach we take on each it and run them 
                                 if(self.before) self.before();
                                 self.sandbox.desc = e.desc;
                                 e.call(self.sandbox);
                                 if(self.after) self.after();
                                 self.passed += 1;
                              }catch(j){
                                 self.failed += 1;
                              }
                        },function(e,i,b){
                              self.logger.log(_su.makeString(asc.extra.underline,cres("Suite:",asc.fg.margenta,asc.reset),
                                 cres(self.title,asc.fg.yellow,asc.reset),cres("Total:",asc.fg.margenta,asc.reset),
                                 cres(self.total,asc.fg.yellow,asc.reset),cres("Passed:",asc.fg.margenta,asc.reset),cres(self.passed,asc.fg.green,asc.reset),
                                 cres("Failed:",asc.fg.margenta,asc.reset),cres(self.failed,asc.fg.red,asc.reset)));
                              LoggerManager.report();
                        });

                        while(it.next());
                     }
               };

         };



         return{
            create: function(title,func){
               //to create encapsulate specs 
               // create("kicker tester",function(){
               // variable definitions heres
               //
               // it("should do something", function(){
               //       asserts(this).obj(1).toBe(1);
               // });
               //
               //});
               SuiteManager.add((function(){
                  var current = Suites();
                  current.title = title;
                  //run the func to prepare the suite 
                  func.call(current);
                  return current;
               })());

            },

            run: _su.proxy(SuiteManager.run,SuiteManager),
         }
      })();


      return {
         suite: Suite,
         expects: Expects,
         asserts: Asserts,
         logger: Logger,
         logman: LoggerManager,
         version: "0.1",
         license: "mit",
      };

   });

});

if(module && module.exports) module.exports = Jaz;
