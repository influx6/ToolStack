var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("ExtInit",function(global){

	var ext = global, ts = ext.ToolStack,initalized = false;

	if(!initalized){
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

		initalized = true;
	}

});