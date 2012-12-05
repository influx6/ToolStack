var ts = require(__dirname+'/../toolstack'),
	jz = require(__dirname+'/../frameworks/jaz'),
	assert = require('assert');

//callup assertions of loaded modules;	

	assert.equal(typeof ts,'object');
	assert.equal(typeof jz,'function');

//load up the necessary libraries
	
	ts.load('toolchain',function(){
		assert.equal(Boolean(ts.ToolChain),true);
	});

	ts.load('callbacks',function(){
		assert.equal(Boolean(ts.Callbacks),true);
	});

	ts.load('env',function(){
		assert.equal(Boolean(ts.Env),true);
	});

	ts.load('logger',function(){
		assert.equal(Boolean(ts.Logger),true);
	});

	ts.load('promise',function(){
		assert.equal(Boolean(ts.Promise),true);
	});

	ts.load('events',function(){
		assert.equal(Boolean(ts.Events),true);
	});

	ts.load(['class','structures'],function(){
		assert.equal(Boolean(ts.Class),true);
		assert.equal(Boolean(ts.Structures),true);
	});	

	ts.load(['cluster','fractures'],function(){
		assert.equal(Boolean(ts.Cluster),false);
		assert.equal(Boolean(ts.Fractures),false);
	});