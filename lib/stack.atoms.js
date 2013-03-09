ToolStack.Atoms = function AtomCreator(json){

	var  
		util = ToolStack.Utility,
		helpers = ToolStack.Helpers.HashMaps,
		shell = function(key,old,val,frozen){
			return { key:key, old: old, val: val,frozen: frozen };
		},
		isAtom = function(atom){
			if(util.isObject(atom) && util.isFunction(atom.isAtom) && atom.isAtom()) return true;
			return false;
		},
		add = fetch = remove = modify = null,
		atom = {};


	atom.e = ToolStack.Events();
	atom.d = {};
	atom.h = {};

	atom.h.add = util.bind(helpers.add,atom.d);
	atom.h.exists = util.bind(helpers.exists,atom.d);
	atom.h.remove = util.bind(helpers.remove,atom.d);
	atom.h.fetch = util.bind(helpers.fetch,atom.d);
	atom.h.modify = util.bind(helpers.modify,atom.d);

	atom.e.set('change');

	atom.get = function(key){
		if(this.h.exists(key)) return this.h.fetch(key)['val'];
	};

	atom.set = function(key,value){
		if(!key || !value) return;
		if(util.isObject(value)) return this._setAtom(this.h.exists(key),key,value);

		this._setUnit(this.h.exists(key),key,value);
		return this.emit('change');
	};

	atom._setUnit = function(exists,key,value){
		if(!exists){
			this.e.set(key.concat(':change'));
			this.e.set(key.concat(':deleted'));
			return this.h.add(key,shell(key,value,value,value));
		}

		var item = this.h.fetch(key);

		if(item.val === value) return;

		item.old = item.val;
		item.val = value;
		item.frozen = value;

		this.emit(key.concat(':change'),value);
		// this.emit('change');
		return this.h.modify(key,item);
	};

	atom._setAtom = function(exists,key,obj){
		if(!exists){
			this.e.set(key.concat(':change'));
			this.e.set(key.concat(':deleted'));
			return this.h.add(key,shell(key,obj,AtomCreator(obj),obj));
		}

		var item = this.h.fetch(key);

		if(util.matchObjects(item.frozen,obj)) return;

		item.old = item.frozen;

		item.val.implode();
		item.val = AtomCreator(obj);
		item.frozen = obj;

		this.emit(key.concat(':change'));
		// this.emit('change');
		return this.h.modify(key,item);
	};

	atom.eject = function(key){
		var item = this.h.fetch(key);
		if(!item) return;

		if(isAtom(item.val)) item.val.implode();
		this.h.remove(key);
		return this.emit(key.concat(':deleted'));
	};

	// atom.union = function(atom){
	// 	//combines two atoms into one

	// };

	// atom.split = function(){
	// 	//splits up all data into single atoms

	// };

	atom.json = function(callback){
		var data = {};
		util.eachAsync(this.d,function(e,i,o,fn){
			data[i] = e.frozen;
			fn(false);
		},function(){
			if(callback) callback(JSON.stringify({ data: data, isAtom: true }));
		});
	};

	atom.isAtom = function(){ return true; };

	atom.fuseAtom = function(json){
		if(util.isString(json)) json = JSON.parse(json);
		if(!json.isAtom) throw new Error('Invalid Atomd JSON');
		util.merge(json,this.d);
		return true;
	};

	atom.fuseJSON = function(json){
		if(util.isString(json)) json = JSON.parse(json);
		util.eachAsync(json, function(e,i,o,fn){
			this.set(i,e);
			fn(false);
		},null,this);
	};

	atom.fuse = function(atom){
		if(util.isString(atom)){
			atom = JSON.parse(atom);
			return ( atom.isAtom === true ? this.fuseAtom(atom) : this.fuseJSON(atom));
		};

		if(isAtom(atom)) return atom.json(function(json){ this.fuse(json); });
	};

	atom.implode = function(){
		util.eachAsync(this.d,function(e,i,o,fn){
			if(util.isObject(e) && isAtom(e)) e.implode();
			fn(false);
		},function(){
			util.explode(this.d);
			util.explode(this.h);
			util.explode(this);
		},this);
	};

	atom.on = util.bind(atom.e.on,atom.e);
	atom.off = util.bind(atom.e.off,atom.e);
	atom.emit = util.bind(atom.e.emit,atom.e);

	atom.fuseJSON(json);

	return atom;
};
