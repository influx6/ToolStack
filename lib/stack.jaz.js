var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("Jaz",function(toolstack){

     toolstack.need(['ToolChain','Logger','ASColors']);

     if(!String.prototype.white) toolstack.ASColors();

      //main functions 
     var _su = toolstack.ToolChain,
         Time = Date,
         sig = "__suites__";
     toolstack.Jaz = (function(){

            var SuiteManager  = {
               lists : [],
               add: function(o){ 
                  if(!o.signature || o.signature !== sig) return;
                  this.lists.push(o);
               },
               run: function(){
                  var self=this,
                  iterator = _su.eachSync(self.lists,function(e,i,b){
                     if(!e.signature || e.signature !== sig) return;
                     e.run();
                  },function(e,i,b){
                     _su.explode(b);
                  },this);

               }

            },

            Suites = function(){

                  return {
                     signature: sig,
                     showDebug: false,
                     Logger : toolstack.Logger.init("Suite Log Reports:"),
                     specs : [],
                     before : null,
                     after : null,
                     total : 0,
                     passed : 0,
                     failed : 0,
                     sandbox: {},
                     it : function(desc,fn){
                        //add the desc as a property of fn 
                        fn.desc = desc; fn.suite = this.title;
                        this.specs.push(fn);
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
                            it = _su.eachAsync(this.specs,function(e,i,b,fn){
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

                              fn();
                        },function(e,i,b){
                              var message = _su.makeString("   ",("Total Passed:".bold.magenta + (" "+self.passed).bold.green),
                                 ("Total Failed:".bold.magenta + (" "+self.passed).bold.red), ("Total Test:".bold.magenta + (" "+self.total).bold.yellow));
                              this.Logger.log(message);
                              this.Logger.print();
                        },self);

                     }
            };

         };



         return{
            name: "ToolStack.Jaz",
            version: "1.0.0",
            description: "simple lightweight tdd style testing framework",
            licenses:[ { type: "mit", url: "http://mths.be/mit" }],
            author: "Alexander Adeniyin Ewetumo", 
            license: "mit", 
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

               // var current = Suites();
               // current.title = title;
               // //run the func to prepare the suite 
               // func.call(current);
               // return current; 

               return this;
            },

            run: _su.proxy(SuiteManager.run,SuiteManager),
         }
      })();

});
