var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;

})('Loader',function(global,callback){


		var Loader = { dirs:{} },ts = global.ToolStack,utility,Promise;

		//setup need extensions
		global.ToolChain(ts); 
		global.Callbacks(ts); 
		global.Promise(ts); 
		global.Env(ts);

		utility = ts.ToolChain; Promise = ts.Promise;

		Loader.static = {
			env : ts.Env.detect(),
			same: ":same",
			matchr: /\/+/,
		};

		Loader.registerDir = function(title,location){
			if(typeof title !== 'string' || typeof location !== 'string') return false;
			if(this.dirs[title]) throw new Error("The title '"+title+"' is already assigned!");
			this.dirs[title] = this.resolve(location,"");
		};

		Loader.checkStatus = function(title){
			var valid = this.dirs[title];
			if(valid) return valid;
			return false;
		};



		if(Loader.static.env === 'node'){
			var path = require('path');

			Loader.resolve = function(start,end){
				// var pile = (start.split(this.static.matchr)).concat(end.split(this.static.matchr));
				// utility.normalizeArray(pile);
				// return pile.join('/');
				return path.resolve(start,end);
			};

			Loader.transport = function(addr,callback){
				// return function(){
					try{
						callback(null,require(addr));
					}catch(e){
						callback(e,null);
					}
				// }
			};

			Loader.processRequest = function(stacks,callback){
				var self = this,memory = [];
				utility.eachSync(stacks,function(e,i,o,fn){
					self.transport(e,function(err,item){
						if(err) throw err;
						memory.push(item);
						fn(false);
					});
				},function(){
					console.log('called!');
					if(callback) callback.apply(null,memory);
				},this);
			};

		};

		if(Loader.static.env === 'browser'){

			Loader.resolve = function(start,end){
				var pile = (start.split(this.static.matchr)).concat(end.split(this.static.matchr));
				utility.normalizeArray(pile);
				return pile.join('/');
			};

			Loader.transport = function(addr,callback,async,defer){
				var script = document.createElement('script');
	            // script.setAttribute('id',addr.toLowerCase());
	            script.type = "text/javascript";
	            script.async = async || false;
	            script.defer = defer || false;
	            script.src = addr;
	            script.onload = script.onreadystatechange = function(){
	              if(!script.readyState || script.readyState.match(/^completed$|^loaded$/ig)){
	                (function(a){ callback(false,a); })(script)
	                script.onload = script.onreadystatechange = null;
	              }
	            };
	            script.onerror = function(){
	                (function(a){ callback(true,a); })(script)
	            	script.onerror = null;
	            };

	            return script;
			};

			Loader.processRequest = function(stacks){
				var self = this,series,scriptPromise;

				scriptPromise = function(item){
					return Promise.create(function(o){
						var script = self.transport(item,function(err,source){
						 	if(err) o.reject(new Error(source.src+" Resource not found!"));
						 	o.resolve(source);
						});
						document.head.appendChild(script);
					},true,false);
				};

				series = scriptPromise(stacks.shift());

				utility.eachSync(stacks,function(e,i,o,fn){
					series.done(function(source){
						series = scriptPromise(e);
						fn(false);
					});
				},null,this);

			};

		}

		Loader.load = function(title,file,_stack){
			var self = this,loc = self.checkStatus(title),dir = self.resolve(loc,file)
			,stack ,ext = {};

			stack = (utility.isArray(_stack)) ? _stack : [];

			stack.push(dir);

			stack.then = function(t,f){
				var toc = (t === self.static.same) ? title : t;
				self.load(toc,f,this);
				return this;
			}

			stack.end = function(callback){
				delete stack.then; delete stack.end;
				self.processRequest(stack,callback);
				return self;
			}

			return stack;
		};

		var ns = ts.ns('Loader',Loader,global);
		if(callback) callback(global);
	   	if(typeof module !== 'undefined' && typeof require !== 'undefined'){
	   		module.exports = ns;
	   	}
	
});
