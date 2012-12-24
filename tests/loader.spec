var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;

	var loader = g.Loader;
	loader.registerDir('lib',__dirname.concat('/../lib/'));
	loader.registerDir('tests',__dirname.concat('/../tests/'));
	loader.registerDir('loaders',__dirname.concat('/../tests/loaders/'));

	loader.load('lib','stack.ascolors.js').then(":same","stack.matchers.js").end(function(klass,callback){
			klass.ASColors(g.ToolStack);
			callback.Matchers(g.ToolStack);
			console.log(g);
	});


