const Python = require("python-runner");
const database = require('../db/db.js');
const PythonShell = require('python-shell');
const twitterApi = require('../helpers/twitterApi.js');
const async = require('async');

const genderPredictor = (Handle, callback) => {
	twitterApi.getTweets(Handle)
	.then((parsedTweets) => {
		var tweets = '';
		async.each(parsedTweets.tweets, (tweet, callback) => {
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
		PythonShell.run('../machineLearner/tweetPredictor.py', options, (err, results) => {
		  if (err) throw err;
		  callback(parseInt(Number(results)* 100));
		});
	});
};

const politicalPredictor = (Handle, callback) => {
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
		PythonShell.run('../machineLearner/friendPredictor.py', options, (err, results) => {
			if (err) throw err;
		 	callback(parseInt(parseFloat(results)* 100));
		});
	});
};

module.exports = (Handle, callback) => {
	genderPredictor(Handle, (male) => {
		politicalPredictor(Handle, (repub) => {
			callback({male, repub});
		});
	});
}
