(function(name,fn){
	if(typeof define === 'function') define(fn);
	else if(typeof module !== 'undefined') module.exports = fn;
	else this[name] = fn;
})('ASColors',function(ToolStack){

	ToolStack.need('Env');

	var env = ToolStack.Env.detect(),
	tool = ToolStack.ToolChain,
	//----------------------the code within this region belongs to the copyright listed below
		/*
		colors.js

		Copyright (c) 2010

		Marak Squires
		Alexis Sellier (cloudhead)

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.

		*/
	Styles = {
		web:{
	      'bold'      : ['<b>',  '</b>'],
	      'italic'    : ['<i>',  '</i>'],
	      'underline' : ['<u>',  '</u>'],
	      'inverse'   : ['<span style="background-color:black;color:white;">',  '</span>'],
	      //grayscale
	      'white'     : ['<span style="color:white;">',   '</span>'],
	      'grey'      : ['<span style="color:grey;">',    '</span>'],
	      'black'     : ['<span style="color:black;">',   '</span>'],
	      //colors
	      'blue'      : ['<span style="color:blue;">',    '</span>'],
	      'cyan'      : ['<span style="color:cyan;">',    '</span>'],
	      'green'     : ['<span style="color:green;">',   '</span>'],
	      'magenta'   : ['<span style="color:magenta;">', '</span>'],
	      'red'       : ['<span style="color:red;">',     '</span>'],
	      'yellow'    : ['<span style="color:yellow;">',  '</span>']
		},
		terminal:{
		  'bold'      : ['\033[1m',  '\033[22m'],
	      'italic'    : ['\033[3m',  '\033[23m'],
	      'underline' : ['\033[4m',  '\033[24m'],
	      'inverse'   : ['\033[7m',  '\033[27m'],
	      //grayscale
	      'white'     : ['\033[37m', '\033[39m'],
	      'grey'      : ['\033[90m', '\033[39m'],
	      'black'     : ['\033[30m', '\033[39m'],
	      //colors
	      'blue'      : ['\033[34m', '\033[39m'],
	      'cyan'      : ['\033[36m', '\033[39m'],
	      'green'     : ['\033[32m', '\033[39m'],
	      'magenta'   : ['\033[35m', '\033[39m'],
	      'red'       : ['\033[31m', '\033[39m'],
	      'yellow'    : ['\033[33m', '\033[39m'],

	  
		}
	},

	sets = ['bold', 'underline', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];


	//----------------------end of the foreign code region-----------------------------------

	//basicly we pollute global String prototype to gain callabillity without using method assignments
	ToolStack.ASColors = function(){
		var styles, sproto = String.prototype;

		if(env === 'browser') styles = Styles.web;
		if(env === 'node')	styles = Styles.terminal;

		if(sproto['underline'] && sproto['white'] && sproto['green']) return;

		tool.forEach(sets,function(e,i,o){
			var item = styles[e];
			tool.createProperty(sproto,e,{
				get: function(){
					return item[0] + this.toString() + item[1];
				},
				set: function(){}
			});

		});

	};


});