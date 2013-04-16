(function(ToolStack){

    ToolStack.Structures = {};
	    
      var util = ToolStack.Utility,
      struct = ToolStack.Structures;
      struct.Range = function(range,generator){
        if(!util.isString(range)) throw new Error('Only Stringed ranges eg "a..z" or "1..2" are allowed!');

        var r = range.split('..');
        if(r.length > 2) r.length = 2;

        return generator.apply(null,r);
      };
      struct.NumberRange = function(range,inc){
        return struct.Range(range,function(min,max){
            min = parseInt(min);  max = parseInt(max);
            var series = [], tinc = inc || 1;
            // inject = function(c){ return series.push(c); };
            while(min <= max){ series.push(min); min += tinc; };
            return series;
          });
      };
      struct.Node = function(elem,next,previous){
        var self = this,
        node = {
          isNode: function(){ return true; },
          elem: elem, 
          next : next || null, 
          previous: previous || null,
          parent: null,
          udex: 0,
          append: function(elem){
            var nxt = this.next;
            if(!util.isFunction(elem.isNode)){
              (!this.next) ? this.next = struct.Node(elem) : this.next = struct.Node(elem,nxt,self);
              // this.next.next = nxt;
              return;
            }
            this.next = elem; 
            elem.next = nxt;
            return true;
          },
          prepend: function(elem){
            var prv = this.previous;
            if(!util.isFunction(elem.isNode)){
              (!this.previous) ? this.previous = struct.Node(elem) : this.previous = struct.Node(elem,self,prv);
              this.previous.next = this;
              return;
            }
            this.previous = elem;
            elem.previous = prv;
            elem.next = this;
            return true;
          }
        };

        node.left = node.previous;
        node.right = node.next;
        return node;
      };

      struct.NodeList = function(){
        return {
          root: null,
          tail: null,
          size: 0,
          isList: function(){ return true; },
          isEmpty: function(){ if(!this.size && !this.root && !this.tail) return true; return false;},
          head: function(){ return this.root; },
          rear: function(){ return this.tail; },
          add: function(elem,node){
             if(!this.root){
              this.root = struct.Node(elem,node);
              this.tail = this.root;
              // this.root.isRoot = true;
             }
            if(node) node.append(elem);
            else{
              this.tail.append(elem);
              this.tail = this.tail.next;
            }
            this.size += 1;
            return;
          },

          remove: function(elem){
            if(!this.size) return;
            var n,pr,next;

            if(this.size === 1){
                 n = this.root;
                 this.root = this.tail = null;
                 this.size = 0;
                 return n;
            }
            n = this.root;
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
          //adds from the back of the tail element
          prepend: function(elem){
             if(!this.root){
              this.root = struct.Node(elem);
              this.tail = this.root;
              this.size = 1;
              return this;
              // this.root.isRoot = true;
             }
            this.root.prepend(elem);
            this.root = this.root.previous;
            this.size += 1;
            // this.add(elem,this.root);
            return this;
          },
          //adds in front of the tail element
          append: function(elem){
            if(!this.root){
              this.root = struct.Node(elem);
              this.tail = this.root;
              this.size = 1;
              return this;
              // this.root.isRoot = true;
             }
            // this.add(elem);
            this.tail.append(elem);
            this.tail = this.tail.next;
            this.size += 1;
            return this;
          },
          //pops of the root of the list
          popHead: function(){
            if(!this.size) return;
            var n = this.root, pr = n.previous, nx = n.next;
            if(this.size === 1){
                this.root = this.tail = null; this.size = 0;
                return n;
            } 
            nx.previous = pr; 
            delete this.root;
            this.root = nx;
            this.size -= 1;
            return n;
          },

          popTail: function(){
            if(!this.size) return;
            var n = this.tail, pr = n.previous, nx = n.next;
            if(!this.size === 1){
                this.root = this.tail = null; this.size = 0;
                return n;
            } 
            pr.next = nx; 
            if(nx) nx.previous = pr;
            delete this.tail;
            this.tail = pr;
            this.size -= 1;
            return n;
          },

          getIterator: function(){
            if(this.itr){ this.itr.reset(); return this.itr; }
            return (this.itr = struct.ListIterator(this));
          },
        };
      };

      struct.Iterator = function(){
        return { 
           lists: null, 
           current: null,
           next: function(){}, 
           hasNext: function(){ return false; },
           item: function(){},
           reset: function(){ this.current = null; return this;}
        };
      };
      struct.ListIterator = function(list){
        if(!util.isFunction(list.isList)) return;
        var iterator = struct.Iterator();

        iterator.lists = list;

        iterator.next = function(){ 
          if(!this.current) return (this.current = this.lists.root);
        }

        iterator.hasNext = function(){
          if(!this.current) return (this.current = this.lists.root).next;
          return this.current.next;
        };

        iterator.item = function(){
          if(!this.current) return (this.current = this.lists.root).elem;
        };

        return this.iterator;
      };
      struct.Stack = function(){
          var s =  {
            stack : new struct.NodeList(),
            pop: function(){
              return this.stack.popTail().elem;
            },
            shift: function(){
              return this.stack.popHead().elem;
            },
            unShift: function(elem){
              this.stack.prepend(elem);
              return this;
            },
            push: function(elem){
              this.stack.append(elem);
              return this;
            },
            isEmpty: function(){
              return this.stack.isEmpty();
            },
            elem: function(){
              if(this.stack.isEmpty()) return null;
              return this.queue.rear().elem;
            },
          };
          
          return s;
      };
      struct.Queue = function(){
        var q = {
          queue: struct.NodeList(),
          enQueue: function(elem){
            this.queue.append(elem);
            return this;
          },
          elem: function(){
            if(this.queue.isEmpty()) return null;
            return this.queue.head().elem;
          },
          deQueue: function(){
            this.queue.popHead();
            return this;
          },
          isEmpty: function(){
            return this.queue.isEmpty();
          }
        };
        return q;
      };
      struct.Tree = function(elem,left,right,root){
        var tree = {};
        tree.elem = elem;
        tree.root = null;
        tree.left = null;
        tree.right = null;
        tree.height = 0;

        var makeChild = function(elem,prop,parent){
          if(util.isFunction(elem.isNode)) return (this[prop] = struct.Tree(elem.elem));
          // if(util.isFunction(elem.isList)) return (this[prop] = struct.Tree(elem));
          if(util.isFunction(elem.isTree)) return (this[prop] = elem);
          return (this[prop] = struct.Tree(elem));
        };

        tree.setLeft = function(elem){
          var l =  makeChild(elem,'left');
          l.root = this;
          return this;
        };

        tree.setRight = function(elem){
          var r = makeChild(elem,'root');
          r.root = this;
          return this;
        };

        tree.setRoot = function(root,unroot){
          if(this.root && !unroot) return;
          if(!util.isFunction(root.isTree)) return;
          
          this.root = root;
          if(!root.left) root.setLeft(this);
          else if(!root.right) root.setRight(this);
          //well you handle where you want to put it
        };

        tree.isTree = function(){ return true; };

        if(left) this.setLeft(left);
        if(right) this.setLeft(right);
        if(root) this.setRoot(root);

        return tree;
      };

      struct.PriorityQueueBin = function(keygator){

        var bin = {};

        bin.keygen = util.isFunction(keygator) ? keygator : function(i){ return i };
        bin.register = {};
        bin.ranges = [];
        bin.rotor = [];
        //this dictates if the bin pops individual bins at each call of eject rather than
        // poping all contents of a bin before moving to a lower priority bin
        bin.parrallel = false;
        bin.bins = {};

        bin.createBin = function(id,key){
          if(this.bins[id]) return;
          var k,bin = struct.Queue();
          bin.key = this.keygen(key);
          this.bins[id] = bin;
          ((k = this.register[bin.key]) ? k.push(id) : this.register[bin.key] = [id]);
          if(this.ranges.indexOf(bin.key) === -1)  this.ranges.push(bin.key)
          return this;
        };

        bin.grabBin = function(id){
          return this.bins[id];
        };

        bin.grabPriority = function(id){
          return this.register[id];
        }

        //push by priority or by id
        bin.queue = function(id,msg){
          if(!id || !msg) return;

          var bin = this.grabBin(id);
          if(bin) bin.enQueue(msg);
          return;
        };

        bin.eject = function(fn){
          //allows selective ejection for specific cases,if without arguments,eject pops the first highest
          //priority bin
          if(!this.rotor.length) this.rotor = util.clone(this.ranges);
          console.log(this.rotor);
          var i = this.grabPriority(this.rotor[0]), sz = i.length,ez = 0;
          util.eachSync(i,function(e,i,o,c){ 
            var b = this.grabBin(e);
            if(util.isFunction(fn) && !b.isEmpty()){ fn(b.elem()); b.deQueue(); };
            if(b.isEmpty()) ez += 1;
            c();
          },function(){
            if(ez >= sz){
              this.rotor.shift();
              ez = 0;
            }
          },this);

        };

        // util.each(sets,function(e,i){ this.createBin(e,i); } ,bin);
        return bin;
      };

})(ToolStack);