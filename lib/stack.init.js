var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("ExtInit",function(global){

	var ext = global, ts = ext.ToolStack;

	if(!ts.extensionized){
		ext.ToolChain(ts); 
		ext.Env(ts);	
		ext.ASColors(ts); 
		ext.Console(ts); 
		ext.Matchers(ts);
		ext.Flux(ts);
		ext.Class(ts);
		ext.Callbacks(ts); 
		ext.Events(ts); 
		ext.Promise(ts); 
		ext.Logger(ts);
		ext.Structures(ts);
		ext.Jaz(ts);
		ext.Stalk(ts);
		ts.extensionized = true;

		delete ext.ToolChain;
		delete ext.Env;
		delete ext.Console;
		delete ext.Matchers;
		delete ext.Flux;
		delete ext.ASColors;
		delete ext.Class;
		delete ext.Callbacks;
		delete ext.Events;
		delete ext.Promise;
		delete ext.Logger;
		delete ext.Jaz;
		delete ext.Stalk;
		delete ext.Structures;
		delete ext.ExtInit;
	}

});