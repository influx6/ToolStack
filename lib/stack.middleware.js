ToolStack.Middleware = function(keygrator,comparator,fCallback){

	var util = ToolStack.Utility,
	ds = ToolStack.Structures,
	comparator = comparator,
	keygrator = keygrator;


	var handler = function(){
		var stack = arguments[0];
		var final = arguments[1];
		var args = util.makeSplice(arguments,2,arguments.length);
		var iterator = stack.getIterator();
		var found = true;

		function next(err){


			if(iterator.hasNext()){


				try{

					var step = iterator.item();
					var state = comparator.apply(null,[step.key].concat(args));
					var arity = step.middleware.length;


					iterator.next();

					if(err){ 
						if(arity === 4) step.middleware.apply(null,([err].concat(args)).concat(next));
						else return next(err);
					}else if(state && arity < 4){
						return step.middleware.apply(null,args.concat(next));
					}else{
						found = false;
					}

					next();

				}catch(e){
					next(e);
				}

			}else{
				if(!found && final && util.isFunction(final)) final.apply(null,args);
			}


		}

		next();


	};

	//comparator returns true or false when decided if a middleware should be runned
	//injector handles the injection of middleware into the stack;
	return function(finalCallback){
		var app = {};
			app.finalCallback = finalCallback || fCallback;
			app.stack = new ds.NodeList();
			app.use = function(key,fn){
					if(util.isFunction(key)){
						fn = key;
						key = keygrator();
					}
					else if(key && util.isFunction(fn)){
						key = keygrator(key);
					}
					else if(util.isObject(key)){
						if(!key['key'] || (!key['middleware'] || !util.isFunction(key['middleware']))) return;
						var middleware = key.middleware;
						middleware.key = key.key;
						fn = middleware;
						key = keygragtor(key.key);
					};

					this.stack.append({ key: key, middleware: fn});
			}; 
			app.start = function(){
					var args = util.arranize(arguments);
					handler.apply(this,[app.stack,app.finalCallback].concat(args));
			};

			return app;

	};

};

