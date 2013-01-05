var module = module || { exports: {}};

(function(exports){


		var Loader = { dirs:{} },ts = exports.ToolStack,utility,Promise;

		utility = ts.Utility; Promise = ts.Promise;

		Loader.static = {
			env : ts.Env.detect(),
			same: ":same",
			matchr: /\/+/,
		};

		// Loader.registerDir = function(title,location){
		// 	if(typeof title !== 'string' || typeof location !== 'string') return false;
		// 	if(this.dirs[title]) throw new Error("The title '"+title+"' is already assigned!");
		// 	this.dirs[title] = this.resolve(location,"");
		// };

		// Loader.checkStatus = function(title){
		// 	var valid = this.dirs[title];
		// 	if(valid) return valid;
		// 	return false;
		// };

		// if(Loader.static.env === 'node'){
		// 	var path = require('path');

		// 	Loader.resolve = function(start,end){
		// 		return path.resolve(start,end);
		// 	};

		// 	Loader.transport = function(addr,callback){
		// 		try{
		// 			callback(null,require(addr));
		// 		}catch(e){
		// 			callback(e,null);
		// 		}
		// 	};

		// 	Loader.processRequest = function(stacks,callback){
		// 		var self = this,memory = [];
		// 		utility.eachSync(stacks,function(e,i,o,fn){
		// 			self.transport(e,function(err,item){
		// 				if(err) throw err;
		// 				memory.push(item);
		// 				fn(false);
		// 			});
		// 		},function(){
		// 			console.log('called!');
		// 			if(callback) callback.apply(null,memory);
		// 		},this);
		// 	};

		// 	Loader.load = function(title,file){
		// 		return this.engine(title,file,this.transport);
		// 	};

		// };

		if(Loader.static.env === 'browser'){

			Loader.resolve = function(start,end){
				var pile = (start.split(this.static.matchr)).concat(end.split(this.static.matchr));
				utility.normalizeArray(pile);
				return pile.join('/');
			};

			Loader.scriptTransport = function(addr,callback){
				var obj = document.createElement('script');
	            obj.src = addr;

	            obj.setAttribute("id",addr);
	            // obj.style.visibility = "hidden";

	            obj.onload = obj.onreadystatechange = function(){
	              if(!obj.readyState || obj.readyState.match(/^completed$|^loaded$/ig)){
	                callback(false,obj,addr);
	                obj.onload = obj.onreadystatechange = null;
	              }
	            };

	            obj.onerror = function(){
	            	console.log("calling error:",addr);
	                callback(true,null,addr); obj.onerror = null;
	            };

	            return obj;
			};


			Loader.processRequest = function(stacks,transport,callback){
				var self = this,when,series;

				function scriptPromise(item){
					return pros = Promise.create(function(p){
						var script = transport(item,function(err,o,path){
							if(err) return p.reject(new Error("Resouce Not Found:",path));
							return p.resolve(path);
						});
						document.head.appendChild(script);
					});
				};

				// stacks.unshift("./");

				series = scriptPromise(stacks.shift());

				utility.eachAsync(stacks,function(e,f,o,cb){
					series.done(function(path){
						series = scriptPromise(e);
						cb(false);
					});
				},function(){
					if(callback) series.done(callback);
				});

			};

			Loader.script = function(){
				var args = utility.arranize(arguments),self = this,cb;

				if(args.length === 1 && !utility.isString(args[0])) return false;

				cb = args[args.length - 1];
				if(utility.isFunction(cb)){
					args.pop();
				}else cb = function(){};

				// function scriptInsert(source){
				// 	var script = document.createElement('script');
				// 	script.src = source;
				// 	document.head.appendChild(script);
				// };

				return this.processRequest(args,self.scriptTransport,cb);
			};

		};

		exports.Loader = Loader;
	
})(module.exports);
