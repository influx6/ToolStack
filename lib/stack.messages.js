ToolStack.MQ = (function(ts){


	var util = ts.Utility, 
		ds = ts.Structures,
		q = {},
		dq = ts.DelayQueue = function(ms,parrallel){

			var q = {
				queue: ds.Queue(),
				parrallel: parrallel || false,
				paused: false,
				flushed: false,
				timer: null,
				delay:ms,
				active: true,
				maxpool: 200,
			};

			q.isPending = function(){ return !!this.pending; };

			q.maxOut = function(){
				if(!this.pending && this.queue.length) return false;
				return true;
			};

			q.resume = function(){
				if(this.paused()) return;
				this.paused = false;
			};

			q.pause = function(){
				if(!this.paused) this.paused = true;
			};

			q.isPaused = function(){ return !!this.paused; };

			q.disable = function(){
				if(this.active) this.active = false;
			};

			q.isDisabled = function(){ return !this.active; };

			q.process = function(){
				if(!this.flushed && !this.pending) return;

				var self = this,
					delay = util.isNumber(this.delay) && !util.isInfinit(this.delay) ? this.delay : 0,
					curr = this.queue.shift();

				return (this.timer = util.delay(function(){
					self.process();
				},delay));
			};

			return q;
		}



	q.deliver = function(){};
	q.flush = function(){};
	q.notify = function(){};
	q.pause = function(){};
	q.resume = function(){};
	q.disable = function(){};
	q.disabled = function(){};

	return function(timeout){ 
	};

})(ToolStack);	

//to ensure backward compatibility with calls to MessageAPI instead of MQ
ToolStack.MessageAPI = ToolStack.MQ;