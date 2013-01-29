ToolStack.Utility = {
  
    //meta_data
    name:"ToolStack.Utility",
    description: "a set of common,well used functions for the everyday developer,with cross-browser shims",
    licenses:[ { type: "mit", url: "http://mths.be/mit" }],
    author: "Alexander Adeniyi Ewetumo",
    version: "0.3.0",

    escapeHTML: function(html){
      return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    fixJSCode: function(js){
      return String(js)
      .replace(/\/*([^/]+)\/\n/g, '')
      .replace(/\n/g, '')
      .replace(/ +/g, ' '); 
    },
    clinse : function(o){
      if(this.isNull(o)) return "null";
      if(this.isUndefined(o)) return "Undefined";
      if(this.isNumber(o)) return (""+o);
      if(this.isString(o)) return o;
      if(this.isBoolean(o)) return o.toString();
      return o;
    },
    processIt: function(o){
      if(this.isArray(o)) return this.map(o,function(e){ return this.clinse(e); },this);
      if(this.isFunction(o) || this.isObject(o)) return (o.name ? o.name : this.isType(o));
      return this.clinse(o);
    },

    templateIt: function(source,keys){
      var src = source, sets;
      if(!this.isObject(keys) && !this.isArray(keys) && !this.isString(keys)) sets = [keys];
      else sets = keys;

      this.forEach(sets,function(e,i,o){
          var reggy = new RegExp("\\{"+(i)+"\\}");
          src = src.replace(reggy,e);
      });
      
      return src;
    },


    fixPath: function(start,end){
        var matchr = /\/+/,pile;
        pile = (start.split(matchr)).concat(end.split(matchr));
        this.normalizeArray(pile);
        return "/"+pile.join('/');
     },

    clockIt : function(fn){
        var start = Time.getTime();
        fn.call(this);
        var end = Time.getTime() - start;
        return end;
    },

    guid: function(){
        return 'xxxxxxxx-xyxx-4xxx-yxxx-xxxyxxyxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16); }).toUpperCase();
    },

    //use to match arrays to arrays to ensure values are equal to each other,
    //useStrict when set to true,ensures the size of properties of both
    //arrays are the same
    matchArrays: function(a,b,beStrict){
           if(this.isArray(a) && this.isArray(b)){
            var alen = a.length, i = 0;
            if(beStrict){
             if(alen !== (b).length){ return false; }
           }

           for(; i < alen; i++){
             if(a[i] === undefined || b[i] === undefined) break;
             if(b[i] !== a[i]){
              return false;
              break;
            }
          }
          return true;
        }
    },

    //alternative when matching objects to objects,beStrict criteria here is
    //to check if the object to be matched and the object to use to match
    //have the same properties
    matchObjects: function(a,b,beStrict){
           if(this.isObject(a) && this.isObject(b)){

            var alen = this.keys(a).length, i;
            for(i in a){
             if(beStrict){
              if(!(i in b)){
               return false;
               break;
             }
           }
           if((i in b)){
            if(b[i] !== a[i]){
             return false;
             break;
           }
         }
       }
       return true;
     }
    },

    memoizedFunction : function(fn){
         var _selfCache = {},self = this;
         return function memoized(){
          var memory = self.clone(arguments,[]),
          args = ([].splice.call(arguments,0)).join(",");
          if(!_selfCache[args]){
           var result = fn.apply(this,memory);
           _selfCache[args] = result;
           return result;
         }
         return _selfCache[args];
       };
    },

    createChainable: function(fn){
       return function chainer(){
        fn.apply(this,arguments);
        return this;
      }
    },

    chain: function(o){
      if(!this.isObject(o)) return;
      var self = this,orig = o, chained = { implode: function(){ self.explode(this); } };
      this.forEach(o,function(e,i,o){
        if(this.has(orig,i) && this.isFunction(e) && !(i === 'implode')) chained[i] = function(){ orig[i].apply(orig,arguments); return chained; }
      },this);
      return chained;
    },

    //takes a single supplied value and turns it into an array,if its an
    //object returns an array containing two subarrays of keys and values in
    //the return array,if a single variable,simple wraps it in an array,
    arranize: function(args){
           if(this.isObject(args)){
            return [this.keys(args),this.values(args)];
          }
          if(this.isArgument(args)){
           return [].splice.call(args,0);
         }
         if(!this.isArray(args) && !this.isObject(args)){
          return [args];
        }
    },

    //simple function to generate random numbers of 4 lengths
    genRandomNumber: function () { 
      var val = (1 + (Math.random() * (30000)) | 3); 
      if(!(val >= 10000)){
        val += (10000 * Math.floor(Math.random * 9));
      } 
      return val;
    },

    makeArray: function(){
     return ([].splice.call(arguments,0));
    },

    makeSplice: function(arr,from,to){
     return ([].splice.call(arr,from,to));
    },

    //for string just iterates a single as specificed in the first arguments 
    forString : function(i,value){
           if(!value) return;
           var i = i || 1,message = "";
           while(true){
            message += value;
            if((--i) <= 0) break;
          }

          return message;
    },

    isEmpty: function(o){
         if(this.isString(o)){
          if(o.length === 0) return true;
          if(o.match(/^\s+\S+$/)) return true;
        }
        if(this.isArray(o)){
          if(o.length === 0 || this.isArrayEmpty(o)){ return true; }
        }
        if(this.isObject(o)){
          if(this.keys(o).length === 0){ return true; }
        }

        return false;
    },

    isArrayEmpty: function(o){
      if(!this.isArray(o)) return false;

      var i = 0,step = 0, tf = 0,len = o.length,item;
      for(; i < len; i++){
        item = o[i];
        if(typeof item === "undefined" || item === null || item === undefined) ++tf;
        if( ++step === len) if(tf === len) return true;
      };
      return false;
    },

    makeString : function(split){
       var split = split || "",
       args = this.makeArray.apply(null,arguments);
       return args.splice(1,args.length).join(split);
    },

    createProxyFunctions: function(from,to,context){
        if(!context) context = to;

        this.forEach(from,function proxymover(e,i,b){
           if(!this.matchType(e,"function")) return;
           to[i] = function(){ 
            return b[i].apply(context,arguments);
          }
        },this);
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
      },properties);
      return;
    },
    
    // destructive extends
    extends:function(){
           var obj = arguments[0];
           var args = Array.prototype.splice.call(arguments,1,arguments.length);

           this.forEach(args,function(o,i,b){
            if(o  !== undefined && typeof o === "object"){
             for(var prop in o){
               var g = o.__lookupGetter__(prop), s = o.__lookupSetter__(prop);
               if(g || s){ this.createProperty(obj,prop,{get:g, set:s}); }
               else obj[prop]=o[prop];
            }
          }
        },this);

    },

    contains: function(o,value){
           var state = false;
           this.forEach(o,function contain_mover(e,i,b){
            if(e === value) {
             state = true; 
           }
         },this);

           return state;
         },

          // returns the position of the first item that meets the value in an array
          any: function(o,value,fn){
           if(this.isArray(o)){
            return this._anyArray(o,value,fn);
          }
          if(this.isObject(o)){
            return this._anyObject(o,value,fn);
          }
    },

    _anyArray: function(o,value,fn){
         for(var i=0,len = o.length; i < len; i++){
          if(value === o[i]){
           if(fn) fn.call(this,o[i],i,o);
           return true;
           break;
         }
       }
       return false;
    },

    _anyObject: function(o,value,fn){
       for(var i in o){
        if(value === i){
         if(fn) fn.call(this,o[i],i,o);
         return true;
         break;
       }
     }
     return false;
    },

      //mainly works wth arrays only
      //flattens an array that contains multiple arrays into a single array
    flatten: function(arrays,result){
       var self = this,flat = result || [];
       this.forEach(arrays,function(a){

        if(self.isArray(a)){
         self.flatten(a,flat);
       }else{
         flat.push(a);
       }

     },self);

       return flat;
    },

    filter: function(obj,fn,scope,breaker){
       if(!obj || !fn) return false;
       var result=[],scope = scope || this;
       this.forEach(obj,function filter_mover(e,i,b){
         if(fn.call(scope,e,i,b)){
          result.push(e);
        }
      },scope,breaker);
       return result;
    },

    occurs: function(o,value){
       var occurence = [];
       this.forEach(o,function occurmover(e,i,b){
         if(e === value){ occurence.push(i); }
       },this);
       return occurence;
    },

    every: function(o,value,fn){
       this.forEach(o,function everymover(e,i,b){
         if(e === value){ 
          if(fn) fn.call(this,e,i,b);
        }
      },this);
       return;
    },

    delay: function(fn,duration){
       var args = this.makeSplice(arguments,2);
       return setTimeout(function(){
        fn.apply(this,args)
      },duration);
    },

    nextTick: function(fn){
        if(typeof process !== 'undefined' || !(process.nextTick)){
          return process.nextTick(fn);
        }
        return setTimeout(fn,0);
    },

    //destructive splice,changes the giving array instead of returning a new one
    //writing to only work with positive numbers only
    splice: function(o,start,end){
       var i = 0,len = o.length;
       if(!len || len <= 0) return false;
       start = Math.abs(start); end = Math.abs(end);
       if(end > (len - start)){
        end = (len - start);
      }

      for(; i < len; i++){
        o[i] = o[start];
        start +=1;
        if(i >= end) break;
      }

      o.length = end;
      return o;

    },

    shift: function(o){
          if(!this.isArray(o) || o.length <= 0) return;
          var data =  o[0];
          delete o[0];
          this.normalizeArray(o);
          return data;
    },

    unShift: function(o,item){
          if(!this.isArray(o)) return;
          var i = (o.length += 1);
          for(; i < 0; i--){
            o[i] = o[i-1];
          }

          o[0]= item;
          return o.length;
    },

    explode: function(){
           if(arguments.length == 1){
            if(this.isArray(arguments[0])) this._explodeArray(arguments[0]);
            if(this.matchType(arguments[0],"object")) this._explodeObject(arguments[0]);
          }
          if(arguments.length > 1){
            this.forEach(arguments,function(e,i,b){
             if(this.isArray(e)) this._explodeArray(e);
             if(this.matchType(e,"object")) this._explodeObject(e);
           },this);
          }
    },

    _explodeArray: function(o){
         if(this.isArray(o)){
          this.forEach(o,function exlodearray_each(e,i,b){
           delete b[i];
         },this);
          o.length = 0;
        };

        return o;
    },

    _explodeObject: function(o){
       if(this.matchType(o,"object")){
        this.forEach(o, function exploder_each(e,i,b){
         delete b[i];
       },this);
        if(o.length) o.length = 0;
      }

      return o;
    },

    is: function(prop,value){
       return (prop === value) ? true : false;
    },

    // forEach: function(obj,callback,scope,breakerfunc){
    //       if(!obj || !callback) return false;
    //       if(('length' in obj && !this.isFunction(obj)) || this.isArray(obj) || this.isString(obj)){
    //         var len = obj.length; i=0;
    //         for(; i < len; i++){
    //          callback.call(scope || this,obj[i],i,obj);
    //          if(breakerfunc && (breakerfunc.call(scope,obj[i],i,obj))) break;
    //        }
    //        return true;
    //      }

    //      if(this.isObject(obj) || this.isFunction(obj)){
    //       var counter = 0;
    //       for(var e in obj){
    //        callback.call(scope || this,obj[e],e,obj);
    //        if(breakerfunc && (breakerfunc.call(scope,obj[i],i,obj))) break;
    //      }
    //      return true;
    //    }
    // },

    forEach: function(obj,callback,scope,breakerfunc,complete){
         if(!obj || !callback) return false;

         if(('length' in obj && !this.isFunction(obj) && !this.isObject(obj)) || this.isArray(obj) || this.isString(obj)){
            return this._eachArray(obj,callback,scope,breakerfunc,complete);
         }
         if(this.isObject(obj) || this.isFunction(obj)){
            return this._eachObject(obj,callback,scope,breakerfunc,complete);
         }
    },

    _eachArray: function(obj,callback,scope,breakerfunc,complete){
        if(!obj.length || obj.length === 0) return false;
           var i = 0, len = obj.length;

           if(!len) callback();

           for(; i < len; i++){
              if(breakerfunc && (breakerfunc.call((scope || this),obj[i],i,obj))){
                  // if(complete) complete.call((scope || this));
                   break;
              }
              (function eachmover(z,a,b,c){
                callback.call(z,a,b,c);
              })((scope || this),obj[i],i,obj)
           }
           return true;
    },

    _eachObject: function(obj,callback,scope,breakerfunc,complete){
          for(var e in obj){
            if(breakerfunc && (breakerfunc.call((scope || this),obj[e],e,obj))){
                // if(complete) complete.call((scope || this)); 
                break;
            }
            (function eachmover(z,a,b,c){
              callback.call(z,a,b,c);
            })((scope || this),obj[e],e,obj)
          }
          return true;
    },

    eachAsync: function(obj,iterator,complete,scope,breaker){
          if(!iterator || typeof iterator !== 'function') return false;
          if(typeof complete !== 'function') complete = function(){};
          var step = 0;
          if(this.isArray(obj)) step = obj.length;
          if(this.isObject(obj)) step = this.keys(obj).length;

          this.forEach(obj,function mover(x,i,o){
            iterator.call(scope,x,i,o,function innerMover(err){
                if(err){
                  complete.call((scope || this),err);
                  return complete = function(){};
                }else{
                  step -= 1;
                  if(step === 0) return complete.call((scope || this));
                }
            });
          },scope,breaker,complete);

    },

    eachSync: function(obj,iterator,complete,scope,breaker){
          if(!iterator || typeof iterator !== 'function') return false;
          if(typeof complete !== 'function') complete = function(){};
          var step = 0, keys = this.keys(obj),fuse;

          if(!keys.length) return false;
          
          fuse = function(){
            var key = keys[step];
            var item = obj[key];

            (function(z,a,b,c){
              if(breaker && (breaker.call(z,a,b,c))){ /*complete.call(z);*/ return; }
              iterator.call(z,a,b,c,function completer(err){
                  if(err){
                    complete.call(z,err);
                    complete = function(){};
                  }else{
                    step += 1;
                    if(step === keys.length) return complete.call(z);
                    else return fuse();
                  }
              });
           }((scope || this),item,key,obj));
          };

          fuse();
    },


    map: function(obj,callback,scope,breaker){
       if(!obj || !callback) return false;
       var result = [];

       this.forEach(obj,function iterator(o,i,b){
        var r = callback.call(scope,o,i,b);
        if(r) result.push(r);
      },scope || this,breaker);
       return result;
    },

    eString : function(string){
      var a = (string),p = a.constructor.prototype;
      p.end = function(value){
        var k = this.length - 1;
        if(value){ this[k] = value; return this; }
        return this[k];
      };
      p.start = function(value){
        var k = 0;
        if(value){ this[k] = value; return this; }
        return this[0];
      };
     
      return a;
    },
    //you can deep clone a object into another object that doesnt have any
    //refernce to any of the values of the old one,incase u dont want to
    //initialize a vairable for the to simple pass a {} or [] to the to arguments
    //it will be returned once finished eg var b = clone(a,{}); or b=clone(a,[]);
    clone: function(from,to){
          var to = null;
          if(this.isArray(from)) to = [];
          if(this.isObject(from)) to = {};
          if(to) to = to;

          this.forEach(from,function cloner(e,i,b){
            if(this.isArray(e)){
             if(!to[i]) to[i] = [];
             this.clone(e,to[i]);
             return;
           }
           if(this.isObject(e)){
             if(!to[i]) to[i] = {};
             this.clone(e,to[i]);
             return;
           }

           to[i] = e;
         },this);
          return to;
    },

    isType: function(o){
          return ({}).toString.call(o).match(/\s([\w]+)/)[1].toLowerCase();
    },

    matchType: function(obj,type){
          return ({}).toString.call(obj).match(/\s([\w]+)/)[1].toLowerCase() === type.toLowerCase();
    },

    isRegExp: function(expr){
         return this.matchType(expr,"regexp");
    },

    isString: function(o){
       return this.matchType(o,"string");
    },

    isObject: function(o){
       return this.matchType(o,"object");
    },

    isArray: function(o){
       return this.matchType(o,"array");
     },

    isDate: function(o){
      return this.matchType(o,"date");
    },

    isFunction: function(o){
       return (this.matchType(o,"function") && (typeof o == "function"));
     },

    isPrimitive: function(o){
       if(!this.isObject(o) && !this.isFunction(o) && !this.isArray(o) && !this.isUndefined(o) && !this.isNull(o)) return true;
       return false;
    },

    isUndefined: function(o){
       return (o === undefined && this.matchType(o,'undefined'));
    },

    isNull: function(o){
       return (o === null && this.matchType(o,'null'));
    },

    isNumber: function(o){
       return this.matchType(o,"number");
    },

    isArgument: function(o){
       return this.matchType(o,"arguments");
    },

    isFalse: function(o){
      return (o === false);
    },

    isTrue: function(o){
      return (o === true);
    },

    isBoolean: function(o){
      return this.matchType(o,"boolean");
    },

    has: function(obj,elem,value,fn){
     var self = this,state = false;
     this.any(obj,elem,function __has(e,i){
      if(value){
       if(e === value){
        state = true;
        if(fn && self.isFunction(fn)) fn.call(e,i,obj);
        return;
      }
      state = false;
      return;
     }

     state = true;
     if(fn && self.isFunction(fn)) fn.call(e,i,obj);
    });

     return state;
    },

    hasOwn: function(obj,elem,value){
       if(Object.hasOwnProperty){
              if(!value) return Object.hasOwnProperty.call(obj,elem);
              else return (Object.hasOwnProperty.call(obj,elem) === value);
        }

        var keys,constroKeys,protoKeys,state = false,fn = function own(e,i){
          if(value){
           state = (e === value) ? true : false;
           return;
         }
         state = true;
       };

       if(!this.isFunction(obj)){
          /* when dealing pure instance objects(already instantiated
           * functions when the new keyword was used,all object literals
           * we only will be checking the object itself since its points to
           * its prototype against its constructors.prototype
           * constroKeys = this.keys(obj.constructor);
           */

           keys = this.keys(obj);
          //ensures we are not dealing with same object re-referening,if
          //so,switch to constructor.constructor call to get real parent
          protoKeys = this.keys(
           ((obj === obj.constructor.prototype) ? obj.constructor.constructor.prototype : obj.constructor.prototype)
           );

          if(this.any(keys,elem,(value ? fn : null)) && !this.any(protoKeys,elem,(value ? fn : null))) 
            return state;
        }

       /* when dealing with functions we are only going to be checking the
       * object itself vs the objects.constructor ,where the
       * objects.constructor points to its parent if there was any
       */ 
       //protoKeys = this.keys(obj.prototype);
       keys = this.keys(obj);
       constroKeys = this.keys(obj.constructor);

       if(this.any(keys,elem,(value ? fn : null)) && !this.any(constroKeys,elem,(value ? fn : null))) 
         return state;
    },

    proxy: function(fn,scope){
                 scope = scope || this;
                 return function(){
                  return fn.apply(scope,arguments);
                };
    },

    //allows you to do mass assignment into an array or array-like object
    //({}),the first argument is the object to insert into and the rest are
    //the values to be inserted
    pusher: function(){
         var slice = [].splice.call(arguments,0),
         focus = slice[0],rem  = slice.splice(1,slice.length);

         this.forEach(rem,function pushing(e,i,b){
          _pusher.call(focus,e);
        });
         return;
    },

    keys: function(o,a){
      var keys = a || [];
      for(var i in o){
         keys.push(i);
      }
      return keys;
    },

    values: function(o,a){
      var vals = a || [];
      for(var i in o){
         vals.push(o[i]);
      }
      return vals;
    },

      //normalizes an array,ensures theres no undefined or empty spaces between arrays
    normalizeArray: function(a){
            if(!a || !this.isArray(a)) return; 

            var i = 0,start = 0,len = a.length;

            for(;i < len; i++){
             if(!this.isUndefined(a[i]) && !this.isNull(a[i]) && !(this.isEmpty(a[i]))){
              a[start]=a[i];
              start += 1;
            }
          }

          a.length = start;
          return a;
    },

    // namespaceGen : function(space,fn){
    //      var self = this,
    //      space = space.split('.'),
    //      splen = space.length,
    //      index = 0,
    //      current = null,
    //      adder = function(obj,space){ 
    //        if(!obj[space]) obj[space] = {};
    //        obj[space]._parent = obj;
    //        return obj[space];
    //      };

    //      while(true){
    //       if(index >= splen){
    //         self._parent[current] = fn;
    //         break;
    //       };
    //               //we get the item,we add and move into lower levels
    //               current = space[index];
    //               self = adder(self,current);
    //               index++;
    //             };

    //             self = this;
    //             return self;
    // }

    //ns: namespace generates a namespaced objects as giving by the value of space eg "core.module.server"
    //using the "." as the delimiter it generates "core ={ module: { server: {}}}" ,if a second value is supplied
    //that becomes the value of the final namespace and if a third value of an object is supplied,then that becomes
    //the object it extends the namespaces on
    ns : function(space,fn,scope){
       var obj = scope || {},
          space = space.split('.'),
          len = space.length,
          pos = len - 1,
          index = 0,
          current = obj;

       this.forEach(space,function(e,i){
           if(!current[e]) current[e] = {};
           current[e].parent = current;
           current = current[e];
           if(i === pos){
            current.parent[e] = fn;
           }
       },this);

       // obj = obj[space[0]];
       delete obj.parent;
       return obj;
    },

    reduce: function(obj,fn,scope){
      var final = 0;
      this.forEach(obj,function(e,i,o){
        final = fn.call(scope,e,i,o,final)
      },scope);

      return final;
    },

    joinEqualArrays: function(arr1,arr2){
        if(arr1.length !== arr2.length) return false;
        var f1 = arr1.join(''), f2 = arr2.join('');
        if(f1 === f2) return true;
        return false;
    },

    sumEqualArrays: function(arr1,arr2){
        if(arr1.length !== arr2.length) return false;
        var math = function(e,i,o,prev){
          return (e + prev);
        },f1,f2;

        f1 = this.reduce(arr1,math); f2 = this.reduce(arr2,math);
        if(f1 === f2) return true;
        return false;
    },

  };
