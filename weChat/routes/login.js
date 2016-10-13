var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var fs = require('fs');
var config = require('../config');
var Users = require('../db/schema/user');
/*
 var User1 = new Users({
 username     :'Wallace',
 password      :'a',
 email   :'haha',
 address :'nimabi',
 imgUrl :'/images/Wallace.jpg'
 })
 User1.save(function (err) {
 if(err){
 console.log('保存失败');
 }
 console.log('success');
 })
 */
router.get('/', function(req, res, next) {
  req.session.user = '';
  res.render('login', { layout: 'lg' });

});

router.post('/', function(req, res, next) {
  dbHelper.findUsr(req.body, function (success, doc) {
    //console.log(doc);
    req.session.user = doc.data;
    res.send(doc);
  })
});
router.post('/register', function(req, res, next) {
  dbHelper.registerUsr(req.body, function (success, doc) {
    console.log(doc);
    req.session.user = doc.data;
    res.send(doc);
  })
});



module.exports = router;
