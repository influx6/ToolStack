var js = require('./ext/jsconcat');

js.compile({
	build_dir: ".",
	src_dir:"./lib",
	name:"extensions.js",
	uglify: true,
	src:['stack.toolchain.js','stack.env.js','stack.ascolors.js',
	'stack.class.js','stack.flux.js','stack.callbacks.js',
	'stack.events.js','stack.promise.js','stack.logger.js','stack.matchers.js',
	'stack.jaz.js','stack.structures.js']
})