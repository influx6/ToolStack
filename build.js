var js = require('./ext/jsconcat');

js.compile({
	build_dir: "./builds",
	src_dir:"./lib",
	name:"extensions.js",
	uglify: true,
	src:['stack.toolchain.js','stack.env.js','stack.ascolors.js',
	'stack.class.js','stack.flux.js','stack.callbacks.js',
	'stack.events.js','stack.promise.js','stack.console.js','stack.logger.js','stack.matchers.js',
	'stack.jaz.js','stack.structures.js','stack.stalk.js','stack.init.js']
});

js.compile({
	build_dir: "./builds",
	src_dir:".",
	name:"toolstack.full.js",
	uglify: true,
	src:['toolstack.js','/builds/extensions.js']
});