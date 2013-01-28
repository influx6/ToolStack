ToolStack.MessageAPI = (function(ts){


	var util = ts.Utility,
	helper = ts.Helpers.HashMaps,
	validator = function(value){
		if(util.isFunction(value)) return true;
		return false;
	},
	// process = function(api){
	// 	if(api.queue.length < 0) return false;

	// 	console.log('calling');

	// 	api.processing = true;

	// 	util.eachAsync(api.queue,function(e,i,o,fn){
	// 		var item = e;
	// 		item.fn(item.channel,item.domain,item.args);
	// 		o.shift();
	// 		fn(false)
	// 	},function(err){
	// 		api.processing  = false;
	// 		if(api.queue.length > 0) api.deliver();
	// 	},api);

	// 	return false;
	// },
	domain = util.clone(helper,{}),
	add = domain.add,
	modify = domain.modify,
	api = {};

	domain.add = function(key,value){
		return add.call(this,key,value,validator);
	};

	domain.modify = function(key,value){
		return modify.call(this,key,value,validator);
	};

	// api.queue = [];
	api.channels = {};
	api.processing = false;
	api.immediate = null;

	// api.deliver = function(){
	// 	if(this.processing) return;
	// 	process(this);
	// 	return this;
	// };

	api.notify = function(channel,domain){
		var channel = this.getChannel(channel),
			domain = domain,
			args = util.flatten(util.makeSplice(arguments,2,arguments.length));

		if(!channel) return false;

		if(this.immediate) channel.fire(domain,args);
		// else{
		// 	this.queue.push({ fn: function(channel,domain,args){
		// 		channel.fire(domain,args);
		// 	}, domain: domain, args: args, channel: channel });

		// 	// return this.deliver();
		// };
		
		return this;
	};

	api.addChannel = function(key){
		if(helper.exists.call(this.channels,key)) return false;

		var channel = {
			key:key, domains:{}
		};

		channel.fetch = util.proxy(domain.fetch,channel.domains);
		channel.add = util.proxy(domain.add,channel.domains);
		channel.remove = util.proxy(domain.remove,channel.domains);
		channel.modify = util.proxy(domain.modify,channel.domains);
		channel.fire = function(key,args){
			if(!channel.fetch(key)) return false;
			// var key = key, args = util.makeSplice(arguments,1,arguments.length);
			// args = util.flatten(args);
			return channel.fetch(key).apply(null,args);
		};

		return helper.add.call(this.channels,key,channel);
	};

	api.getChannel = function(key){
		return helper.fetch.call(this.channels,key);
	};

	api.sandbox = function(){
		return {
			notify: util.proxy(api.notify,api),
			getChannel: util.proxy(api.getChannel,api),
		};
	};

	return function(immediate){ 
		var clone = util.clone(api,{});
		clone.immediate = true;
		return clone;
	};

})(ToolStack);	