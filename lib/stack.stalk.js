var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("Stalk",function(ToolStack){

	var Stalk = {
		 name: "ToolStack.Stalk",
         version: "0.0.2",
         description: "a basic exception managment library for functional programming",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo"
	};

	Stalk.init = function(rescueCallback){
		this._rescueCallback = rescueCallback;
		this._parent = Stack.current;
	};

	Stalk.current = null;


	ToolStack.Stalk = Stalk;

});