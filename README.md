# AppStack 	
	A tiny lightweight stack of useful libraries and utilities for your every day needs

# Installation
		npm install appstack;

# Features
	- compatible with Nodejs
	- easily extendable directly or through an ExtensionManager(https://github.com/influx6/ExtensionManager.js)
	- comes with predefined,usable extensions(Callbacks,Events,Promise,Utility extensions).
	- loadable extensions using the simple 'load' function (still awaiting implementation)
	- register extensions with their locations to get instant dependency resolution(awaiting implementation)
	
		
# Examples
	'''
		In Node:
			var Appstack = require('appstack');
			
			
		In Browser: simple include the scripts as needed
				
				....
				<script src="paths to ../appstack.min.js"></script>
				<script src="paths to../extmgr.min.js"></script>
				<script>
					var appstack = window.AppStack;

					//load in optional extensions
					appstack.load("class");
					appstack.load("callbacks");

					//variables like Promise,Events,Callbacks,SU will be leaked into the global scope
					
					var Library = Class.create("Library",{
						init: function(){},
						addBooks: function(){}
					});
					
					var exts = ExtensionManager(Library); // returns an extensionmanager object,set to extend 
																// Library
																
					Promise(exts); Callbacks(exts); Events(exts); SU(exts);
					 //Library will now have all these extensions
					
					or 
					
					var exts = ExtensionManager(); // returns an extensionmanager object,set to extend 
					Promise(exts); Callbacks(exts); Events(exts); SU(exts);
					
					exts.give(false,Library,"Callback","Promise");
					
						
				</script>
			 
			  ....
			
			
	'''
	
# License
	This is released under the MIT License.