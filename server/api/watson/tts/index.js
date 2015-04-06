'use strict';

var express = require('express'),
  app = express(),
  bluemix = require('../../../config/bluemix'),
  TextToSpeech = require('./text-to-speech'),
  extend = require('util')._extend,
  fs = require('fs');

// Bootstrap application settings
require('../../../config/express')(app);

var router = express.Router();

// if bluemix credentials exists, then override local
var credentials = extend({
  url: process.env.TTS_URL,
  username: process.env.TTS_USER,
  password: process.env.TTS_SECRET
}, bluemix.getServiceCreds('text_to_speech')); // VCAP_SERVICES

// Create the service wrapper
var textToSpeech = new TextToSpeech(credentials);

router.get('/synthesize', function(req, res) {
  console.log('activated')
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', function(response) {
    console.log(response.headers);
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.pipe(res);
});

module.exports = router;
