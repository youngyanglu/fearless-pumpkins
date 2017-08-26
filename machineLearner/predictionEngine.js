const Python = require("python-runner");
const database = require('../db/db.js');
const PythonShell = require('python-shell');
const twitterApi = require('../helpers/twitterApi.js');
const async = require('async');

module.exports = (Handle) => {
	twitterApi.getTweets(Handle)
	.then((parsedTweets) => {
		var tweets = '';
		async.each(parsedTweets.tweets, function(tweet, callback) {
			tweets += tweet + ';'
		})
		return tweets;
	})
	.then((tweets) => {
		var options = {
		  mode: 'text',
		  pythonPath: 'python3',
		  args: [tweets]
		};
		PythonShell.run('/mlPredictor.py', options, function (err, results) {
		  if (err) throw err;
		  console.log('results: %j', results);
		});
	})
}

module.exports('hillaryclinton')