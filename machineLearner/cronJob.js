const CronJob = require('cron').CronJob;
const Python = require("python-runner");
const twitterFetcher = require('../helpers/twitterFetcher.js');

new CronJob('00 30 23 * * *', function() {
	twitterFetcher.democratTweetUpdate()
	.then(twitterFetcher.republicanTweetUpdate)
	.then(() => {Python.execScript(
			
		)};
	);
}, null, true, 'America/Los_Angeles');

