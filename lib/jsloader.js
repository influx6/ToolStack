//basic file and dependency loader used every in extension manager and appstack
"use strict";
var root = { browser:{}, node: {}};

!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func);
   else if(typeof module !== "undefined"){ 
   		root.node.module = module; 
   		root.node.process = process;
   		root.node.require = module.require;
	    module.exports = func; 
	}
    else{
	    root.browser.window = window;
	    root.browser.document = window.document;
		root.browser.window[name] = func;
    } 
}("JsLoader",function(envdetect){

	//first we check if env.js is loaded by checking for global for Env object
	if(typeof envdetect === 'undefined' || envdetect.name !== 'Env') 
		throw new Error("Please load up the file ./lib/env.js, I need it to work!");

	//basic setup,checking up on specific existence
	var shell = {},
		entypes = {
			node: 'node',
			browser: 'browser',
			headless: 'headless'
		},
		urlmatchr = /^http:\/\//,
		jsmatchr = /\.js$/,
		env = envdetect;


	if(env.detect() === entypes.browser){
		(function(){

			shell.require = shell.webRequire;
			shell.env = env.detect();

			var xhrs = {
				xhr: function xhr(){ return new XMLHttpRequest() },
				mxml: function xml(){ },
				mxml3: function xml(){ },
				mxml6: function xml(){ },
				mxml2: function xml(){ },
			};

			//uses ajax,script insertion and other methods or jump towards node require
			shell.require = function(uri){

			};

			shell.xhr = function(){
				try{

				}
				catch(e){
					throw e;
				}
			};

			shell.script = function(document,src,fn){
				var script = document.createElement("script");

				script.type = 'text/javascript';
				script.src = src;

				script.onload = script.onreadystatechange = function(e){
					if(!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')){
						script.onload = script.onreadystatechange = null;
						fn(script);
						head.removeChild(script);
					}
				};

				return script;
			};

			shell.scriptInserts = function(src,fn){
					head = document.head || document.getElementsByTagName('head');
			};

			shell.ajaxRequire = function(uri){
				
			};

		})();
	};	


	if(env.detect() === entypes.node){
		(function(){

			shell.env = env.detect();

			//basic libs needed
			var http = require('http'),
				enhanced = false;

			//here we check the existence of certain features
			if(typeof root.node.require !== 'function') enhanced = true;

			shell.require = function(src,fn){
				//return root.node.require(src);

			};



		})();
	};	

	return shell;
});