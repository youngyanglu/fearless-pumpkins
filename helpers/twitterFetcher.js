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


module.exports.republicanTweetUpdate = republicanTweetUpdate;
module.exports.democratTweetUpdate = democratTweetUpdate;
