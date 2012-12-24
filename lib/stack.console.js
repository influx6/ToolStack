var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("Console",function(ToolStack){

	ToolStack.need('Env','ASColors','ToolChain');

	ToolStack.ASColors();
	var initialized = false ,
	env = ToolStack.Env.detect(),tree,parent,Console,util = ToolStack.ToolChain;

	Console = {};



Console.init = function init(pid){
	if(initialized) return;

	if(env === 'node'){

		initialized = true;

		Console.log = function log(){
			console.log.apply(console,arguments)
		};

		Console.error = function error(){
			console.error.apply(console,arguments)
		}
	}

	if(env === 'browser'){

		function makeWord(msg){
			var item = document.createElement('span');
			item.style.display = 'block';
			// item.style["margin-left"] = "3px";
			item.innerHTML = msg;
			return item;
		};

		function ready(){

			initialized = true;

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

		};


		var timer = setInterval(function(){
			if(document.body){
				ready();
				clearInterval(timer);
			}
		},0);

	}

};


	ToolStack.Console = Console;

});