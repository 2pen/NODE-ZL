var async = require('async');
var User = require('./schema/user');
var Answers = require('./schema/answers')
var dbHelper = require('../db/dbHelper');
var ioServer = function () {
    var io = global.io;
    var teacher;
    var students = {};
    io.on("connection",function (socket) {
        socket.emit('connect');                     //建立连接后由服务器发送链接成功的消息
        socket.on("addUser", function (obj) {
            if(obj.indentify=="student"){
                students[obj.userId] = socket;
                User.update({userId:obj.userId},{status:"landing"}).exec(function (err,doc) {
                    console.log("反正不可能出错");
                })
            }else{
                teacher = socket;
            }
        })
        socket.on("submitAnswer",function (result) {
            User.findOne({userId:result.userId}).exec(function (err,doc) {
                Answers.findOne({user:doc._id}).exec(function (err,answer) {
                    answer.questions[result.number].content = result.content;
                    answer.save(function (err) {
                        console.log("反正不可能出错");
                    })
                })
            })
        })
        socket.on("submitScore",function (result) {
            User.findOne({userId:result.studentId}).exec(function (err,doc) {
                Answers.findOne({user:doc._id}).exec(function (err,answer) {
                    answer.questions[result.questionIndex].score = result.score;
                    answer.save(function (err) {
                        console.log("反正不可能出错");
                    })
                })
            })
        })
        socket.on("disconnect", function(){
            for(var key in students){
                if(students[key] === socket){
                    console.log("学号为"+key+"的同学离线了");
                    User.update({userId:key},{status:"offline"}).exec(function (err,doc) {
                        console.log("反正不可能出错");
                    })
                }

            }
        })
    })
}

module.exports = ioServer;
