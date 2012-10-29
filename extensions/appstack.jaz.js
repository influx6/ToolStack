"use strict";
!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func)
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func; 
}("Jaz",function(EM){

   EM.create("Jaz", function(toolchain,ascolor){
      //main functions 
     var _su = toolchain,
         asc = ascolor,
         Time = Date,
         newline = "\n",
         tabline = "\t",
         spaceline = " ",
          //ascii colors range from 30 t0 36,where 30 is black
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

               return this;
            },

            run: _su.proxy(SuiteManager.run,SuiteManager),
         }
      })();


      return {
         name: "AppStack.Jaz",
         version: "1.0.0",
         description: "simple lightweight tdd style testing framework",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo", 
         suiteman: Suite,
         expects: Expects,
         asserts: Asserts,
         logger: Logger,
         logman: LoggerManager,
         license: "mit",
      };

   },["ToolChain","ASColor"]);

});
