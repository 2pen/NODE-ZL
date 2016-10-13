var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
/* GET home page. */
router.get('/', function(req, res, next) {
  dbHelper.findUsrInfo(req, function (success, data) {
    //console.log(data.friends);
    res.render('chat', {
      user:data,
      scriptData:JSON.stringify(data)
    });
  })

});

module.exports = router;
