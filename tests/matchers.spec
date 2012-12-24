<<<<<<< HEAD
var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;
=======
require('../toolstack').load(['toolchain','env','ascolor','matchers'],function(ts){
>>>>>>> 50f6799c7e9280a98525cefd71d73355b6f76624

	var matchers = ts.Matchers,
		assert = require('assert');

	assert.equal(typeof matchers, 'function');

	var basic = 'Basics Tests';
	matchers(1,basic).toBe(1);
	//matchers(3).notToBe(3);
	matchers('basic').isTypeOf('string');

<<<<<<< HEAD

=======
});
>>>>>>> 50f6799c7e9280a98525cefd71d73355b6f76624

