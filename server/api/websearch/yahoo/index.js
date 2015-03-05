'use strict';

var express = require('express');
var request = require('request');
var qs = require('querystring');

var router = express.Router();

var url = 'https://yboss.yahooapis.com/ysearch/news';

router.get('/news', function(req, res){
  var params = qs.stringify({
    q: req.query.q,
    format: 'json',
    count: 7,
  });

  var oauth = {
    consumer_key: process.env.YAHOO_CONSUMER_KEY,
    consumer_secret: process.env.YAHOO_CONSUMER_SECRET
  };

  request.get({ url: url + '?' + params, oauth: oauth, json: true }, function(e, r, body) {
    res.send(body.bossresponse.news.results)
  }).on('error', function(e) {
  console.log("Got error: " + e.message);
  });

});

module.exports = router;
