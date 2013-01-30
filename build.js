var js = require('jsconcat');

js.compile({
	build_dir: "./builds",
	src_dir:".",
	name:"toolstack.js",
	uglify: false,
	src:['toolstack.js','./lib/stack.utility.js','./lib/stack.env.js','./lib/stack.ascolors.js',
	'./lib/stack.class.js','./lib/stack.flux.js','./lib/stack.console.js',
	'./lib/stack.callbacks.js','./lib/stack.errors.js',
	'./lib/stack.events.js','./lib/stack.promise.js',
	'./lib/stack.matchers.js','./lib/stack.jaz.js','./lib/stack.structures.js',
	'./lib/stack.stalk.js',
	'./lib/stack.middleware.js','./lib/stack.helpers.js','./lib/stack.messages.js']
});
