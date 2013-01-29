(function(ToolStack){

	var Console = ToolStack.Console = {};
	ToolStack.ASColors();

	var initialized = false,util = ToolStack.Utility;
	Console.initialized = false;

var node = function(extended){

		extended.initialized = true;

		extended.out = console.log;

		extended.log = function log(){
			extended.out.apply(console,arguments)
		};

		extended.error = function error(){
			extended.out.apply(console,arguments)
		}

		return extended;
};

var browser = function(extended,pid){

		var tree,parent;

		function makeWord(msg){
			var item = document.createElement('span');
			item.style.display = 'block';
			// item.style["margin-left"] = "3px";
			item.innerHTML = msg;
			return item;
		};


		extended.initialized = true;

		if(pid) parent = document.getElementById(pid);

		tree = document.getElementById('console-screen');

		if(!tree){
			tree = document.createElement('div');
			tree.setAttribute('id','console-screen');

			// tree.appendChild(document.createElement('body'));
			// tree.body = tree.getElementsByTagName('body')[0];
			tree.style.padding= '10px';
			tree.style.width = '90%';
			tree.style.height = '90%';
			tree.style.overflow = 'auto';
		}

		extended.out = util.proxy(tree.appendChild,tree);

		extended.log = function log(msg){
			extended.out(makeWord("=>   ".green + msg));
		};

		extended.error = function error(msg){
			exteded.out(makeWord("=>   ".red + msg));
		}

		if(!parent) document.body.appendChild(tree);
		else parent.appendChild(tree);


		// var timer = setInterval(function(){
		// 	if(document.body){
		// 		ready();
		// 		clearInterval(timer);
		// 	}
		// },0);

		return extended;
};

var auto = function(extended,pid){
	var envi = ToolStack.Env.detect();
	if(envi === 'node') return node(extended);
	if(envi === 'browser') return browser(extended,pid);
}

Console.init = function init(pid,env){
	if(Console.initialized) return Console;

	if(!env || env === 'auto') return auto(Console,pid);

	if(env){
		if(env === 'node') return node(extended);
		if(env === 'web' || env === 'browser') return browser(extended,pid);
	}

};

Console.pipe = function(o,method){
	Console.out = util.proxy(o[method || 'out'],o);
	return Console;
}

})(ToolStack);