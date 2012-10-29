!function(name,func){
	//check for specific module's systems else add it to the global
	if(typeof define === "function") define(func)
	else if(typeof module !== "undefined") module.exports = func;
	else this[name] = func; 
}("Console",function(EM){

	EM.create("Console",function(){

		return {
	         name: "AppStack.Console",
	         version: "1.0.0",
	         description: "simple lightweight tdd style testing framework",
	         licenses:[ { type: "mit", url: "http://mths.be/mit" }],
	         author: "Alexander Adeniyin Ewetumo",
		};
		
	});

});