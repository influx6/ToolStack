"use strict";
!function(name,func){
	//check for specific module's systems else add it to the global
	if(typeof define === "function") define(func)
	else if(typeof module !== "undefined") module.exports = func;
	else this[name] = func; 

}("Class",function(EM){
	EM.create("Class",function(){

		return {
			name: "AppStack.Class",
			version: "0.0.2",
			description: "basic class structure for your js apps",
	        licenses:[ { type: "mit", url: "http://mths.be/mit" }],
	        author: "Alexander Adeniyin Ewetumo",

      		create : function(classname,ability,parent){
         
		         var Class = function(){
		            if(!(this instanceof arguments.callee)){
		               return new arguments.callee;
		            }
		         };
		         
		         if(parent){ AppStack.inherit(Class,parent)};
		         
		         if(ability){
		            if(!ability.instance && !ability.static){ 
		               AppStack.SU.extends(Class.prototype, ability);
		            }
		            if(ability.instance){ 
		               AppStack.SU.extends(Class.prototype, ability.instance);
		            }
		            if(ability.static){ 
		               AppStack.SU.extends(Class,ability.static);
		            }
		         }
		         
		         //shortcut to all Class objects prototype;
		         Class.fn = Class.prototype;
		         //sets the className for both instance and Object level scope
		         Class.ObjectClassName = Class.fn.ObjectClassName = classname;
		         
		         Class.fn.setup = function(){
		            if(Class.parent){
		               Class.parent.constructor.apply(this,arguments);
		               this.super = Class.parent;
		               if(this.super.init && typeof this.super.init === 'function'){
		                  this.super.init.apply(this,arguments);
		               }		
		            }
		           
		            if(this.init && typeof this.init === 'function'){
		               this.init.apply(this,arguments);
		            }
		            
		            return this;
		         };
		         
		         Class.extend = AppStack.extend;
		         Class.mixin = AppStack.mixin;

		         return Class;
		      },

		      //allows a direct extension of the object from its parent directly
		      extend : function(name,ability){
		         return AppStack.create(name,ability,this);
		      }

		};

	});
});

