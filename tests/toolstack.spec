require('../toolstack').load(['class','toolchain','callbacks','logger','env',
	'cluster','fractures','events','promise','structures','matchers'],
	function(ts){

	var	assert = require('assert');
		//test existence of standard loaded libs

		assert.equal(Boolean(ts.Callbacks),true);
		assert.equal(Boolean(ts.Env),true);
		assert.equal(Boolean(ts.Logger),true);
		assert.equal(Boolean(ts.Promise),true);
		assert.equal(Boolean(ts.Events),true);
		assert.equal(Boolean(ts.ToolChain),true);
		assert.equal(Boolean(ts.Class),true);
		assert.equal(Boolean(ts.Structures),true);
		assert.equal(Boolean(ts.Matchers),true);

		//checking for non-existent files

		assert.equal(Boolean(ts.Cluster),false);
		assert.equal(Boolean(ts.Fractures),false);
	}
);	

