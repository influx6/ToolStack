ToolStack.Timer = function(){
	
	var util = ToolStack.Utility,
	ticker = function(fn){ 
		var handle = fn; 
		this.tickable = false;
		this.use = function(fn){ 
			if(!util.isFunction(fn)) return;
			this.handle = fn;
		};
	};
	ticker.fn = ticker.prototype;
	ticker.fn.tick = function(ms){
		if(ms) return util.delay(this.handle,ms);
		return this.handle();
	};

	return {
		proto: ticker,
		Simplex: function(fn){ return new ticker(fn);},
		Looper: function(fn){
			var c = new ticker(fn), old = c.tick;
			c.tick = function(ms){
				this.tickable = true;
				this.clock = util.delay(function())
			};
			c.untick = function(){
				this.tickable = false;
			};

		}
	};
}();