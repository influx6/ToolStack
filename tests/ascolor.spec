var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;

//first pollute the global String object with color definitions;
ts.ASColors();

var assert = require('assert'),
	sproto = String.prototype;


//test basic color type methods
assert.equal(Boolean(sproto.cyan),true);
assert.equal(Boolean(sproto.green),true);
assert.equal(Boolean(sproto.blue),true);
assert.equal(Boolean(sproto.yellow),true);
assert.equal(Boolean(sproto.magenta),true);


//test grayscale type methods
assert.equal(Boolean(sproto.white),true);
assert.equal(Boolean(sproto.grey),true);
assert.equal(Boolean(sproto.black),true);

//test defacement type methods
assert.equal(Boolean(sproto.bold),true);
assert.equal(Boolean(sproto.italic),true);
assert.equal(Boolean(sproto.underline),true);
assert.equal(Boolean(sproto.inverse),true);

require('../toolstack').load(['toolchain','env','ascolor'],function(ts){

	//first pollute the global String object with color definitions;
	ts.ASColors();

	var assert = require('assert'),
		sproto = String.prototype;


	//test basic color type methods
	assert.equal(Boolean(sproto.cyan),true);
	assert.equal(Boolean(sproto.green),true);
	assert.equal(Boolean(sproto.blue),true);
	assert.equal(Boolean(sproto.yellow),true);
	assert.equal(Boolean(sproto.magenta),true);


	//test grayscale type methods
	assert.equal(Boolean(sproto.white),true);
	assert.equal(Boolean(sproto.grey),true);
	assert.equal(Boolean(sproto.black),true);

	//test defacement type methods
	assert.equal(Boolean(sproto.bold),true);
	assert.equal(Boolean(sproto.italic),true);
	assert.equal(Boolean(sproto.underline),true);
	assert.equal(Boolean(sproto.inverse),true);

});
