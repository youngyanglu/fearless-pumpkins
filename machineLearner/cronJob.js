const CronJob = require('cron').CronJob;
const Python = require("python-runner");
const twitterFetcher = require('../helpers/twitterFetcher.js');

// new CronJob('00 30 23 * * *', function() {
// 	Python.execScript(

// 	)
// }, null, true, 'America/Los_Angeles');

twitterFetcher.democratTweetUpdate()
.then(twitterFetcher.republicanTweetUpdate)
.then(() => {console.log('all database finished')});