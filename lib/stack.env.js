ToolStack.Env =  {
         name: "ToolStack.Env",
         version: "1.0.0",
         description: "simple environment detection script",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",  
         detect: (function(){ 
            var envs = {
               unop: function(){ return "unknown" },
               node: function(){ return "node" },
               headless: function(){ return "headless" },
               browser: function(){ return "browser" },
               rhino: function(){ return "rhino" },
               xpcom: function(){ return "XPCOMCore" },
            };

            //will check if we are in a browser,node or headless based system
            if(typeof XPCOMCore !== "undefined"){
               return envs.xpcom;
            }
            else if(typeof window === "undefined" && typeof java !== 'undefined'){
               return envs.rhino;
            }
            else if(typeof window !== "undefined" && typeof window.document !== 'undefined'){
               return envs.browser;
            }
            else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
               //test further
               var lt = {
                  fs: !require('fs'),
                  path: !require('path')
               };

               return envs.node;
            }else{
               return detect = envs.unop;
            }
         })()

};