const CronJob = require('cron').CronJob;
const Python = require("python-runner");
const twitterFetcher = require('../helpers/twitterFetcher.js');

new CronJob('00 30 23 * * *', function() {
	twitterFetcher.democratTweetUpdate()
	.then(twitterFetcher.republicanTweetUpdate)
	.then(
		Python.execScript(
			__dirname + "/mlTrainer.py",
			{
				bin: "python3.6",
				args: [ "argument" ]
			}
		)
	);
}, null, true, 'America/Los_Angeles');
