var ts = require('../builds/toolstack.full.js');
ts.ExtInit(ts);
ts = ts.ToolStack;

	
	var jaz = ts.Jaz,
		matcher = ts.Matchers.use,
		utility = ts.ToolChain;

		j = jaz.create('basic jaz testing',function(){

			var user;
			this.beforeEach(function(){
				user = 'dexter';
			});

			this.it('should be called dexter',function(){
				matcher(user,this).toBe("dexter");
			});

			this.it('should be called alex',function(){
				matcher(user,this).toBe("alex");
			});

			this.it('should be called not jain',function(){
				matcher(user,this).notToBe("jain");
			});
		});

		j.run();



