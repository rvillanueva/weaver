/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  bluemix = require('../../../config/bluemix'),
  watson = require('watson-developer-cloud'),
  extend = require('util')._extend,
  fs = require('fs');

console.log('stt initialized')

// if bluemix credentials exists, then override local
var credentials = extend({
  version:'v1',
	username: process.env.STT_USER,
	password: process.env.STT_SECRET
}, bluemix.getServiceCreds('speech_to_text')); // VCAP_SERVICES

// Create the service wrapper
var speechToText = watson.speech_to_text(credentials);
console.log(speechToText)

// Configure express
require('../../../config/express')(app, speechToText);

var router = express.Router();


router.post('/', function(req, res) {
  var audio;

  if(req.body.url && req.body.url.indexOf('assets/') === 0) {
    // sample audio
    audio = fs.createReadStream(__dirname +'/sample1.wav');
  } else {
    // malformed url
    return res.status(500).json({ error: 'Malformed URL' });
  }

  speechToText.recognize({audio: audio, content_type: 'audio/l16; rate=44100'}, function(err, transcript){
    if (err)
      return res.status(500).json({ error: err });
    else
    console.log('recognize success')
    console.log(transcript)

      return res.json(transcript);
  });
});


module.exports = router;
