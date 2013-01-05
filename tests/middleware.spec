var app = require('http').createServer(),
ts = require('../builds/toolstack').ToolStack,
http = x,
processMount = function(mount){
				var temp = mount,
				unit = { params: null, split: null, mount:null, orig: mount },
				split,join=[], m = R.matchrs,set = {};

				if(temp === '/'){ unit.mount = /^\/$/; return unit; }

				if(temp.charAt(0) === '/') temp = temp.substring(1);
				split = temp.split('/')

				if(!split.length) return false;

				utility.eachAsync(split,function(e,i,o,fn){
					if(e.match(m.norm)){
						// var tmp = utility.values(m.pure.toString());
						// tmp[0] = tmp[tmp.length - 1] = '';
						join.push('\\/'+e);
						set[e] = null;
					}
					else if(e.match(m.param)){ 
						var item = e.match(m.param),tmp = utility.values(m.pure.toString());
						tmp[0] = tmp[tmp.length - 1] = '';
						set[item[1]] = null;
						join.push(tmp.join(''));
					}
					if(e.charAt(e.length) === '/') join.push('/');
					fn(false);
				},function(err){
					if(err) return;
					unit.mount = new RegExp(("^".concat(join.join('')).concat('$')),'i');
					unit.params = set;
					unit.split = split;

				},this);

				return unit;
};

var app = http.createServer();
var appgen = ts.Middleware(function(route){

	var matchrs = {
			root: /^\/$/,
			basic: /\/([\w|\d|\-|\_]+)|\//,
			param: /^:([\w|\d|\-|\_]+)/,
			norm: /^([\w|\d|\-|\_]+)/,
			paramd:/\/(:[\w|\d|\-|\_]+)/,
			pure: /\/([\w|\d|\-|\_]+)/,
			// rootsplitter: /^\/([\w|\d|\-|\_]+)(\/)/,
			// rootextender: /^\/([\w|\d|\-|\_]+)(\/[:\w\W]+)/,
			rootextender: /(\/[\w|\d|\-|\_]+)(\/$|\/[\w\W]+)/
	};

	if()
})
// setTimeout(function(){
// 	boolware.start(true,'logging is true')
// });

// console.log(boolware,boolware.stack.last.elem);
