const Python = require("python-runner");
const database = require('../db/db.js');
const PythonShell = require('python-shell');
const twitterApi = require('../helpers/twitterApi.js');
const async = require('async');

module.exports.genderPredictor = (Handle) => {
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
		PythonShell.run('/tweetPredictor.py', options, function (err, results) {
		  if (err) throw err;
		  console.log('results: %j', results);
		});
	})
}

module.exports.politicalPredictor = (Handle) => {
	twitterApi.getFriends(Handle)
	.then((parsedFriends) => {
		return parsedFriends.join(';')
	})
	.then((friends) => {
		var options = {
			mode: 'text',
			pythonPath: 'python3',
			args: [friends]
		};
		PythonShell.run('./friendPredictor.py', options, function(err, results) {
			if (err) throw err;
			console.log('results: %j', results);
		});
	})
}

module.exports.politicalPredictor('TheEllenShow')