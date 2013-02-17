ToolStack.Promise = (function(SU,CU){
      var su = SU,
          callbacks = CU,
          isPromise = function isPromise(e){
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
      promise = function PromiseCreator(fn){

         var state = "pending",lists = {
            done : callbacks.create("once forceContext"),
            fail : callbacks.create("once forceContext"),
            progress : callbacks.create("forceContext")
         },
         deferred = {},
         memory = [[],[],[]],
         memorydone=memory[0],
         memoryfail=memory[1],
         memorynotify=memory[2],
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

               __show: function(){ return lists; },

               state : function(){
                  return state;
               },

               done: function(fn){
                  if(!fn) return this;
                  if(isResolved()){
                     su.forEach(su.arranize(arguments),function(e,i){
                        if(!su.isFunction(e)) return;
                        e.apply(memorydone[0],memorydone[1]);
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
                        e.apply(memoryfail[0],memoryfail[1]);
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
                        e.apply(memorynotify[0],memorynotify[1]);
                     });
                     return this;
                  }
                  lists.progress.add(fn);
                  return this;
               },


               then: function(done,fail,progress){

                  //returns a new promise which resolves with this promise
                  //adds multiple sets to the current promise/deffered being
                  //called;

                  var self = this,
                      defer = ToolStack.Promise.create(),
                      isp = false,
                      stateHandler = function stateHandler(action,state,fn){
                        return function(){
                          if(!su.isFunction(fn)) return self[action](defer[state]); 
                          else{
                            var returned = fn.apply(this,arguments);
                            if(returned && isPromise(returned) && !isp){ 
                              returned.promise().then(defer.resolve,defer.reject,defer.notify);
                              isp = true;
                              return;
                            }
                            else{
                              defer[state+"With"](defer,[returned]);
                            }
                          }
                        }
                      };

                  self.done(stateHandler('done','resolve',done))
                  .fail(stateHandler('fail','reject',fail))
                  .progress(stateHandler('progress','notify',progress))
                  //add the call back


                  return defer.promise();
               },

               //return the value used to resolve,reject it
               get: function(){
                  if(isResolved()) return memorydone[1];
                  if(isRejected()) return memoryfail[1];
               },

               resolveWith: function(ctx,args){
                  if(isResolved() || isRejected()){ return this;}
                  //fire necessary callbacks;
                  state = "resolved";
                  lists.done.fireWith(ctx,args);
                  lists.progress.fireWith(ctx,args);
                  //store fired context and arguments for when callbacks are added after resolve/rejection
                  memorydone = [ctx,args];
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
                  memoryfail = [ctx,args];
                  //disable done/success list;
                  lists.done.disable();
                  //set state to rejected
                  return this;
               },

               notifyWith: function(ctx,args){
                 if(isRejected() || isResolved()) return this;
                 memorynotify = [ctx,args];
                 lists.progress.fireWith(ctx,args);
                 return this;
               },

               notify: function(){
                  var args = su.arranize(arguments);
                  su.bind(function(){
                    this.notifyWith(this,args);
                  },deferred)();
               },

               resolve: function(){
                  var args = su.arranize(arguments);
                  //ensure it keeps the current context
                  su.bind(function(){
                      this.resolveWith(this,args);
                  },deferred)();

               },

               reject: function(){
                  var args = su.arranize(arguments);
                  //ensure it keeps the current context
                  su.bind(function(){
                     this.rejectWith(this,args);
                  },deferred)();

               },

               delay: function(ms){
                 var pros = s.Promise.create();
                 setTimeout(pros.resolve,ms);
                 return pros;
               },

               promise: function(){
                  if(this.__p) return this.__p;

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

                  this.__p = _p;
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
