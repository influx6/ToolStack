ToolStack.Helpers = (function Helpers(ts){

	var util = ts.Utility,
	validatorDefault = function(){ return true; },
	helper = {};
	helper.HashMaps = {
		fetch: function(key){
			if(!helper.HashMaps.exists.call(this,key)) return;
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
		add: function(key,value,validator,force){
			if(!validator) validator = validatorDefault;
			if(helper.HashMaps.exists.call(this,key) || !validator(value)) return;
			this[key] = value;
			return true;
		},
		modify: function(key,value,validator){
			if(!validator) validator = validatorDefault;
			if(!helper.HashMaps.exists.call(this,key) || !validator(value)) return;
			this[key] = value;
			return true;
		}
	};

	return helper;
})(ToolStack);