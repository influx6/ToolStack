(function(ToolStack){

	ToolStack.Console = {};
	ToolStack.ASColors();

	var initialized = false ,
	env = ToolStack.Env.detect(),tree,parent,
	Console = ToolStack.Console,util = ToolStack.Utility;

Console.initialized = false;

Console.init = function init(pid){
	if(Console.initialized) return Console;

	if(env === 'node'){

		Console.initialized = true;

		Console.log = function log(){
			console.log.apply(console,arguments)
		};

		Console.error = function error(){
			console.error.apply(console,arguments)
		}

		return Console;
	}

	if(env === 'browser'){

		function makeWord(msg){
			var item = document.createElement('span');
			item.style.display = 'block';
			// item.style["margin-left"] = "3px";
			item.innerHTML = msg;
			return item;
		};


		Console.initialized = true;

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


		Console.log = function log(msg){
			tree.appendChild(makeWord("=>   ".green + msg));
		};

		Console.error = function error(msg){
			tree.appendChild(makeWord("=>   ".red + msg));
		}

		if(!parent) document.body.appendChild(tree);
		else parent.appendChild(tree);


		// var timer = setInterval(function(){
		// 	if(document.body){
		// 		ready();
		// 		clearInterval(timer);
		// 	}
		// },0);

		return Console;

	}

};

})(ToolStack);