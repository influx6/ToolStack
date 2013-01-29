var ToolStack =  {},_each,
    module = module || { exports: {}};

module.exports.ToolStack = ToolStack;

_each = function (arr, iterator) {
          if (arr.forEach) {
              return arr.forEach(iterator);
          }
          for (var i = 0; i < arr.length; i += 1) {
              iterator(arr[i], i, arr);
          }
};
          

ToolStack.ObjectClassName = "ToolStack";

// ToolStack.noConflict = function(){
//         root.ToolStack = previousToolStack;
//         return this; 
// };

//the current in use version of Class
ToolStack.version = "0.3.4";


ToolStack.ns = function(space,fn,scope){
         var obj = scope || {},
            space = space.split('.'),
            len = space.length,
            pos = len - 1,
            index = 0,
            current = obj;

         _each(space,function(e,i){
             if(!current[e]) current[e] = {};
             current[e].parent = current;
             current = current[e];
             if(i === pos){
              current.parent[e] = fn;
             }
         });

         // obj = obj[space[0]];
         delete obj.parent;
         return obj;
};

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
ToolStack.Env =  {
         name: "ToolStack.Env",
         version: "1.0.0",
         description: "simple environment detection script",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",  
         detect: (function(){ 
            var envs = {
               unop: function(){ return "unknown" },
               node: function(){ return "node" },
               headless: function(){ return "headless" },
               browser: function(){ return "browser" },
               rhino: function(){ return "rhino" },
               xpcom: function(){ return "XPCOMCore" },
            };

            //will check if we are in a browser,node or headless based system
            if(typeof XPCOMCore !== "undefined"){
               return envs.xpcom;
            }
            else if(typeof window === "undefined" && typeof java !== 'undefined'){
               return envs.rhino;
            }
            else if(typeof window !== "undefined" && typeof window.document !== 'undefined'){
               return envs.browser;
            }
            else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
               //test further
               var lt = {
                  fs: !require('fs'),
                  path: !require('path')
               };

               return envs.node;
            }else{
               return detect = envs.unop;
            }
         })()

};ToolStack.ASColors = (function(ToolStack){

	var env,
	tool = ToolStack.Utility;

	if(typeof window !== 'undefined' && typeof window.document !== 'undefined') env = 'browser';
	else env = 'node';

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
	var Styles = {
		web:{
	      'bold'      : ['<b>',  '</b>'],
	      'italic'    : ['<i>',  '</i>'],
	      'underline' : ['<u>',  '</u>'],
	      'inverse'   : ['<span class="inverse">',  '</span>'],
	      //grayscale
	      'white'     : ['<span class="white">',   '</span>'],
	      'grey'      : ['<span class="grey">',    '</span>'],
	      'black'     : ['<span class="black">',   '</span>'],
	      //colors
	      'blue'      : ['<span class="blue" >',    '</span>'],
	      'cyan'      : ['<span class="cyan" >',    '</span>'],
	      'green'     : ['<span class="green">',   '</span>'],
	      'magenta'   : ['<span class="magenta">', '</span>'],
	      'red'       : ['<span class="red">',     '</span>'],
	      'yellow'    : ['<span class="yellow">',  '</span>']
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

	sets = ['bold', 'underline', 'italic', 'inverse', 'grey', 'black', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'],


	//----------------------end of the copyrighted code-----------------------------------

	css = ".white{ color: white; } .black{color: black; } .grey{color: grey; } "
	+ ".red{color: red; } .blue{color: blue; } .yellow{color: yellow; } .inverse{ background-color:black;color:white;}"
	+ ".green{color: green; } .magenta{color: magenta; } .cyan{color: cyan; } ";

	//basicly we pollute global String prototype to gain callabillity without using method assignments
	return (function(){

		var styles, sproto = String.prototype;
		if(sproto['underline'] && sproto['white'] && sproto['green']) return;


		if(env === 'browser'){
			styles = Styles.web;
			if(typeof document !== 'undefined' && typeof document.head !== 'undefined'){
				var style = "<style>"+css+"</style>",clean = document.head.innerHTML;
				document.head.innerHTML = style+"\n"+clean;
			}
		}
		if(env === 'node')	styles = Styles.terminal;


		tool.forEach(sets,function(e,i,o){
			var item = styles[e];
			tool.createProperty(sproto,e,{
				get: function(){
					return item[0] + this.toString() + item[1];
				},
				set: function(){}
			});

		});

	});


})(ToolStack);ToolStack.Class =  {
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

})(ToolStack);(function(ToolStack){

	var Console = ToolStack.Console = {};
	ToolStack.ASColors();

	var initialized = false,util = ToolStack.Utility;
	Console.initialized = false;

var node = function(extended){

		extended.initialized = true;

		extended.out = console.log;

		extended.log = function log(){
			extended.out.apply(console,arguments)
		};

		extended.error = function error(){
			extended.out.apply(console,arguments)
		}

		return extended;
};

var browser = function(extended,pid){

		var tree,parent;

		function makeWord(msg){
			var item = document.createElement('span');
			item.style.display = 'block';
			// item.style["margin-left"] = "3px";
			item.innerHTML = msg;
			return item;
		};


		extended.initialized = true;

		if(pid) parent = document.getElementById(pid);

		tree = document.getElementById('console-screen');

		if(!tree){
			tree = document.createElement('div');
			tree.setAttribute('id','console-screen');

			// tree.appendChild(document.createElement('body'));
			// tree.body = tree.getElementsByTagName('body')[0];
			tree.style.padding= '10px';
			tree.style.width = '90%';
			tree.style.height = '90%';
			tree.style.overflow = 'auto';
		}

		extended.out = util.proxy(tree.appendChild,tree);

		extended.log = function log(msg){
			extended.out(makeWord("=>   ".green + msg));
		};

		extended.error = function error(msg){
			exteded.out(makeWord("=>   ".red + msg));
		}

		if(!parent) document.body.appendChild(tree);
		else parent.appendChild(tree);


		// var timer = setInterval(function(){
		// 	if(document.body){
		// 		ready();
		// 		clearInterval(timer);
		// 	}
		// },0);

		return extended;
};

var auto = function(extended,pid){
	var envi = ToolStack.Env.detect();
	if(envi === 'node') return node(extended);
	if(envi === 'browser') return browser(extended,pid);
}

Console.init = function init(pid,env){
	if(Console.initialized) return Console;

	if(!env || env === 'auto') return auto(Console,pid);

	if(env){
		if(env === 'node') return node(extended);
		if(env === 'web' || env === 'browser') return browser(extended,pid);
	}

};

Console.pipe = function(o,method){
	Console.out = util.proxy(o[method || 'out'],o);
	return Console;
}

})(ToolStack);ToolStack.Callbacks = (function(SU){

         var flagsCache = {},
            su = SU,
            makeFlags = function(flags){
               if(!flags || su.isEmpty(flags)) return;
               if(flagsCache[flags]) return flagsCache[flags];

               var object = flagsCache[flags] = {};
               su.forEach(flags.split(/\s+/),function(e){
                     object[e] = true;
               });

               return object;
            },
            callbackTemplate = function(fn,context,subscriber){
               return {
                  fn:fn,
                  context: context || null,
                  subscriber: subscriber || null
               }
            },
            occursObjArray = function(arr,elem,value,fn){
               var oc = [];
               su.forEach(arr,function(e,i,b){
                  if(e){
                     if((elem in e) && (e[elem] === value)){
                       oc.push(i);
                       if(fn && su.isFunction(fn)) fn.call(null,e,i,arr);
                     }
                  }
               },this);

               return oc;
               
            },
           callback = function(flags){
                var  list = [],
                     fired = false,
                     firing = false,
                     fired = false,
                     fireIndex = 0,
                     fireStart = 0,
                     fireLength = 0,
                     flags = makeFlags(flags) || {},

                     _fixList = function(){
                        if(!firing){
                           su.normalizeArray(list);
                        }
                     },
                     _add = function(args){
                        su.forEach(args,function(e,i){
                           if(su.isArray(e)) _add(e);
                           if(su.isObject(e)){
                              if(!e.fn || (e.fn && !su.isFunction(e.fn))){ return;}
                              if(!su.isNull(e.context) && !su.isUndefined(e.context) && !su.isObject(e.context)){ return; }
                              if(flags.unique && instance.has('fn',e.fn)){ return; }
                              list.push(e);
                           }
                        });
                     },

                     _fire = function(context,args){
                        firing = true;
                        fired = true;
                        fireIndex = fireStart || 0;
                        for(;fireIndex < fireLength; fireIndex++){
                           if(!su.isUndefined(list[fireIndex]) && !su.isNull(list[fireIndex])){
                              var e = list[fireIndex];
                              if(!e || !e.fn) return;
                              if(flags.forceContext){
                                 e.fn.apply(context,args);
                              }else{
                                 e.fn.apply((e.context ? e.context : context),args);
                              }
                           }
                        }
                        firing = false;

                        // if(list){
                        //    if(flags.once && fired){
                        //       instance.disable();
                        //    }
                        // }else{
                        //    list = [];
                        // }
                       
                        return;
                     },

                     instance =  {
                        
                        add: function(){
                           if(list){
                              if(arguments.length === 1){
                                 if(su.isArray(arguments[0])) _add(arguments[0]);
                                 if(su.isObject(arguments[0])) _add([arguments[0]]);
                                 if(su.isFunction(arguments[0])){
                                    _add([
                                          callbackTemplate(arguments[0],arguments[1],arguments[2])
                                    ]);
                                 }
                              }else{
                                 _add([
                                       callbackTemplate(arguments[0],arguments[1],arguments[2])
                                 ]);
                              }

                              fireLength = list.length;
                           };
                           return this;
                        },

                        fireWith: function(context,args){
                           if(this.fired() && flags.once) return;

                           if(!firing ){
                              _fire(context,args);
                           }
                           return this;
                        },

                        fire: function(){
                           this.fireWith(this,arguments);
                           return this;
                        },

                        remove: function(fn,context,subscriber){
                           if(list){
                              if(fn){
                                 this.occurs('fn',fn,function(e,i,b){
                                    if(context && subscriber && (e.subscriber === subscriber) && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }
                                    if(context && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }
                                    if(subscriber && (e.subscriber === subscriber)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;
                                 });
                                 return this;
                              }

                              if(context){
                                 this.occurs('context',context,function(e,i,b){
                                    if(subscriber && (e.subscriber === subscriber)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;

                                 });
                                 return this;
                              }

                              if(subscriber){
                                 this.occurs('subscriber',subscriber,function(e,i,b){
                                    if(context && (e.context === context)){
                                       delete b[i];
                                       su.normalizeArray(b);
                                       return;
                                    }

                                    delete b[i];
                                    su.normalizeArray(b);
                                    return;
                                 });
                                 return this;
                              }
                           }

                           return this;
                        },

                        flush: function(){
                           su.explode(list);
                           return this;
                        },

                        disable: function(){
                           list = undefined;
                           return this;
                        },

                        disabled: function(){
                           return !list;
                        },

                        has: function(elem,value){
                          var i=0,len = list.length;
                          for(; i < len; i++){
                              if(su.has(list[i],elem,value)){
                                    return true;
                                    break;
                              }
                          }
                              return false;
                        },

                        occurs: function(elem,value,fn){
                           return occursObjArray.call(this,list,elem,value,fn);
                        },

                        fired: function(){
                           return !!fired;
                        }

                     };

                return instance;
         };

         return {
           create : callback,
           name:"ToolStack.Callbacks",
           description: "Callback API with the pub-sub pattern implementation(the heart of Promise and Events)",
           licenses:[ { type: "mit", url: "http://mths.be/mit" }],
           author: "Alexander Adeniyi Ewetumo",
           version: "0.3.0",
         };

})(ToolStack.Utility);
	ToolStack.Events = (function(ToolStack){


      return function(){
            
          return {
               name: "ToolStack.Events",
               version: "1.0.0",
               description: "Publication-Subscription implementation using Callback API",
               licenses:[ { type: "mit", url: "http://mths.be/mit" }],
               author: "Alexander Adeniyin Ewetumo",

              set: function(es){
                  if(!this.events) this.events = {};
                  if(!this.events[es]){
                    this.events[es] = ToolStack.Callbacks.create("unique");
                  }
              },

              on:function(es,callback,context,subscriber){
                 if(!this.events) this.events = {};
                  if(!es || !callback){ return; }

                  var e = this.events[es] = (this.events[es] ? this.events[es] : ToolStack.Callbacks.create("unique"));
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

                  e.fire(args);

                 return this;
              }
            
          };
      };

})(ToolStack);ToolStack.Promise = (function(SU,CU){
      var su = SU,
          callbacks = CU,
          isPromise = function(e){
           //jquery style,check if it has a promise function
           //adding extra check for type of promise and if return type matches objects
           if(su.isObject(e) && "promise" in e){
               //adding a tiny extra bit of check if its a Class promise,which has a signature
               //set to promise string
               if(e.__signature__ && e.__signature__ === "promise") return true;
               //usual checks
               if(e["promise"] && su.isFunction(e["promise"]) && su.isObject(e["promise"]())) return true;
           }

              return false;
      },
      promise = function(fn){

         var state = "pending",lists = {
            done : callbacks.create("once forceContext"),
            fail : callbacks.create("once forceContext"),
            progress : callbacks.create("forceContext")
         },
         deferred = {},
         memory,
         handler,
         isRejected = function(){
            if(state === "rejected" && lists.fail.fired()){
               return true;
            }
            return false;
         },

         isResolved = function(){
            if(state === "resolved" && lists.done.fired()){
               return true;
            }
            return false;
         };

         su.extends(deferred, {

               __signature__: "promise",

               state : function(){
                  return state;
               },

               done: function(fn){
                  if(!fn) return this;
                  if(isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memory[0],memory[1]);
                     });
                     return this;
                  }
                  lists.done.add(fn);
                  return this;
               },

               fail: function(fn){
                  if(!fn) return this;
                  if(isRejected()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memory[0],memory[1]);
                     });
                     return this;
                  }
                  lists.fail.add(fn);
                  return this;
               },

               progress: function(fn){
                  if(!fn) return this;
                  if(isRejected() || isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memory[0],memory[1]);
                     });
                     return this;
                  }
                  lists.progress.add(fn);
                  return this;
               },


               then: function(success,fail,progress){
                  //adds multiple sets to the current promise/deffered being
                  //called;
                  this.done(success).fail(fail).progress(progress);
                  return this;
               },

               //return the value used to resolve,reject it
               get: function(){
                  return memory[1];
               },

               resolveWith: function(ctx,args){
                  if(isResolved() || isRejected()){ return this;}
                  //fire necessary callbacks;
                  state = "resolved";
                  lists.done.fireWith(ctx,args);
                  lists.progress.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memory = [ctx,args];
                  //disable fail list if resolved
                  lists.fail.disable();
                  //set state to resolve
                  return this;
               },

               rejectWith: function(ctx,args){
                  if(isRejected() || isResolved()){ return this; }
                  //fire necessary callbacks;
                  state = "rejected";
                  lists.fail.fireWith(ctx,args);
                  lists.progress.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memory = [ctx,args];
                  //disable done/success list;
                  lists.done.disable();
                  //set state to rejected
                  return this;
               },

               notifyWith: function(ctx,args){
                 if(isRejected() || isResolved()) return this;
                 memory = [ctx,args];
                 lists.progress.fireWith(ctx,args);
                 return this;
               },

               notify: function(){
                  var args = su.arranize(arguments);
                  this.notifyWith(this,args);
                  return this;
               },

               resolve: function(){
                  var args = su.arranize(arguments);
                  this.resolveWith(this,args);
                  return this;
               },

               reject: function(){
                  var args = su.arranize(arguments);
                  this.rejectWith(this,args);
                  return this;
               },

               delay: function(ms){
                 var pros = s.Promise.create();
                 setTimeout(pros.resolve,ms);
                 return pros;
               },

               promise: function(){
                  var _p = {};
                  su.extends(_p,this);
                  delete _p.resolve;
                  delete _p.reject;
                  delete _p.rejectWith;
                  delete _p.notifyWith;
                  delete _p.notify;
                  // delete _p.promise;
                  _p.promise = function(){ return this; };
                  delete _p.resolveWith;

                  return _p;
               }

         });

        

        if(su.isNull(fn) || su.isFalse(fn)){
           deferred.reject(fn);
           return deferred;
        };

        if(fn){

            //if(su.isTrue(fn)){ deferred.resolve(); return deferred; }

            if(su.isObject(fn) && this.isPromise(fn)){
               handler = fn.promise;
               fn.then(
                  function(){ deferred.resolve(arguments); },
                  function(){ deferred.reject(arguments); },
                  function(){ deferred.notify(arguments); }
               );
               return deferred;
            }

            if(su.isObject(fn) && !this.isPromise(fn)){
               handler = fn;
               deferred.resolve(fn);
               return deferred;
            }

            if(su.isFunction(fn)){ 
               handler = fn.call(deferred,deferred);
               return deferred; 
            }

            if(su.isPrimitive(fn)){
               handler = fn;
               deferred.resolve(fn);
               return deferred;
            }
         }

         return deferred;
      };

      return {
        name: "AppStack.Promises",
         version: "1.0.0",
         description: "Implementation of Promise A spec",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Ewetumo",
         create: promise,
         isPromise: isPromise,
         when: function(deffereds){
            //returns a new defferd/promise
            var lists = su.normalizeArray(su.arranize(arguments)),
                self = this,
                count = lists.length,
                procCount = count,
                resValues = new Array(count),
                newDiffered = self.create(),
                promise = newDiffered.promise();

                 su.eachSync(lists,function(e,i,o,fn){
                     var item = ((isPromise(e)) ? e.promise() : self.create(e).promise());
                     if(item){
                        item.then(function(){},function(){
                          newDiffered.reject(arguments);
                        },function(){
                          resValues[i] = arguments.length === 1 ? arguments[0] : su.arranize(arguments);
                        });
                        procCount--;
                        fn(false);
                     }
                 },function(){
                     var cargs = su.flatten(resValues);
                     if(su.isEmpty(cargs)) su.normalizeArray(cargs);
                     cargs = (cargs.length === 0 ? resValues : cargs);
                     if(!procCount) newDiffered.resolveWith(newDiffered,cargs); 
                 },this);                


            return promise;
         },
      }
})(ToolStack.Utility,ToolStack.Callbacks);
ToolStack.Matchers = (function(ToolStack){
        
        ToolStack.ASColors();
    
        var Console = ToolStack.Console,
        util = ToolStack.Utility,

        makeString = function(split){
              var split = split || "",
              args = ([].splice.call(arguments,0));
              return args.splice(1,args.length).join(split);
            },
            generateResponse = function(name,item,should,message,scope){
            	var template = util.templateIt(message,should),
                  head  = makeString(" ","Matcher:".bold.blue,name.bold.yellow),
                  checked = makeString(" "," if",item,template,"\n").white;

            	  if(scope) head = head.concat(makeString(" ","  From:".bold.blue,scope.bold.yellow));
                var success = head.concat(makeString(" ","  Status:".bold.blue,"Passed!".bold.green,"\n","\t","Checked:".magenta)),
                failed = head.concat(makeString(" ","    Status:".bold.blue,"Failed!".bold.red,"\n","\t","Checked:".magenta));

                success = success.concat(checked);
                failed = failed.concat(checked);
                  
                return { pass: success, fail: failed };
            },

            responseHandler = function(state,response){
              if(!Console.log) Console.init('console');
              if(state) Console.log(response.pass);
              else{ Console.log(response.fail); throw new Error(response.fail); }
            },

            matchers = {
                 name: "Matchers",
                 version: "1.0.0",
                 description: "simple lightweight tdd style testing framework",
                 licenses:[ { type: "mit", url: "http://mths.be/mit" }],
                 author: "Alexander Adeniyin Ewetumo",
            };

            matchers.scope = null;
            matchers.item = null;

            matchers.obj = function(item){
              if(util.isNull(item)) this.item = 'null';
              else if(util.isUndefined(item)) this.item = 'undefined';
              else this.item = item;
              return this;
            };

            matchers.createMatcher = function(name,message,fn){
                if(!name || typeof message !== 'string') throw new Error("Please provide a name for the matcher");
                if(!message || typeof message !== 'string') throw new Error("Please provide a message for the matcher");
                if(!fn || typeof fn !== 'function') throw new Error("Please provide function for the matcher");


                  var sandbox = matchers,
                      matcher = function(){
                          var should = util.arranize(arguments);
                          var desc = (util.isString(sandbox.scope) ? sandbox.scope : (util.isObject(sandbox.scope) ? sandbox.scope.desc : ''));
                          var res = fn.apply(sandbox,should),
                              response = generateResponse(name,util.processIt(sandbox.item),util.processIt(should),message,desc);
                          return (res ? responseHandler(true,response) : responseHandler(false,response));
                      };
                
                  if(name in this) return false;
                  this[name] = matcher; return true;
            };

            matchers.createMatcher("toBe","is equal to {0}",function(should){
                  if(this.item !== should) return false;
                  return true;
            });

            matchers.createMatcher("toBeNull","is null",function(){
               util.explode(arguments);
               if(util.isNull(this.item)) return true;
               return false;
            });

            matchers.createMatcher("notToBe","is not equal to {0}",function(should){
               if(this.item !== should) return true;
               return false;
            });

            matchers.createMatcher("isTypeOf","is of type {0}",function(should){
               if(this.item !== should) return true;
               return false;
            });
             
            matchers.createMatcher("isValid","is a valid object",function(should){
                if(!util.isNull(this.item) && !util.isUndefined(this.item)) return true;
                return false;
            });

            matchers.createMatcher("isInstanceOf","is a instance of {0}",function(should){
               if(this.item !== should) return true;
               return false;
            });

            matchers.createMatcher('hasKey',' has property '+"{0}".red,function(key){
                if(util.has(this.item,key)) return true;
                return false;
            });

            matchers.createMatcher('isTrue',' is '+"True".green,function(){
                if(this.item === true) return true;
                return false;
            });

            matchers.createMatcher('hasKeyForm','has property '+ "{0}".red +' of type '.white+ "{1}".red,function(key,form){
                if(util.matchType(this.item[key],form)) return true;
                return false;
            });

          return function Shell(scope){
            matchers.scope = scope;
            return matchers;
          };

})(ToolStack);ToolStack.Jaz = (function(toolstack){


     if(!String.prototype.white) toolstack.ASColors();
     
      //main functions 
     var _su = toolstack.Utility,
         Console = toolstack.Console,
         Time = Date,
         sig = "__suites__",
         id = _su.guid(),
         Suite =  {
                    guid : id,
                     signature: sig,
                     showDebug: false,
                     specs : [],
                     before : null,
                     after : null,
                     total : 0,
                     passed : 0,
                     failed : 0,
                     title: "",
                     sandbox: {},
                     it : function(desc,fn){
                        //add the desc as a property of fn 
                        fn.desc = desc; fn.suite = this.title;
                        this.specs.push(fn);
                        this.total = this.specs.length;
                     },
                     beforeEach : function(fn){
                         var self = this;
                         this.before = function(){ return fn.call(self.sandbox); };
                     },
                     afterEach : function(fn){
                        var self = this;
                        this.after = function(){ return fn.call(self.sandbox); };
                     },
                    run: function(){
                        //handle and run all the specs 
                        Console.log("Info:".green +" Running Jaz Suite '".grey + this.title.bold.green +"';\n");
                        var self = this,
                            it = _su.eachAsync(this.specs,function(e,i,b,fn){
                               //make a clean scope
                              try{
                                 //using forceful approach we take on each it and run them 
                                 if(self.before) self.before();
                                 self.sandbox.desc = e.desc;
                                 e.call(self.sandbox);
                                 if(self.after) self.after();
                                 self.passed += 1;
                              }catch(j){
                                 self.failed += 1;
                              }
                              fn(false);
                        },function(e,i,b){
                              var message = _su.makeString("   ",("Total Passed:".bold.grey + (" "+self.passed).bold.green),
                                 ("Total Failed:".bold.grey + (" "+ self.failed).bold.red), ("Total Runned:".bold.grey + (" "+self.total).bold.yellow) + "\n");
                              Console.log(message);
                        },self);

                    }
        };

        return {
              name: "ToolStack.Jaz",
              version: "1.0.0",
              description: "simple lightweight tdd style testing framework",
              licenses:[ { type: "mit", url: "http://mths.be/mit" }],
              author: "Alexander Adeniyin Ewetumo", 
              license: "mit", 
              create: function JazCreate(title,func){
                 //to create encapsulate specs 
                 // create("kicker tester",function(){
                 // variable definitions heres
                 //
                 // it("should do something", function(){
                 //       asserts(this).obj(1).toBe(1);
                 // });
                 //
                    //});

                 Console.init('console');

                 var current = _su.clone(Suite,{});
                 current.title = title;
                 //run the func to prepare the suite 
                 func.call(current);
                 return current; 

              },
              createManager: function(){
                var man = { 
                    queue:[], 
                    add: function(title,func){
                        this.queue.push(toolstack.Jaz.create(title,func));
                    },
                    run: function(){
                        _su.forEach(this.queue,function(e,i,o){
                            if(_su.isObject(e)) return e.run();
                        });
                    },
                    flush: function(){
                        return _su.exlode(this.queue);
                    }
                };

                return man;
              },
        };


})(ToolStack);

