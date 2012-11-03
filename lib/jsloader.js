//basic file and dependency loader used every in extension manager and appstack
"use strict";
var root = { node: {}};

!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func);
   else if(typeof module !== "undefined"){ 
   		root.node.module = module; 
   		root.node.process = process;
   		root.node.require = module.require;
	    module.exports = func; 
	}
   else this[name] = func;

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
		xhrObject = {
			xhr: XMLHttpRequest,
			//mxml: 
		},
		env = envdetect;



	!function(){
			if(env.detect() === entypes.browser){
				shell.require = shell.webRequire;
			}
			else if(env.detect() === entypes.node){
				shell.require =  root.node.require;
			}
			shell.env = env.detect();
			return;
	}();


	//uses ajax,script insertion and other methods or jump towards node require
	shell.webRequire = function(uri){

	};

	shell.xhr = function(){
		try{

		}
		catch(Exception e){

		}
	};

	shell.script = function(document,src,fn){
		var script = document.createElement("script"),
			head = document.head || document.getElementsByTagName('head');

		script.type = 'text/javascript';
		script.src = src;

		script.onload = script.onreadystatechange = function(e){
			if(!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')){
				script.onload = script.onreadystatechange = null;
				fn(script);
				head.removeChild(script);
			}
		};

		head.insertBefore(script,head.firstChild);
	};

	shell.scriptInserts = function(src,fn){
		
	};

	shell.ajaxRequire = function(uri){
		
	};


	return shell;
});