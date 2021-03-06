/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/watson/relationships', require('./api/watson/relationships'));
  app.use('/api/chrono', require('./api/chrono'));
  app.use('/api/unfluff', require('./api/unfluff'));
  app.use('/api/twitter', require('./api/twitter'));
  app.use('/api/webhose', require('./api/websearch/webhose'));
  app.use('/api/yahoo', require('./api/websearch/yahoo'));
  app.use('/api/watson/tts', require('./api/watson/tts'));
  app.use('/api/watson/translate', require('./api/watson/translate'));





  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
