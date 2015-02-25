'use strict';

var express = require('express');
var chrono = require('chrono-node');


var router = express.Router();

router.post('/date', function(req, res){
  var ref;
  if (req.body.ref){
    ref = req.body.ref
  }
  var response = chrono.parseDate(req.body.text, ref);
  console.log(req)
  return res.send(response);
});

router.post('/parse', function(req, res){
  var ref;
  if (req.body.ref){
    ref = req.body.ref
  }
  var response = chrono.parse(req.body.text, ref);
  if (response.length > 0){
    response[0].start.date = response[0].start.date()
    if (response[0].end){
      response[0].end.date = response[0].end.date()
    }
  }
  return res.send(response);
});

module.exports = router;