ToolStack.Structures = {};
	var nodesig = "__node__",
     	nodelistsig = "__nodelist__",
	    //alises
	    struct = ToolStack.Structures;

      struct.Node = function(elem,next,previous){
        return { elem: elem, next : next, previous: previous, signature:"__node__"};
      };
      struct.NodeList = function(){
          this.first = null;
          this.last = this.first;
          this.size = 0;
      };
      struct.NodeList.prototype = {
          signature: nodelistsig,
          add: function(elem,node){
              var n = struct.Node(elem,null,node), pr,nx;
              if(!this.first){
                this.first = this.last = n;
                this.last.previous = this.first;
                this.first.previous = this.last;
                this.size +=1;
                return true;
              } 
              if(!node){
                  pr = this.last.previous; nx = this.last.next;
                  n.previous = this.last;
                  n.next = nx;
                  this.last.next = n;
                  this.last = n;
                  this.first.previous = this.last;
                  this.size +=1;
                  return true;
              }else{
                pr = node.previous; nx = node.next; nx.previous = n;
                node.next = n; n.next = nx; n.previous = node;
                this.size +=1;
                return true;
              }
          },

          remove: function(elem,node){
            var n,pr,next;
            if(this.first.elem === elem && this.first === this.last){
                 n = this.first;
                 this.first = this.last = null;
                 this.size -= 1;
                 return n;
            }
            n = this.first;
            while(n.next){
              if(n.elem === elem){
                pr = n.previous; nx = n.next;
                pr.next = nx;
                nx.previous = pr;
                break;
              }
              n = n.next;
            }
            return n;
          
          },

          prepend: function(elem){
            this.add(elem,this.last.previous);
            return this;
          },

          append: function(elem){
            this.add(elem);
            return this;
          },

          removeHead: function(){
            var n = this.first, pr = n.previous, nx = n.next;
            if(this.first === this.last){
                this.first = this.last = null; this.size = 0;
                return n;
            } 
            nx.previous = pr; 
            delete this.first;
            this.first = nx;
            this.size -= 1;
            return n;
          },

          removeTail: function(){
            var n = this.last, pr = n.previous, nx = n.next;
            if(this.last === this.first){
                this.first = this.last = null; this.size = 0;
                return n;
            } 
            pr.next = nx; 
            if(nx) nx.previous = pr;
            delete this.last;
            this.last = pr;
            this.size -= 1;
            return n;
          },

          getIterator: function(){
            return struct.ListIterator(this);
          }
      };
      struct.Iterator = function(){
        return { 
           focus: null, current: null,
           next: function(){}, hasNext: function(){},
           item: function(){}, signature : "__iterator__",
           reset: function(){ this.current = null; return this;}
        };
      };
      struct.ListIterator = function(focus){
        if(!focus.signature === nodelistsig) return;
        this._iterator = struct.Iterator();
        this._iterator.focus = focus;
        this._iterator.size = focus.size;
        this._iterator.current = focus.first;
        this._iterator.hasNext = function(){
          if(this.current) return true;
          return false;
        };
        this._iterator.next = function(){
          try{
            if(this.current.next) this.current = this.current.next;
            else this.current = null;
            return this;
          }catch(e){
            return;
          }
        };
        this._iterator.item = function(){
          try{
            if(!this.current) return;
            return this.current.elem;
          }catch(e){
            return;
          }
        };

        return this._iterator;
      };
      struct.Stack = function(){
          var stack =  {
            list : struct.NodeList(),
            pop: function(){},
            shift: function(){},
          };
          
          return stack;
      };ToolStack.Stalk = {
		 name: "ToolStack.Stalk",
         version: "0.0.2",
         description: "a basic exception managment library for functional programming",
         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
         author: "Alexander Adeniyin Ewetumo",

         init : function(rescueCallback){
			this._rescueCallback = rescueCallback;
			this._parent = Stack.current;
		}
};
ToolStack.Middleware = function(keygrator,comparator,fCallback){

	var util = ToolStack.Utility,
	ds = ToolStack.Structures,
	comparator = comparator,
	keygrator = keygrator;


	var handler = function(){
		var stack = arguments[0],
		final = arguments[1],
		args = util.makeSplice(arguments,2,arguments.length),
		iterator = stack.getIterator();

		function next(err){

			if(iterator.hasNext()){

				try{

					var step = iterator.item();
					var state = comparator.apply(null,[step.key].concat(args));
					var arity = step.middleware.length;

					iterator.next();

					if(err){ 
						if(arity === 4){
							return step.middleware.apply(null,([err].concat(args)).concat(next));
						}
						else{
							return next(err);
						}
					}else if(state && arity < 4){
						return step.middleware.apply(null,args.concat(next));
					}

					next();
					

				}catch(e){
					next(e);
				}

			}else{
				if(final && util.isFunction(final)){
					return final.apply(null,[err].concat(args));
				}
			}

		}

		next();


	};

	//comparator returns true or false when decided if a middleware should be runned
	//injector handles the injection of middleware into the stack;
	return function(finalCallback){
		var app = {};
			app.finalCallback = finalCallback || fCallback;
			app.stack = new ds.NodeList();
			app.use = function(key,fn){
					if(util.isFunction(key)){
						fn = key;
						key = keygrator();
					}
					else if(key && util.isFunction(fn)){
						key = keygrator(key);
					}
					else if(util.isObject(key)){
						if(!key['key'] || (!key['middleware'] || !util.isFunction(key['middleware']))) return;
						var middleware = key.middleware;
						middleware.key = key.key;
						fn = middleware;
						key = keygragtor(key.key);
					}else{
						return;
					};

					this.stack.append({ key: key, middleware: fn});
			}; 
			app.start = function(){
					var args = util.arranize(arguments);
					handler.apply(this,[app.stack,app.finalCallback].concat(args));
			};

			return app;

	};

};

