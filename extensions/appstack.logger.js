"use strict";
!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func);
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func;

}("Logger",function(EM){

      EM.create("Logger",function(toolchain,asc,Console){

         return {
            name: "AppStack.Logger",
            version: "1.0.0",
            description: "simple Logging system",
            licenses:[ { type: "mit", url: "http://mths.be/mit" }],
            author: "Alexander Adeniyin Ewetumo", 
            init: function(title,debug){
               var title = title, debug = debug,logs = [];

               return {

                     log: function(message){
                        logs.push(message);
                        return this;
                     },

                     warn: function(message){
                        logs.push(message);
                     },

                     print: function(){
                        var count = 0;
                        if(title && debug) Console.display(title);
                        var iterator = toolchain.iterable(logs,function(e,i,b){
                           Console.display(toolchain.makeString("\n",e));
                           count += 1;
                        },function(e,i,b){
                           if(!debug) return;
                           Console.display(toolchain.makeString(" ","Total Log Count:",count));
                        });

                        while(iterator.next());
                     },

                     flush: function(){
                        toolchain.explode(logs);
                     }
               };

            },


        },["ToolChain","ASColor","Console"]);

});
