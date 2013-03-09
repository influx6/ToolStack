ToolStack.Errors = (function(){

	var util = ToolStack.Utility,
		c = ToolStack.Class,
		abstracterror = function AbstractError(name){
			var e = function AbstractInstance(message,constr){
				Error.call(this,message);
				Error.captureStackTrace(this,constr || arguments.callee);
				this.message = message;
			};

			c.inherit(e,Error);

			e.prototype.name = name;

			// e.prototype.pretty = function(){
			// 	util.forEach(this.stack,function(frame,index,obj){ 
			// 		console.log('frames:',frame);
			// 		console.error('call: %s: %d - %s',frame.getFileName(),
			// 			frame.getLineNumber(),frame.getFunctionName());
			// 	});
			// };

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