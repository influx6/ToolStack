ToolStack.Class =  {
         name: "ToolStack.Class",
         version: "0.0.2",
         description: "basic classical OOP for your js apps",
         description: "basic class structure for your js apps",
           licenses:[ { type: "mit", url: "http://mths.be/mit" }],
           author: "Alexander Adeniyin Ewetumo",
            
            inherit : function(child,parent){

               function empty(){};
               empty.prototype = parent.prototype ? parent.prototype : parent;
               
               child.prototype = new empty();
               
               child.prototype.constructor = child;
               if(parent.prototype) child.parent = parent.prototype;
               if(parent.prototype && parent.prototype.constructor) parent.prototype.constructor = parent;

               return true;
            },


            mixin : function(from,to){
               for(var e in from){
                  if(e in to) return;
                  to[e] = from[e];
               }
            },

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
            
            create : function(classname,ability,parent){

                  var self = this, 
                     Class = function Class(){
                        if(!(this instanceof Class)){
                           return new Class;
                        }
                     if(Class.parent && Class.parent.constructor){
                        Class.parent.constructor.apply(this,arguments);
                        this.super = Class.parent;
                        this.superd = false;
                             
                     }
                    
                     // if(this.init && typeof this.init === 'function'){
                     //    this.init.apply(this,arguments);
                     // }
                     
                     return this;

                  };
                  

                  if(parent){ self.inherit(Class,parent); }
                  
                  if(ability){
                     if(!ability.instance && !ability.static){ 
                        self.extendWith(Class.prototype, ability);
                     }
                     if(ability.instance){ 
                        self.extendWith(Class.prototype, ability.instance);
                     }
                     if(ability.static){ 
                        self.extendWith(Class,ability.static);
                     }
                  }
                  
                  //shortcut to all Class objects prototype;
                  Class.fn = Class.prototype;
                  //sets the className for both instance and Object level scope
                  Class.ObjectClassName = Class.fn.ObjectClassName = classname;
                  
                  Class.fn.Super = function(){
                      if(this.super.init && typeof this.super.init === 'function' && !this.superd){
                           this.super.init.apply(this,arguments);
                        }
                  };

                  Class.fn.Method = function(name,fn){
                    //destructive Method
                      var self = this;
                      self[name] = function(){
                        fn.apply(self,arguments);
                        return self;
                      };
                  };

                  Class.fn.cloneSelf = function(){
                    var clone = self.extendWith({},this);
                    return clone;
                  }



                  //because calling new Class().setup() can be a hassle,alternative wrapper method that calls these methods
                  //is created: simple do Class.make(), it will create a new Class object and call setup with required arguements

                  Class.make = function(){
                     var shell = Class();
                     shell.init.apply(shell,arguments);
                     return shell;
                  };
                  
                  Class.extend = ToolStack.Class.extend;
                  Class.mixin = ToolStack.Class.mixin;

                  return Class;
            },

               //allows a direct extension of the object from its parent directly
            extend : function(name,ability){
                  return ToolStack.Class.create(name,ability,this);
            }

};