ToolStack.Helpers = (function Helpers(ts){

	var util = ts.Utility,
	validatorDefault = function(){ return true; },
	helper = {};
	helper.HashMaps = {
		fetch: function(key){
			if(!helper.HashMaps.exists.call(this,key)) return false;
			return this[key];
		},
		exists: function(key,value){
			if(!this[key] && !util.has(this,key)) return false;
			if(value) return (this[key] === value)
			return true;
		},
		remove: function(key,value){
			if(helper.HashMaps.exists.call(this,key,value)) return (delete this[key]);
		},
		add: function(key,value,validator){
			if(!validator) validator = validatorDefault;
			if(helper.HashMaps.exists.call(this,key) || !validator(value)) return false;
			this[key] = value;
			return true;
		},
		modify: function(key,value,validator){
			if(!helper.HashMaps.exists.call(this,key)) return false;
			helper.HashMaps.add(key,value,validator)
			return true;
		}
	};

	return helper;
})(ToolStack);ToolStack.MessageAPI = (function(ts){


	var util = ts.Utility,
	helper = ts.Helpers.HashMaps,
	validator = function(value){
		if(util.isFunction(value)) return true;
		return false;
	},
	// process = function(api){
	// 	if(api.queue.length < 0) return false;

	// 	console.log('calling');

	// 	api.processing = true;

	// 	util.eachAsync(api.queue,function(e,i,o,fn){
	// 		var item = e;
	// 		item.fn(item.channel,item.domain,item.args);
	// 		o.shift();
	// 		fn(false)
	// 	},function(err){
	// 		api.processing  = false;
	// 		if(api.queue.length > 0) api.deliver();
	// 	},api);

	// 	return false;
	// },
	domain = util.clone(helper,{}),
	add = domain.add,
	modify = domain.modify,
	api = {};

	domain.add = function(key,value){
		return add.call(this,key,value,validator);
	};

	domain.modify = function(key,value){
		return modify.call(this,key,value,validator);
	};

	// api.queue = [];
	api.channels = {};
	api.processing = false;
	api.immediate = null;

	// api.deliver = function(){
	// 	if(this.processing) return;
	// 	process(this);
	// 	return this;
	// };

	api.notify = function(channel,domain){
		var channel = this.getChannel(channel),
			domain = domain,
			args = util.flatten(util.makeSplice(arguments,2,arguments.length));

		if(!channel) return false;

		if(this.immediate) channel.fire(domain,args);
		// else{
		// 	this.queue.push({ fn: function(channel,domain,args){
		// 		channel.fire(domain,args);
		// 	}, domain: domain, args: args, channel: channel });

		// 	// return this.deliver();
		// };
		
		return this;
	};

	api.addChannel = function(key){
		if(helper.exists.call(this.channels,key)) return false;

		var channel = {
			key:key, domains:{}
		};

		channel.fetch = util.proxy(domain.fetch,channel.domains);
		channel.add = util.proxy(domain.add,channel.domains);
		channel.remove = util.proxy(domain.remove,channel.domains);
		channel.modify = util.proxy(domain.modify,channel.domains);
		channel.fire = function(key,args){
			if(!channel.fetch(key)) return false;
			// var key = key, args = util.makeSplice(arguments,1,arguments.length);
			// args = util.flatten(args);
			return channel.fetch(key).apply(null,args);
		};

		return helper.add.call(this.channels,key,channel);
	};

	api.getChannel = function(key){
		return helper.fetch.call(this.channels,key);
	};

	api.sandbox = function(){
		return {
			notify: util.proxy(api.notify,api),
			getChannel: util.proxy(api.getChannel,api),
		};
	};

	return function(immediate){ 
		var clone = util.clone(api,{});
		clone.immediate = true;
		return clone;
	};

})(ToolStack);	