ToolStack.Flux = (function(ToolStack){

    var utility = ToolStack.Utility;
    return {
         name: "ToolStack.Flux",
         version: "0.0.2",
         description: "basic classical OOP for your js apps",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",

            extendWith : function(to,from){
               var self = this,g,s;
                for(var e in from){
                    if(e !== 'init' || to[e]){
                      g = from.__lookupGetter__(e); s = from.__lookupSetter__(e);
                      if(g || s){
                          self.createProperty(to,e,{ get: g, set: s})
                      }else{
                          to[e] = from[e];
                      }
                  }
                }

                  return to;
            },

            out : function(){
              var self = this, flux = function(){
                this.initialized = false;
              };

              flux.fn = flux.prototype;
              
              /*
                --- initiable : true/false, if true,u must provide a init method in the object passed
                --- overwright : true/false => overwrights all method it meets
                --- 
              */

              flux.fn.initList = {};
              flux.fn.configList = {};
              flux.fn.methodList = {};
              flux.initialized = true;

              flux.fn.validatePlugin = function(config){
                if(!config) throw new Error('Please provide a config property in your plugin');
                if(!config.name) config.name = utility.guid(); 
              };

              flux.fn.addPlugin = function(plugin,config){
                if(!(typeof plugin).match(/^object$|^function$/)) return false;

                if(typeof plugin === 'function') return plugin.call(self,self);
                if(typeof plugin === 'object'){
                  this.validatePlugin(config);

                  this.configList[config.name] = config;
                  if(config.initiable && plugin.init && typeof plugin.init === 'function'){
                    this.initList[config.name] = (plugin.init);
                  }
                  this.methodList[config.name] = utility.keys(plugin);
                  self.extendWith(flux.fn,plugin);

                  if(this.initialized) this.processPlugin(config.name);
                }

                return true;
              };

              flux.fn.use = function(plugin,config){
                this.addPlugin(plugin,config);
              };

              flux.fn.init = function(){
                if(!this.initialized){
                  if(this.initializer && typeof this.initializer === 'function') this.initializer.apply(this,arguments);
                  this.processPlugin();
                  this.initialized  = true;
                }
              };

              flux.fn.clone = function(){
                return self.extendWith({},this);
              };

              flux.fn.processPlugin = function(name){
                var self = this;
                if(name && this.initialized){
                    this.initList[name].call(this);
                    return;
                }
                utility.forEach(this.initList,function(e,i,o){
                    e.call(self);
                });
              }

              return new flux;
            },

      };

})(ToolStack);