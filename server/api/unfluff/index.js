'use strict';

var express = require('express');
var http = require('http');

var extractor = require('unfluff');

var router = express.Router();

router.get('/', function(req, res){
  var urls = req.query.url
  console.log('url')
  console.log(urls)
  var send = []
  var array;
  var complete = false;
  var unfluff = function(url){
    http.get(url, function(response){
      var getData;
      response.on("data", function(chunk) {
        getData += chunk;
      });
      response.on("end", function() {
        if (getData){
          var data = extractor(getData, 'en');
          console.log(data);
          send.push(data);
        } else {
          send.push(null)
        }
        console.log(send.length)
        if (send.length == urls.length && array){
          complete = true;
        } else if (!array){
          return res.send(data);
        }
        if (complete && array){
          return res.send(send);
        }
      })
    }).on('error', function(e) {
    console.log("Got error: " + e.message);
    });
  }
  if (urls instanceof Array){
    console.log('array')
    array = true;
    for (var i = 0; i < urls.length; i++){
      unfluff(urls[i]);
    }
  } else {
    array = false;
    unfluff(urls);
  }

});

module.exports = router;
