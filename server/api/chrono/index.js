'use strict';

var express = require('express');
var chrono = require('chrono-node');


var router = express.Router();

router.post('/date', function(req, res){
  if (req.body.ref){
    var ref = req.body.ref
  }
  var response = chrono.parseDate(req.body.text, ref);
  return res.send(response);
});

router.post('/parse', function(req, res){
  if (req.body.ref){
    var ref = req.body.ref
  }
  var response = chrono.parse(req.body.text, ref);
  return res.send(response);
});

module.exports = router;
