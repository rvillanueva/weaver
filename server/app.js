/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bluemix = require('./config/bluemix');
var watson = require('watson-developer-cloud');
var extend = require('util')._extend;



// if bluemix credentials exists, then override local
var credentials = extend({
  version:'v1',
	username: process.ENV.STT_USER,
	password: process.ENV.STT_SECRET
}, bluemix.getServiceCreds('speech_to_text')); // VCAP_SERVICES

// Create the service wrapper
var speechToText = watson.speech_to_text(credentials);

require('./config/socket')(io, speechToText);
require('./config/express')(app, speechToText);
require('./routes')(app);


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

io.sockets.on('connection', function(socket){
  socket.emit('news', {hello: 'world'})
})

// Expose app
exports = module.exports = app;
