ToolStack.Errors = (function(){

	var abstracterror = function AbstractError(name){
		var e = function AbstractInstance(message){
			Error.captureStackTrace.call(this,this);
			this.message = message;
		};
		e.prototype = new Error;
		e.prototype.name = name;
		return e;
	},
	noop = function(){};

	return {
		DatabaseError : abstracterror('DatabaseError'),
		MatcherError : abstracterror('MatcherError'),
		createError: function(name){
			return abstracterror(name);
		}
	};

})();