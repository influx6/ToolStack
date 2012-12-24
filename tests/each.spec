var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;
	
	var col = [1,2,3,4,5,6,7,8,9,10,30], col2= { 1: 'one', 2: 'two', 3: 'three'},
	utility = ts.ToolChain;

	insert = function(x,fn){
		var time = Math.ceil(Math.random() * 3000);
		return setTimeout(function(){ 
			fn.call(null,x); 
		},time);
	};

	// utility.eachAsync(col2,function(x,i,o,fn){
	// 	insert(x,function(b){
	// 		console.log("process item",b);
	// 		fn(null);
	// 	});
	// },function(err){
	// 	console.log('All items processed!');
	// },null,function(y){
	// 	if(y > 11) return false;
	// });

	utility.eachSync(col,function(x,i,o,fn){
		insert(x,function(b){
			console.log("process item",b);
			fn(null);
		});
	},function(err){
		console.log('All items processed!');
	},null,function(y){
		if(y > 11) return true;
	});

