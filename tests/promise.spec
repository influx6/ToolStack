var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;

	var promise = ts.Promise;

	o = promise.when('alex',true,promise.create(function(p){
		if(p) p.resolve('john');
	}));

	o.then(function(){
		console.log("passed",arguments);
	},function(){
		console.log("failed:",arguments);
	},function(){
		console.log("notifications:",arguments);
	});

