var Python = require("python-runner");
Python.execScript(
	__dirname + "/mlPredictor.py",
	{
		bin: "python2.7",
		args: [ "argument" ]
	}
)
.then(function(data){
    console.log(data);
});