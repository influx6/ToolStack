"use strict";
!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func)
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func; 
}("Jaz",function(toolchain,logger){

      //main functions 
     var _su = toolchain,
         asc = ascolor,
         Time = Date,
         newline = "\n",
         tabline = "\t",
         spaceline = " ",
         clockIt = function(fn){
            var start = Time.getTime();
            fn.call(this);
            var end = Time.getTime() - start;
            return end;
         },
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

});
