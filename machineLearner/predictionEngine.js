const Python = require("python-runner");

module.exports = (Handle) => {
	Python.execScript(
		__dirname + "/mlPredictor.py",
		{
			bin: "python3" // how to pass variables to python file?
		}
	)
	.then(function(percentages){
	    console.log(percentages);
	});
}

	