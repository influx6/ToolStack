var master = window || module;

!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func)
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func; 
}("StackUtils",(function(root){

    var filematchr = /file:\/\/\//,
        urlmatchr = /^http:\/\/|^https:\/\//,
        jsmatchr = /\.js$/,
        Shell = {
            name: "ShellUtil",
            version: "1.0.0",
            description: "simple environment detection script",
            licenses:[ { type: "mit", url: "http://mths.be/mit" }],
            author: "Alexander Adeniyin Ewetumo"
        };

    Shell.Env = {
        name: "Env",
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

    //barebone request object on browsers uses ajax and on node uses http and require,very barebone
   Shell.COM = (function(env){

               //first we check if env.js is loaded by checking for global for Env object
               if(typeof env === 'undefined' || env.name !== 'Env') 
                  throw new Error("Please load up the file ./lib/env.js, I need it to work!");

               //basic setup,checking up on specific existence
               var shell = {
               },
               entypes = {
                  node: 'node',
                  browser: 'browser',
                  headless: 'headless'
               };
              


               if(env.detect() === entypes.browser){
                  (function(){

                     var window = root,
                        document = window.document;

                     shell.env = env.detect();

                     //here we find the best working xhr object
                     shell.requestObject = (function(){
                        try{
                           new XMLHttpRequest();
                           return function(){
                              return new XMLHttpRequest();
                           };
                        }
                        catch(e){
                           var msxml = [
                                'Msxml2.XMLHTTP.3.0',
                                'Msxml2.XMLHTTP',
                                'Microsoft.XMLHTTP',
                                'Msxml2.XMLHTTP.6.0'
                              ],
                              x = 0,len = msxml.length;
                           for(; x < len; x++){
                              try{
                                 new ActiveXObject(msxml[x]);
                                 return function(){
                                    return new ActiveXObject(msxml[x]);
                                 };
                                 break
                              }
                              catch(e){
                                 throw e;
                              }
                           };
                        }
                     })();

                     shell.checkSuccess = function(rb){
                        try{
                          return ((!rb.status && window.location === 'file:') ||
                                   (rb.status >= 200 && tb.status < 300) || 
                                   rb.status === 1227 || rb.status === 304 || rb.status === 0 )
                        }catch(e){}

                        return false;

                     };

                     shell.make = function(uri,success,error){
                        var http = this.requestObject();
                        http.onreadystatechange = function(o){
                           if(http.readyState === 4){
                            //if request was aborted
                              shell.checkSuccess(http) ? success(http) : error(http);
                           }
                        };
                        http.open('GET',uri,true);
                        http.send(null);

                     }


                  })();
               }; 


               if(env.detect() === entypes.node){
                  (function(){

                     shell.env = env.detect();
                     shell.fsRequest = require('fs');
                     shell.httpRequest = require('http');


                     shell.requestObject = function(uri){

                     };

                     shell.make = function(){

                     };


                  })();
               }; 

               return shell;

      })(Shell.Env);

      Shell.Transport = {

        simple: {
          get: function(o){ return o; },
        },

        ajax: {

          get: function(uri){

          }
        },

        webScript: {
          get: function(o){

          },

          scripts: function(url){

          }
        },

        nodeRequire:{
          get: function(url){
            
          }
        }      
    };

    return Shell;
})(master));
