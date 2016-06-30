var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var config = require('../config');

var News = require('../db/schema/news');
/*
var news = new News({
    title:"张乐",
    content:"我只是测试一下图片能不能被正确导入，最后祝您身体健康，再见！",
    
}) ;
news.save(function (err) {
    if(err){
        console.log('干你妈的失败了');
    }else {
        console.log('success');
    }
})
*/

router.get('/login',function (req,res,next) {
   res.render('login',{layout:'lg'}); 
});

/* GET home page. */

router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        res.send(doc);
    })
});


router.get('/blog', function(req, res, next) {
    dbHelper.findNews(req, function (success, data) {
        res.render('blog', {
            entries: data.results,
            pageCount: data.pageCount,
            pageNumber: data.pageNumber,
            count: data.count,
        });
    })
});


module.exports = router;
