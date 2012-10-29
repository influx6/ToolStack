(function(fs,path){
	
	"use strict";

	var current_dir = process.cwd(),
		sepr = path.sep,
		matchr = ["specs","jazspecs","jazspecs"],
		jazr = /^\.jaz$/,
		specs = null,
		speclists = [];

	//search current_dir for jazspecs/specs/jaz folder
	if(fs.existsSync(current_dir+sepr+matchr[0])){
		specs = path.resolve(current_dir,matchr[0]);
	}
	else if(fs.existsSync(current_dir+sepr+matchr[1])){
		specs = path.resolve(current_dir,matchr[1]);
	}
	else if(fs.existsSync(current_dir+sepr+matchr[2])){
		specs = path.resolve(current_dir,matchr[2]);
	}else{
		console.log("Current directory does not contain any specs/jazspecs/jaz folder!");
	}


	fs.readdir(specs,function(err,items){
		var i = 0,len = items.length,item,inc = 0;

		for(; i < len; i++){
			item = items[i];
			if(jazr.test(path.extname(item))){
				speclists[inc] = path.resolve(specs,item);
				inc++;
			}
		}
		console.log(speclists)
	});


})(require('fs'),require('path'));