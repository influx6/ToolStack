//local build script,unless directories are located within your system,or you clone the git repos,do not use,if you
//do decide to clone,set the src_dir and src paths as needed,needs jsconcat to build minified sources

var jsconcat = require("jsconcat").compile,
	
	extmgr = {		
		name: "extmgr.min.js",
		src_dir: ".",
		src:["../extensionmgr/extensionmgr.js"],
		build_dir: ".",
		uglify: false
	},
	
	appstack = {
		name: "appstack.min.js",
		src_dir: ".",
		src:["src/appstack.js"],
		build_dir: ".",
		uglify: true
	};
	


   jsconcat(appstack);
   jsconcat(extmgr);
