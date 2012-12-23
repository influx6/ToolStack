var module = module || {};
(function(name,fn){
  if(!module['exports']) module.exports = {};
  module.exports[name] = fn;
})("Class",function(ToolStack){

    var cid = function(){
      return 'xyyxyxxyxyy-yxyx-4xyx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16); }).toUpperCase();
    },
    genlist = function(obj){
      var list = [];
      for(var i in obj){
        list.push(i);
      }
      return list;
    },
    _each = function(o,callback){
      for(var i in o){
        callback(o[i],i,o);
      }
    };



    ToolStack.Flux = {
         name: "ToolStack.Class",
         version: "0.0.2",
         description: "basic classical OOP for your js apps",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",


            createProperty: function(obj,name,fns,properties){
                 if(!("defineProperty" in Object) && Object.__defineGetter__ && Object.__defineSetter__){
                    if(fns.get) obj.__defineGetter__(name,fns.get);
                    if(fns.set) obj.__defineSetter__(name,fns.set);
                    if(properties) obj.defineProperty(name,properties);
                    return;
                 }

                 Object.defineProperty(obj,name,{
                    get: fns.get, set: fns.set
                 });
                 return true;
            },

            extendWith : function(to,from){
               var self = this,g,s;
                  for(var e in from){
                      g = from.__lookupGetter__(e); s = from.__lookupSetter__(e);
                      if(g || s){
                        self.createProperty(to,e,{ get: g, set: s})
                    }else{
                        to[e] = from[e];
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
                if(!config.name) config.name = cid(); 
              };

              flux.fn.addPlugin = function(plugin,config){
                if(!(typeof plugin).match(/^object$|^function$/)) return false;

                if(typeof plugin === 'function') plugin(this);
                if(typeof plugin === 'object'){
                  this.validatePlugin(config);

                  this.configList[config.name] = config;
                  if(config.initiable && plugin.init && typeof plugin.init === 'function') this.initList[config.name] = (plugin.init);
                  this.methodList[config.name] = genlist(plugin);
                  self.extendWith(flux.fn,plugin);

                  if(this.initialized) this.processPlugin(config.name);
                }

                return true;
              };

              flux.fn.use = function(config,plugin){
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
                _each(this.initList,function(e,i,o){
                    e.call(self);
                });
              }

              return new flux;
            },

      };
});