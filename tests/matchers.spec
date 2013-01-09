var ts = require('../builds/toolstack.js').ToolStack;
var matchers = ts.Matchers,
	assert = require('assert');

assert.equal(typeof matchers, 'function');

var basic = 'Basics Tests';
matchers(basic).obj(1).toBe(1);
//matchers(3).notToBe(3);
matchers().obj('basic').isTypeOf('string');



