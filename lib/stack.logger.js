var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
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
                        if(title && debug) console.display(title);
                        toolchain.forEach(logs,function(e,i,b){
                           console.log(toolchain.makeString("\n",e));
                           count += 1;
                        },this,null,function(e,i,b){
                           if(!debug) return;
                           console.log(toolchain.makeString(" ","Total Log Count:",count));
                        });

                     },

                     flush: function(){
                        toolchain.explode(logs);
                     }
               };

            },

      };

});