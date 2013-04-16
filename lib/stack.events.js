ToolStack.Events = (function(ToolStack){


      return function(){
            
          var e = {
               name: "ToolStack.Events",
               version: "1.0.0",
               description: "Publication-Subscription implementation using Callback API",
               licenses:[ { type: "mit", url: "http://mths.be/mit" }],
               author: "Alexander Adeniyin Ewetumo",

              set: function(es,flag){
                  if(!this.events) this.events = {};
                  if(!this.events[es]){
                    var flags = (flag && typeof flag === 'string') ? flag.concat('unique') : "unique";
                    return (this.events[es] = ToolStack.Callbacks.create(flag));
                  }
                  return this.events[es];
              },

              unset: function(es){
                  if(!this.events) this.events = {};
                  if(!this.events[es]) return;
                  delete this.events[es];
                  return true;
              },

              once: function(es,callback,context,subscriber){
                 if(!this.events) this.events = {};
                  if(!es || !callback){ return; }

                  var e = this.set(es,'fireRemove');
                  e.add(callback,context,subscriber);

                  return;
              },

              on:function(es,callback,context,subscriber){
                 if(!this.events) this.events = {};
                  if(!es || !callback){ return; }

                  var e = this.set(es);
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
                 
                 var args = ([].splice.call(arguments,1)),
                     e = this.events[event];

                 if(!e) return this;

                  e.fire.apply(null,args);

                 return this;
              }
            
          };

          //compatibility sake
          e.removeListener = e.removeAllListeners = e.off;
          return e;
      };

})(ToolStack);