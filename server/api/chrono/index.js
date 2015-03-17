'use strict';

var express = require('express');
var chrono = require('chrono-node');

var router = express.Router();

var myChrono = new chrono.Chrono();


// Parsers and refiners

var yearsParser = new chrono.Parser();
// Provide search pattern

yearsParser.pattern = function () { return /(\b20+[0-9]{2}\b|\b19+[0-9]{2}\b)/i }

// This function will be called when matched pattern is found
yearsParser.extract = function(text, ref, match, opt) {

    console.log(match)
    var result = new chrono.ParsedResult({
        ref: ref,
        text: match[0] + "dummy",
        index: match.index,
        start: {
          year: match[0],
        }
    });
    result.start.imply('month', 1);
    result.start.imply('day', 1);
    result.tags['ENYearsParser'] = true;
    console.log(result)
    return result;
}

  myChrono.parsers.push(yearsParser);

// Requests

router.post('/date', function(req, res){
  var ref;
  if (req.body.ref){
    ref = req.body.ref
  }
  var response = myChrono.parseDate(req.body.text, ref);
  if (response.length <= 0){
    response = chrono.parseDate(req.body.text, ref);
  }
  return res.send(response);
});

router.post('/parse', function(req, res){
  var ref;
  console.log(req.body.ref)
  if (req.body.ref){
    ref = req.body.ref
  }
  var response = myChrono.parse(req.body.text, ref);
  if (response.length <= 0){
    response = chrono.parse(req.body.text, ref)
  }
  if (response.length > 0){
    response[0].start.date = response[0].start.date()
    if (response[0].end){
      response[0].end.date = response[0].end.date()
    }
  }
  return res.send(response)

});

module.exports = router;
