var express = require('express');
var async = require('async');

var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');
var fs = require('fs');
var request = require('request');
var Users = require('../db/schema/user');
var Subjects = require('../db/schema/subjects');
var Answers = require('../db/schema/answers');
/*
var conditions = {};
var update={$set:{questions:[{index:0,question:"读入一个自然数n，计算其各位数字之和，用汉语拼音写出和的每一位数字。"}
  ,{index:1,question:"读入n名学生的姓名、学号、成绩，分别输出成绩最高和成绩最低学生的姓名和学号。"},
  {index:2,question:"设计函数求一元多项式的导数。（注：xn（n为整数）的一阶导数为n*xn-1。）"},
  {index:3,question:"月饼是中国人在中秋佳节时吃的一种传统食品，不同地区有许多不同风味的月饼。现给定所有种类月饼的库存量、总售价、以及市场的最大需求量，请你计算可以获得的最大收益是多少。"},
  {index:4,question:"为了用事实说明挖掘机技术到底哪家强，PAT组织了一场挖掘机技能大赛。现请你根据比赛结果统计出技术最强的那个学校。"}]}};
//第一个参数conditions是选择条件，第二个参数update是选择后该如何更改的参数,第三个是回调函数
Subjects.update(conditions,update,{multi:true},function (error,data) {
  if(error){
    console.log(error);
  }else{
    console.log(data);
  }
})
*/
/*
var conditions = {'questions.index':4};
var update={$set:{'questions.$.score':0}};
Answers.update(conditions,update,{multi:true},function (error,data) {
  if(error){
    console.log(error);
  }else{
    console.log(data);
  }
})
*/
/*
var array = [20,25,15,10,30];
var index = -1;
async.eachSeries(array, function (item,callback) {
  ++index;
  var conditions = {'questions.index':index};
  var update={$set:{'questions.$.score':item}};
  Subjects.update(conditions,update,{multi:true},function (error,data) {
    if(error){
      console.log(error);
    }else{
      console.log(data);
    }
    callback();
    console.log(index);
  })
},function (err) {

});
*/
/* GET home page. */
/*
var User1 = new Users({
  userId:"123",
  username:"李大师",
  password:"a",
  status:"offline",
  identity:"teacher"
})
User1.save(function (err) {
  if(err){
    console.log("保存失败");
  }
  else{
    console.log("success");
  }
})
*/
/*
var Subject1 = new Subjects({
  course:"JAVA",
  startTime:new Date("2016-11-30 22:00:00"),
  lastTime:120,
  numOfQuestions:5
});
Subject1.save(function (err) {
  if(err){
    console.log("保存失败");
  }
  else{
    console.log("success");
  }
})
*/
/*
Users.find({},function (err,doc) {
  async.each(doc, function (item,callback) {
    var answers = new Answers({
      user:item._id,
      subject:"583eac4ee4b7c7c422e32399",
      questions:[{index:0,content:""},{index:1,content:""},{index:2,content:""},{index:3,content:""},{index:4,content:""}]
    })
    answers.save(function (err) {
      if(err){
        console.log("保存失败");
      }
      else{
        console.log("success");
      }
      callback
    })
  },function (err) {

  });
})
*/
router.get('/student', function(req, res, next) {
  dbHelper.findUsrInfo(req, function (success, data) {
    //console.log(data.friends);
    //data.identify身份,data.subject考试题目,data.answer考试答案
    res.render('student', {
      scriptData:JSON.stringify(data)
    });
  })
});
router.get('/teacher', function(req, res, next) {
  dbHelper.findStudentsInfo(req, function (success, data) {
    //console.log(data.friends);
    //data.students学生信息,data.subject课程信息
    res.render('teacher', {
      students:data.students,
      scriptData:JSON.stringify(data)
    });
  })
});

module.exports = router;
