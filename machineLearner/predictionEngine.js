const Python = require("python-runner");

Python.execScript(
	__dirname + "/mlPredictor.py",
	{
		bin: "python3"
	}
)
.then(function(data){
    console.log(data);
});
