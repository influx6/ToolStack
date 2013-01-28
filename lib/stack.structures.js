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
      };