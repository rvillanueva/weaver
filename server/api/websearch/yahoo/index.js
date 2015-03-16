'use strict';

var express = require('express');
var request = require('request');
var qs = require('querystring');

var router = express.Router();

var url = 'https://yboss.yahooapis.com/ysearch/news';

router.get('/news', function(req, res){
  var rawParams = {
    q: req.query.q,
    format: 'json',
    count: req.query.count,
  };

  if(req.query.market){
    console.log('market')
    rawParams.market = req.query.market;
  }

  var params = qs.stringify(rawParams);


  var oauth = {
    consumer_key: process.env.YAHOO_CONSUMER_KEY,
    consumer_secret: process.env.YAHOO_CONSUMER_SECRET
  };

  request.get({ url: url + '?' + params, oauth: oauth, json: true }, function(e, r, body) {
    console.log(body)
    if (body.bossresponse.responsecode == '200'){
      var results = body.bossresponse.news.results;
      res.send(results);
    } else {
      res.send('error');
    }
  }).on('error', function(e) {
  console.log("Got error: " + e.message);
  });

});

module.exports = router;
