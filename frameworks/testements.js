var Testement = (function(){
            var Console = LoggerManager.expect,
                expectations = {},
                rejections = {},
                expectDetail = function(color,reset,type,i,message){
                  return _su.makeString(" ",type,i,cres(message,color,reset));
                };

            return{

               done: function(){
                  _su.forEach(expectations,function(e,i){
                     if(!e){
                        Console.log(expectDetail(asc.fg.red,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Expectation:",asc.reset),
                        i,"is still unfullfilled!"));
                        return;
                     }
                        Console.log(expectDetail(asc.fg.green,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Expectation:",asc.reset),
                        i,"is fullfilled!"));
                        return;
                  },this);
                  _su.forEach(rejections,function(e,i){
                     if(!e){
                        Console.log(expectDetail(asc.fg.green,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Rejection:",asc.reset),
                        i,"is rejected!"));
                        return;
                     }
                        Console.log(expectDetail(asc.fg.red,asc.reset,_su.makeString(" ",asc.fg.cyan,"  - Rejection:",asc.reset),
                        i,"is still unrejected!"));
                        return;
                  },this);

                  _su.explode(expectations,rejections);

               },

               fulfill: function(e){
                  if(e in expectations && !expectations[e]){
                     expectations[e] = true;
                  }
                  return this;
               },

               reject: function(e){
                  if(e in rejections && rejections[e]){
                     rejections[e] = false;
                  }
                  return this;
               },

               agreeTo: function(e){
                  if(e in expectations) return;
                  expectations[e] = false;
                  return this;
               },

               refuseTo: function(e){
                  if(e in rejections) return;
                  rejections[e] = true;
                  return this;
               },

           };

         }),
