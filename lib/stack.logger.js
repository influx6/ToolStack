(function(name,fn){
	if(typeof define === 'function') define(fn);
	else if(typeof module !== 'undefined') module.exports = fn;
	else this[name] = fn;
})("Logger",function(ToolStack){
	
	  if(!ToolStack.ToolChain) throw new Error("Please loadup stack.toolchain.js first!");

	  var toolchain = ToolStack.ToolChain;
      ToolStack.Logger = {
         name: "ToolStack.Logger",
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
                           console.display(toolchain.makeString("\n",e));
                           count += 1;
                        },function(e,i,b){
                           if(!debug) return;
                           console.display(toolchain.makeString(" ","Total Log Count:",count));
                        });

                        while(iterator.next());
                     },

                     flush: function(){
                        toolchain.explode(logs);
                     }
               };

            },

      };

});