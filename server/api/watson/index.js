'use strict';

var express = require('express');
var controller = require('./watson.controller');
var https = require('https');
var url = require('url');
var querystring = require('querystring');
var xmlescape = require('xml-escape');
var parseString = require('xml2js').parseString;

var router = express.Router();


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// defaults for dev outside bluemix
var service_url = process.env.RELATIONSHIP_URL;
var service_username = process.env.RELATIONSHIP_USER;
var service_password = process.env.RELATIONSHIP_SECRET;

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
  console.log('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'relationship_extraction';

  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    console.log('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }

} else {
  console.log('No VCAP_SERVICES found in ENV, using defaults for local development');
}

console.log('service_url = ' + service_url);
console.log('service_username = ' + service_username);
console.log('service_password = ' + new Array(service_password.length).join("X"));

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

// Handle the form POST containing the text to identify with Watson and reply with the language
router.post('/', function(req, res) {
    var parts = url.parse(service_url);

    // create the request options from our form to POST to Watson
    var options = {
      host: parts.hostname,
      port: parts.port,
      path: parts.pathname,
      method: 'POST',
      headers: {
        'Content-Type'  :'application/x-www-form-urlencoded',
        'X-synctimeout' : '30',
        'Authorization' :  auth }
    };

    // Create a request to POST to Watson
    var watson_req = https.request(options, function(result) {
      result.setEncoding('utf-8');
      var resp_string = '';

      result.on("data", function(chunk) {
        resp_string += chunk;
      });

      result.on('end', function() {
        var resp_json = '';
        parseString(resp_string, function (err, result) {
            resp_json = result
        });
        return res.send(resp_json)
      })

    });

    watson_req.on('error', function(e) {
      return res.send({'error':e.message})
    });

    // Whire the form data to the service
    watson_req.write(querystring.stringify(req.body));
    watson_req.end();

});

module.exports = router;
