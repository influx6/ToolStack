ToolStack.Jaz = (function(toolstack){


     if(!String.prototype.white) toolstack.ASColors();
     
      //main functions 
     var _su = toolstack.Utility,
         Console = toolstack.Console,
         errors = toolstack.Errors,
         Time = Date,
         sig = "__suites__",
         id = _su.guid(),
         Suite =  {
                    guid : id,
                     signature: sig,
                     showDebug: false,
                     specs : [],
                     before : null,
                     after : null,
                     total : 0,
                     passed : 0,
                     failed : 0,
                     title: "",
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
                        Console.log("Info:".green +" Running Jaz Suite '".grey.bold + this.title.bold.green +"';".grey+"\n");
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
                                 if(j instanceof errors.MatcherError) self.failed += 1;
                                 else throw j;
                              }
                              fn(false);
                        },function(e,i,b){
                              var message = _su.makeString("   ",("Total Passed:".bold.grey + (" "+self.passed).bold.green),
                                 ("Total Failed:".bold.grey + (" "+ self.failed).bold.red), ("Total Runned:".bold.grey + (" "+self.total).bold.yellow) + "\n");
                              Console.log(message);
                        },self);

                    }
        };

        return {
              name: "ToolStack.Jaz",
              version: "1.0.0",
              description: "simple lightweight tdd style testing framework",
              licenses:[ { type: "mit", url: "http://mths.be/mit" }],
              author: "Alexander Adeniyin Ewetumo", 
              license: "mit", 
              create: function JazCreate(title,func){
                 //to create encapsulate specs 
                 // create("kicker tester",function(){
                 // variable definitions heres
                 //
                 // it("should do something", function(){
                 //       asserts(this).obj(1).toBe(1);
                 // });
                 //
                    //});

                 Console.init('console');

                 var current = _su.clone(Suite,{});
                 current.title = title;
                 //run the func to prepare the suite 
                 func.call(current);
                 return current; 

              },
              createManager: function(){
                var man = { 
                    queue:[], 
                    add: function(title,func){
                        this.queue.push(toolstack.Jaz.create(title,func));
                    },
                    run: function(){
                        _su.forEach(this.queue,function(e,i,o){
                            if(_su.isObject(e)) return e.run();
                        });
                    },
                    flush: function(){
                        return _su.exlode(this.queue);
                    }
                };

                return man;
              },
        };


})(ToolStack);

