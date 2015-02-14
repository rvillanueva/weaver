'use strict';

var express = require('express'),
  app = express(),
  bluemix = require('./config/bluemix'),
  ConceptInsights = require('./concept-insights'),
  extend = require('util')._extend;

// Bootstrap application settings
require('./config/express')(app);
var router = express.Router();


// if bluemix credentials exists, then override local
var credentials = extend({
  url: process.env.CONCEPTINSIGHTS_URL,
  username: process.env.CONCEPTINSIGHTS_USER,
  password: process.env.CONCEPTINSIGHTS_SECRET
}, bluemix.getServiceCreds('concept_insights')); // VCAP_SERVICES

// Create the service wrapper
var conceptInsights = new ConceptInsights(credentials);

router.get('/', function (req, res) {
  return res.send('Hooray!')
});

router.get('/label_search', function (req, res) {
  conceptInsights.label_search(req.query, function(error, result) {
    if (error)
      return res.status(error.error.code || 500).json(error);
    else
      return res.json(result);
  });
});

router.get('/semantic_search', function (req, res) {
  conceptInsights.semantic_search(req.query, function(error, result) {
    if (error)
      return res.status(error.error.code || 500).json(error);
    else
      return res.json(result);
  });
});

module.exports = router;
