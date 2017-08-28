var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var twitterApi = require('../helpers/twitterApi.js');
var predictionEngine = require('../machineLearner/predictionEngine.js');
// var googleApi = require('../helpers/googleAPI.js');
var db = require('../db/db.js');
// var engine = require('../helpers/tweetricsEngine.js');

var app = express();

app.set('port', (process.env.PORT || 3000));

// Necessary to serve the index.html page
app.use(express.static(__dirname + '/../client/dist'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/name', (req, res) => {
  twitterApi.getTweets(req.body.screenName)
  .then((parsedTweets) => {
    return parsedTweets;
  })
  .then((response) => {
    db.findHandle(req.body.screenName, (err, handle) => {
      if (!handle) {
        predictionEngine(req.body.screenName, (results) => {
          db.addHandle(req.body.screenName, results.repub, results.male, () => {
            response.infographicState = {};
            response.infographicState.dem = {percent: 100 - results.repub};
            response.infographicState.rep = {percent: results.repub};
            response.infographicState.male = {percent: results.male};
            response.infographicState.female = {percent: 100 - results.male};
            res.status(200).send(response);
          });
        });
      } else {
        rep = handle.ProbabilityPoliticsRepub;
        male = handle.ProbabilityGenderMale;
        db.findAllHandles((err, results) => {
        })
        db.increaseCount(req.body.screenName, () => {
          response.infographicState = {};
          response.infographicState.dem = {percent: 100 - rep};
          response.infographicState.rep = {percent: rep};
          response.infographicState.male = {percent: male};
          response.infographicState.female = {percent: 100 - male};
          res.status(200).send(response);
        });
      }
    });
  });
});

app.post('/user', (req, res) => {
  res.status(200);

  // get tweets from a specific city;
  

  // twitterApi.getTweets(req.body.screenName)
  // .then((parsedTweets) => {
  //   return parsedTweets;
  // })
  // .then((response) => {
  //   response.infographicState = {};
  //   response.infographicState.dem = {percent: 20};
  //   response.infographicState.rep = {percent:80};
  //   return response;
  // })
  // .then((response) => {
  //   res.status(200).send(response);
  // });
});

// should return to the client the data for the infographic
// app.post('/name', function (req, res) {
//   if (!req.body) { return res.sendStatus(400); }

//   console.log('POST received screen_name: ', req.body.screenName);

//   // check if screenname allredy in db
//   db.isTwitterUserLastUpdateYoungerThan(req.body.screenName)
//     .then(function(bool) {
//       if (bool) {
//         // if allready in db and younger than 2 days
//         // update count and return database row
//         db.updateCount(req.body.screenName)
//           .then(function(dbOutput) {
//             res.status(200).send(dbOutput);
//           })
//           .catch(function(err) {
//             res.status(400).send(err);
//           });

//       } else {
//         // if not in db or older than 2 days
//         // get tweets friens google API and pass by the machine
//         twitterApi.getTweets(req.body.screenName)
//           .then(function(parsedTweets) {
//             return parsedTweets;

//           }).then(function(parsedTweets) {
//             var parsedTweetsWithFriends = twitterApi.getFriends(parsedTweets);
//             return parsedTweetsWithFriends;
//           }).then(function(parsedTweetsWithFriends) {
//             var lexicalAnalysisWithFriends = googleApi.sendToGoogleAPI(parsedTweetsWithFriends);
//             return lexicalAnalysisWithFriends;

//           }).then(function(lexicalAnalysisWithFriends) {
//             // send user to the machine
//             var dbInput = engine.democratOrRepublican(lexicalAnalysisWithFriends);

//             var dbOutput = db.writeTwitterUser(dbInput);
//             return dbOutput;

//           }).then(function(dbOutput) {
//             res.status(200).send(dbOutput);

//           }).catch(function(err) {
//             if (err[0]) {
//               if (err[0].message === 'Rate limit exceeded' && err[0].code === 88 ) {
//                 twitterApi.getRateLimitStatus()
//                   .then(function(limitRate) {
//                     res.status(200).send(limitRate);
//                   }).catch(function(err) {
//                     console.log('error: ', err);
//                     res.status(400).send(err);
//                   });
//               } else {
//                 console.log('error: ', err);
//                 res.status(400).send(err);
//               }
//             } else {
//               console.log('error: ', err);
//               res.status(400).send(err);
//             }
//           });
//       }

//     })
//     .catch(function(err) {
//       console.log('error: ', err);
//       res.status(400).send(err);
//     });
// });

// should return to the client the data for the infographic
app.post('/limitRate', function (req, res) {
  if (!req.body) { return res.sendStatus(400); }

  console.log('POST limit rate');

  twitterApi.getRateLimitStatus()
    .then(function(limitRate) {
      res.status(200).send(limitRate);

    }).catch(function(err) {
      console.log('error: ', err);
      res.status(400).send(err);
    });
});

// should return to the client the data for the infographic
app.post('/usersSearch', function (req, res) {
  if (!req.body) { return res.sendStatus(400); }

  console.log('POST user search');

  twitterApi.getUsersSearch(req.body.q)
    .then(function(users) {
      console.log('Searched user: ', users);
      res.status(200).send(users);

    }).catch(function(err) {
      console.log('error: ', err);
      res.status(400).send(err);
    });
});

// should return to the user in db
app.get('/usersList', function (req, res) {

  console.log('GET request for users list received');
  let callback = (err, users) => {
    if (err) {
      console.log('error in usersList: ', err);
      res.status(400).send(err);
    } else {
      res.status(200).send(users);
    }
  }
  db.findAllHandles(callback);
  // db.fetchAllTwitterUsers()
  //   .then(function(users) {
  //     res.status(200).send(users);
  //
  //   }).catch(function(err) {
  //     console.log('error: ', err);
  //     res.status(400).send(err);
  //   });
});

// should return true if in db and youbger than 2 days or false
app.post('/youngerThan', function (req, res) {

  console.log('POST younger than');

  db.isTwitterUserLastUpdateYoungerThan(req.body.screenName)
    .then(function(bool) {
      res.status(200).send(bool);

    }).catch(function(err) {
      console.log('error: ', err);
      res.status(400).send(err);
    });
});

// should return true if in db and youbger than 2 days or false
app.post('/updateCount', function (req, res) {

  console.log('POST update count');

  db.updateCount(req.body.screenName)
    .then(function(row) {
      res.status(200).send(row);

    }).catch(function(err) {
      console.log('error: ', err);
      res.status(400).send(err);
    });
});

app.listen(app.get('port'), function(err) {
  if (err) {
    throw err;
  }
  console.log(`listening on port ${app.get('port')}!`);
});

module.exports = app;
