const twitterApi = require('./twitterApi.js');
const twitterHandles = require('./twitterHandles.js');
const database = require('../db/db.js');
var forEach = require('async-foreach').forEach;

module.exports.updateTweets = () => {
	forEach(twitterHandles.democrats, function(handle, index, arr) {
  		twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Politics', 0, handle);
			}
		});
	});

	forEach(twitterHandles.republican, function(handle, index,arr) {
	  	twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Politics', 1, handle);
			}
		});
	});
};


module.exports.updateTweets();

