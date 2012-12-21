require('../toolstack').load(['toolchain','env','ascolor','matchers'],function(ts){

	var matchers = ts.Matchers,
		assert = require('assert');

	assert.equal(typeof matchers, 'function');

	var basic = 'Basics Tests';
	matchers(1,basic).toBe(1);
	//matchers(3).notToBe(3);
	matchers('basic').isTypeOf('string');

});

