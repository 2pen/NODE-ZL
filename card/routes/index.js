var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');
var fs = require('fs');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('card', {

  });
});

module.exports = router;
