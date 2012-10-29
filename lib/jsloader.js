//basic file and dependency loader used every in extension manager and appstack
"use strict";
var root = this;
!function(name,func){
   //check for specific module's systems else add it to the global
   if(typeof define === "function") define(func);
   else if(typeof module !== "undefined") module.exports = func;
   else this[name] = func;

}("JsLoader",function(){

	//first we check if env.js is loaded by checking for global for Env object
	if(typeof root.Env === 'undefined' || root.Env.name !== 'Env') throw new Error("Please load up the file ./lib/env.js, I need it to work!");
	var env = root.Env;

});