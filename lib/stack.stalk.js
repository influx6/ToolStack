ToolStack.Stalk = {
		 name: "ToolStack.Stalk",
         version: "0.0.2",
         description: "a basic exception managment library for functional programming",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",

         init : function(rescueCallback){
			this._rescueCallback = rescueCallback;
			this._parent = Stack.current;
		}
};
