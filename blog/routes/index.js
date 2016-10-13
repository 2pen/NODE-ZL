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
/*
var conditions = {username:'Wallace'};
var update={$set:{friends:['57f239247faafd78268ea64e','57e893eed17833211e02b0d5']}};
//第一个参数conditions是选择条件，第二个参数update是选择后该如何更改的参数,第三个是回调函数
Users.update(conditions,update,function (error,data) {
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
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
            searchParams:data.searchParams,
            user:data.user,
        });
    })
});

router.get('/personInfo', function(req, res, next) {

        res.render('personInfo', {
            layout: 'mainWithoutHeader'
        });
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
