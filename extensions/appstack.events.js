"use strict";
!function(name,func){
  //check for specific module's systems else add it to the global
  if(typeof define === "function") define(func)
  else if(typeof module !== "undefined") module.exports = func;
  else this[name] = func; 
}("Events",function(EM){

   EM.create("Events", function(SU,Callbacks){
		return {
			
         name: "AppStack.Events",
         version: "1.0.0",
         description: "Publication-Subscription implementation using Callback API",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",

        on:function(es,callback,context,subscriber){
           if(!this.events) this.events = {};
            if(!es || !callback){ return; }

            var e = this.events[es] = (this.events[es] ? this.events[es] : Callbacks.create("unique"));
            e.add(callback,context,subscriber);

            return;
         },
      
        off: function(es,callback,context,subscriber){
            if(arguments.length  === 0){
               
               return this;
            };
            
            var e = this.events[es];
            if(!e) return;

            if(!callback && !context && !subscriber){ e.flush(); return this; } 

            e.remove(callback,context,subscriber);
            return this;
         
         },

        emit: function(event){
           if(!event || !this.events){ return this; }
           
           var args = SU.makeSplice(arguments,1),
               e = this.events[event];

           if(!e) return this;

            e.fire(args);

           return this;
        }
      
   };

	},["ToolChain","Callbacks"],true);
});
