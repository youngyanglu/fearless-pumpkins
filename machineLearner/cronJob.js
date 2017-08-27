const CronJob = require('cron').CronJob;
var PythonShell = require('python-shell');
const twitterFetcher = require('../helpers/twitterFetcher.js');

var options = {
  mode: 'text',
  pythonPath: 'python3',
};

// new CronJob('00 30 23 * * *', function() {
	// twitterFetcher.femaleTweetUpdate()
	// .then(twitterFetcher.maleTweetUpdate)
	// .then(
	// 	PythonShell.run('/mlTrainer.py', options, (err, results) => {
	// 	  if (err) throw err;
	// 	  console.log('results: %j', results);
	// 	});
	// );
// }, null, true, 'America/Los_Angeles');



// twitterFetcher.democratFriendsUpdate()
// .then(twitterFetcher.republicanFriendsUpdate)