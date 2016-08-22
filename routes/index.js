var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var config = require('../config');

var Users = require('../db/schema/user');
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
/*
var User1 = new Users({
    username     :'tom',
    password      :'a',
    email   :'haha',
    address :'nimabi',
    imgUrl :'/images/icon.jpg'
})
User1.save(function (err) {
    if(err){
        console.log('保存失败');
    }
    console.log('success');
})
 */



router.get('/moocs', function(req, res, next) {
    dbHelper.findMooc(req, function (success, data) {

        res.render('./moocs', {
            entries: data.results,
            pageCount: data.pageCount,
            pageNumber: data.pageNumber,
            count: data.count,
            layout: 'main'
        });
    })
});

router.get('/mooc/:id', function(req, res, next) {

    var id = req.params.id;
    dbHelper.findMoocOne( id,  function (success, doc) {
        res.render('./mooc', { entries: doc, layout: 'main' });
    })
});


router.get('/', function(req, res, next) {
    dbHelper.findNews(req, function (success, data) {
        res.render('blog', {
            entries: data.results,
            pageCount: data.pageCount,
            pageNumber: data.pageNumber,
            count: data.count,
        });
    })
});


router.post('/addComment', function(req, res, next) {

    dbHelper.addComment( req.body, function (err, doc) {
        if(err) {
            return next(err);
        }else{
            res.send(doc);
        }
    })
});

module.exports = router;
