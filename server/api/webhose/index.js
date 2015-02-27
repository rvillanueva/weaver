'use strict';

var express = require('express');
var https = require('https');
var querystring = require('querystring');

var router = express.Router();

router.get('/', function(req, res){
  var query = req.query;
  query.token = process.env.WEBHOSE_TOKEN;
  var qString = querystring.stringify(query);
  var request = 'https://webhose.io/search?' + qString;
  console.log(request)

  https.get(request, function(response){
    var getData = "";
    response.on("data", function(chunk) {
      getData += chunk;
    });
    response.on("end", function() {
      return res.send(getData);
    })
  }).on('error', function(e) {
  console.log("Got error: " + e.message);
});

});

module.exports = router;
