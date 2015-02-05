'use strict';

var express = require('express');
var controller = require('./watson.controller');

var router = express.Router();

router.get('/watson', controller.index);

module.exports = router;
