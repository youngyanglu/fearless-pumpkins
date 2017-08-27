const twitterApi = require('./twitterApi.js');
const twitterHandles = require('./twitterHandles.js');
const database = require('../db/db.js');
var async = require('async');

const maleTweetUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.female, (handle, callback) => {
		 	twitterApi.getTweets(handle)
			.then((parsedTweets) => {
				async.each(parsedTweets.tweets, function(tweet, cb) {
					database.addTweet(tweet, 'Gender', 0, handle, cb);
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
				console.log('finished adding all male tweets')
				resolve();
			}
		});
	})
};

const femaleTweetUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.male, (handle, callback) => {
		 	twitterApi.getTweets(handle)
			.then((parsedTweets) => {
				async.each(parsedTweets.tweets, function(tweet, cb) {
					database.addTweet(tweet, 'Gender', 1, handle, cb);
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
				console.log('finished adding all female tweets')
				resolve();
			}
		});
	})
};

const democratFriendsUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.democrats, (handle, callback) => {
		 	twitterApi.getFriends(handle)
			.then((parsedFriends) => {
				friendString = parsedFriends.join(', ');
				database.addTweet(friendString, 'Politics', 0, handle, callback);
			});
		}, (err) => {
			if (err){
				console.log(err);
				reject(err);
			} else {
				console.log('finished adding all democratic friends')
				resolve();
			}
		});
	})
};

const republicanFriendsUpdate = () => {
	return new Promise((resolve, reject) => {
		async.each(twitterHandles.republicans, (handle, callback) => {
		 	twitterApi.getFriends(handle)
			.then((parsedFriends) => {
				friendString = parsedFriends.join(', ');
				database.addTweet(friendString, 'Politics', 1, handle, callback);
			});
		}, (err) => {
			if (err){
				console.log(err);
				reject(err);
			} else {
				console.log('finished adding all republican friends')
				resolve();
			}
		});
	})
};

module.exports.maleTweetUpdate = maleTweetUpdate;
module.exports.femaleTweetUpdate = femaleTweetUpdate;
module.exports.democratFriendsUpdate = democratFriendsUpdate;
module.exports.republicanFriendsUpdate = republicanFriendsUpdate;
