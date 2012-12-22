var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;

})('Loader',function(global,callback){

	global.ToolStack.load(['ToolChain','Env','Callbacks','Promise'],function(ts){

		var Loader = { dirs:{} },
			utility = ts.ToolChain, Promise = ts.Promise;

		Loader.static = {
			env : ts.Env.detect(),
			same: ":same",
			matchr: /\/+/,
		};

		Loader.registerDir = function(title,location){
			if(typeof title !== 'string' || typeof location !== 'string') return false;
			if(this.dirs[title]) throw new Error("The title '"+title+"' is already assigned!");
			this.dirs[title] = location;
		};

		Loader.checkStatus = function(title){
			var valid = this.dirs[title];
			if(valid) return valid;
			return false;
		};

		Loader.resolve = function(start,end){
			var pile = (start.split(this.static.matchr)).concat(end.split(this.static.matchr));
			utility.normalizeArray(pile);
			return pile.join('/');
		};

		if(Loader.static.env === 'node'){

			Loader.transport = function(addr,callback){
				return function(){
					try{
						callback(null,require(addr));
					}catch(e){
						callback(e,null);
					}
				}
			};

		}else if(Loader.static.env === 'browser'){

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
				var series = Promise.create();
				utility.eachSync(stacks,function(e,i,o,fn){
					console.log(e);
					fn(false);
				},null,this);
			};

			Loader.load = function(title,file,_stack){
				var self = this,loc = self.checkStatus(title),dir = self.resolve(loc,file)
				,stack ,ext = {};

				stack = (utility.isArray(_stack)) ? _stack : [];

				stack.push([title,file,dir]);

				stack.then = function(t,f){
					var toc = (t === self.static.same) ? title : t;
					self.load(toc,f,this);
					return this;
				}

				stack.end = function(t,f){
					if(t && f) stack.then(t,f);
					delete stack.then; delete stack.end;
					self.processRequest(stack);
					return self;
				}

				return stack;
			}

		}


		var ns = ts.ns('Loader',Loader,global);
		if(callback) callback(global);
	   	if(typeof module !== 'undefined' && typeof require !== 'undefined'){
	   		module.exports = ns;
	   	}
	
	});
});
