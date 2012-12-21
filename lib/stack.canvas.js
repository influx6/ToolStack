(function(name,fn){
	if(typeof define === 'function') define(fn);
	else if(typeof module !== 'undefined') module.exports = fn;
	else this[name] = fn;
})("",function(){});