var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;

	var matchers = ts.Matchers,
		assert = require('assert');

	assert.equal(typeof matchers, 'function');

	var basic = 'Basics Tests';
	matchers(1,basic).toBe(1);
	//matchers(3).notToBe(3);
	matchers('basic').isTypeOf('string');



