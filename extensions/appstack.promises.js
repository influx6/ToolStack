"use strict";
!function(name,func){
  //check for specific module's systems else add it to the global
  if(typeof define === "function") define(func)
  else if(typeof module !== "undefined") module.exports = func;
  else this[name] = func; 
}("Promises",function(EM){

   //promise is a state based execution callback system as detailed by the Promise/A Specifications
   // ,which performs specific calls
   //depending on the result of its target or caller,you wrapp promises or call
   //them from within a object and call them properties depending on its
   //outcome

   EM.create("Promise",function(SU,CU){
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
            always : callbacks.create("forceContext")
         },
         deferred = {},
         _promise = {},
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

               always: function(fn){
                  if(!fn) return this;
                  if(isRejected() || isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memory[0],memory[1]);
                     });
                     return this;
                  }
                  lists.always.add(fn);
                  return this;
               },

               show: function(){
                  console.log("Deffered Done:",lists.done.show());
                  console.log("Deffered Fail:",lists.fail.show());
                  console.log("Deffered Always:",lists.always.show());
               },

               get: function(){
                  //request a specifc value from a specific holding object(like
                  //current handler of the promise and return
                  //a promise/deffered with that value 
                  if(!handler) return;
               },

               //to ensure no conflict between Object.call and and CommonJS API
               //call for promises,call is synonized with ask 
               //ask calls a given function on the promise target and returns
               //the result as a promise
               ask: function(fnName /*, args1,args2,args3...etc */){
                  //as to run a specific function on a specific object(holding
                  //the current promise and return result as promise/deffered
                  if(!handler) return;
               },

               then: function(success,fail,always){
                  //adds multiple sets to the current promise/deffered being
                  //called;
                  this.done(success).fail(fail).always(always);
                  return this;
               },


               resolveWith: function(ctx,args){
                  if(isResolved() || isRejected()){ return this;}
                  //fire necessary callbacks;
                  lists.done.fireWith(ctx,args);
                  lists.always.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memory = [ctx,args];
                  //disable fail list if resolved
                  lists.fail.disable();
                  //set state to resolve
                  state = "resolved";
                  return this;
               },

               rejectWith: function(ctx,args){
                  if(isRejected() || isResolved()){ return this; }
                  //fire necessary callbacks;
                  lists.fail.fireWith(ctx,args);
                  lists.always.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memory = [ctx,args];
                  //disable done/success list;
                  lists.done.disable();
                  //set state to rejected
                  state = "rejected";
                  return this;
               },

               notifyWith: function(ctx,args){
                 if(isRejected() || isResolved()) return this;

                 memory = [ctx,args];
                 lists.always.fireWith(ctx,args);
                 return this;
               },

               notify: function(){
                  this.notifyWith(this,arguments);
                  return this;
               },

               resolve: function(){
                  this.resolveWith(this,arguments);
               },

               reject: function(){
                  this.rejectWith(this,arguments);
               },

               delay: function(ms){
                 var pros = s.Promise.create();
                 setTimeout(pros.resolve,ms);
                 return pros;
               },

               promise: function(){
                  var _p = _promise;
                  su.extends(_p,this);
                  delete _p.resolve;
                  delete _p.reject;
                  delete _p.rejectWith;
                  delete _p.notifyWith;
                  delete _p.promise;
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
            var lists = su.normalizeArray(arguments.length === 1 ? [deffereds] : su.arranize(arguments)),
                self = this,
                count = lists.length,
                procCount = count,
                resValues = new Array(count),
                newDiffered = self.create(),
                promise = newDiffered.promise(),
                iterator = su.iterable(lists,function(e,i){
                     //will notify the objects in all the deffereds recieved
                     var item;
                     (isPromise(e)) ? item = e.promise() : item = self.create(e).promise();

                     if(item){
                        item.then(function(){
                           //waiting thoughts;
                        },function(){
                           newDiffered.reject(arguments);
                        },function(){
                            console.log(arguments);
                           //set here cause we can call notify as manytimes
                           //as possible
                           resValues[i] = arguments.length === 1 ? arguments[0] : su.arranize(arguments);
                        });

                        procCount--;
                     }
                     
                     console.log(procCount);

                 },function(e,i){
                     var args = su.flatten(resValues);
                     console.log(args);
                     args.length === 0 ? (args = lists) : args;

                     if(!procCount) newDiffered.resolveWith(newDiffered,args);
                 });
                

                while(!(count <= -1)){
                  iterator.next();
                  count--;
                }

            return promise;
         },
      }
   },["ToolChain","Callbacks"],true);

});
