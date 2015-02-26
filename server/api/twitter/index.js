'use strict';

var express = require('express');
var Twitter = require('twitter');

var router = express.Router();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

router.get('/user', function(req, res){
  client.get('statuses/user_timeline', req.params, function(error, tweets, response){
    if(error) throw error;
    console.log(tweets);  // The favorites.
    console.log(response.body);  // Raw response object.
    return res.send(response.body);
  });
});

module.exports = router;
