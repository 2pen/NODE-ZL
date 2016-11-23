var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var webHelper = require('../lib/webHelper');
var config = require('../config')
var async = require('async');
var md = webHelper.Remarkable();
var _ = require('underscore');
var dbHelper = require('../db/dbHelper');

exports.findUsr = function (data,cb) {
    User.findOne({
        username:data.usr
    },function (err,doc) {
        var user = (doc!==null)? doc.toObject() : '';

        if(err){
            console.log(err)
        }else if(doc===null){
            entries.code = 99;
            entries.msg='用户名错误！';
            cb(false,entries);
        }else if(user.password!==data.pwd){
            entries.code = 99;
            entries.msg='密码错误！';
            cb(false,entries);
        }else if(user.password===data.pwd){
            entries.data = user;
            entries.code=0;
            cb(true,entries);
        }

    })
}
exports.registerUsr = function (data,cb) {
    User.findOne({
        username:data.usr
    },function (err,doc) {
        if(doc){
            entries.code = 99;
            entries.msg='账号已经存在！';
            cb(true,entries);
        }else{
            var User1 = new User({
                username     :data.usr,
                password      :data.pwd,

            })
            User1.save(function (err,user) {
                if(err){
                    console.log('保存失败');
                }
                console.log('success');
                entries.data = user;
                entries.code=0;
                cb(true,entries);
            })

        }


    })

}
exports.findUsrById = function (id, cb) {
    console.log(id);
    User.findOne({_id:id}).exec(function (err,doc) {
        //console.log(doc);
        var doc = (doc !== null) ? doc.toObject() : '';
        cb(true,doc);
    })
}

exports.findUsrInfo = function (req, cb) {
    User.findOne({username:req.session.user.username}).populate({path:'friends',select:"username imgUrl"})
        .exec(function (err,doc) {
        var doc = (doc !== null) ? doc.toObject() : '';
            //console.log(doc);
        cb(true,doc);

    })
}


exports.addUser = function (data,cb) {
    var user = new User({
       username : data.usr,
       password:data.pwd,
       email:data.email,
       adr:data.adr
    });
    user.save(function (err,doc) {
        if(err){
            cb(false,err);
        }else {
            cb(true,entries);
        }
    })

};
