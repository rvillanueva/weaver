'use strict';

var express = require('express');
var http = require('http');

var extractor = require('unfluff');

var router = express.Router();

router.get('/', function(req, res){
  http.get(req.query.url, function(response){
    console.log(response);
    var getData;
    response.on("data", function(chunk) {
      getData += chunk;
    });
    response.on("end", function() {
      var data = extractor(getData, 'en');
      return res.send(data);
    })
  }).on('error', function(e) {
  console.log("Got error: " + e.message);
});

});

module.exports = router;
