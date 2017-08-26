const twitterApi = require('./twitterApi.js');
const twitterHandles = require('./twitterHandles.js');
const database = require('../db/db.js');
var async = require('async');

const democratTweetUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.democrats, (handle, callback) => {
		 	twitterApi.getTweets(handle)
			.then((parsedTweets) => {
				async.each(parsedTweets.tweets, function(tweet, cb) {
					database.addTweet(tweet, 'Politics', 0, handle, cb);
				}, (err) => {
					if (err) {
						callback(err);
					} else {
						callback();
					}
				});
			})
		}, (err) => {
			if (err){
				reject(err);
			} else {
				console.log('finished adding all democratic tweets')
				resolve();
			}
		});
	})
};

const republicanTweetUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.republicans, (handle, callback) => {
		 	twitterApi.getTweets(handle)
			.then((parsedTweets) => {
				async.each(parsedTweets.tweets, function(tweet, cb) {
					database.addTweet(tweet, 'Politics', 1, handle, cb);
				}, (err) => {
					if (err) {
						callback(err);
					} else {
						callback();
					}
				});
			})
		}, (err) => {
			if (err){
				console.log(err);
				reject(err);
			} else {
				console.log('finished adding all republican tweets')
				resolve();
			}
		});
	})
};

module.exports.religionUpdateTweets = () => {
	forEach(twitterHandles.religious, function(handle, index, arr) {
  		twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Religion', 0, handle);
			}
		});
	});

	forEach(twitterHandles.atheist, function(handle, index,arr) {
	  	twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Religion', 1, handle);
			}
		});
	});
};

module.exports.genderUpdateTweets = () => {
	forEach(twitterHandles.male, function(handle, index, arr) {
  		twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Gender', 0, handle);
			}
		});
	});

	forEach(twitterHandles.female, function(handle, index,arr) {
	  	twitterApi.getTweets(handle)
		.then((parsedTweets) => {
			for (var i = 0; i < parsedTweets.tweets.length; i++) {
				database.addTweet(parsedTweets.tweets[i], 'Gender', 1, handle);
			}
		});
	});
};


<<<<<<< HEAD
module.exports.republicanTweetUpdate = republicanTweetUpdate;
module.exports.democratTweetUpdate = democratTweetUpdate;
=======
module.exports.updateTweets();
module.exports.religionUpdateTweets();
module.exports.genderUpdateTweets();

>>>>>>> updated
