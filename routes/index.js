var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/test");
/*  var Schema = mongoose.Schema;  用Schema代替mongoose.Schema*/

//存储数据
var PersonInfo = new mongoose.Schema({
    age       : Number,
    id        : String,
    phone     : String,
    colloge  : String,
    hometown  :String
});

var Person = mongoose.model('Person',PersonInfo);

var person = new Person({
    age     :'20',
    id      :'3326241995123456',
    phone   :'13819630116',
    colloge :'hznu',
    hometown :'xianju'
})

person.save(function (err) {
    if(err){
        console.log('保存失败');
    }
    console.log('success');
})

//增加数据

var person1 = new Person({
    age     :'15',
    id      :'3326242000123456',
    phone   :'1776542365',
    colloge :'no',
    hometown :'xianju'
})
person1.save(function (err) {
    if(err){
        console.log('保存失败');
    }
    console.log('success');
})

//修改数据
var conditions = {age:20};
var update={$set:{hometown:'taizhou'}};
Person.update(conditions,update,function (error,data) {
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
})

//删除数据
Person.remove({age:20},function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('删除成功');
    }
})

//查询数据
Person.find({"age":{"$lt":19}},function (error,docs) {
    if(error){
        console.log(error);
    }else{
        console.log(docs);
    }
})


/* GET home page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express', layout: 'main' });
});




module.exports = router;
