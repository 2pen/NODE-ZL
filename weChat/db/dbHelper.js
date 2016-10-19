var entries = require('./jsonRes');
var mongoose = require('./db.js');
var User = require('./schema/user');
var chatPerson = require('./schema/chatHistory');
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
exports.findUsrInfo = function (req, cb) {
    User.findOne({username:req.session.user.username}).populate({path:'friends',select:"username imgUrl"})
        .exec(function (err,doc) {
        var doc = (doc !== null) ? doc.toObject() : '';
            //console.log(doc);
        if(err){
            cb(true,err);
        }else {
            //console.log(doc);
            var index = 0;              //friends下标
            async.eachSeries(doc.friends, function (item,callback) {
                async.waterfall([


                    function (done) {
                        chatPerson.findOne({ $or: [{ personOne: doc._id, personTwo: item._id},  { personOne: item._id, personTwo: doc._id}] },
                            function (err,history) {
                                done(null, history);
                            })
                    },
                    function (history, done) {
                        if(history!=null){
                            var opts = [
                                {path:'personOne',select:'username'},
                                {path:'personTwo',select:'username'},
                                {path:'children.from',select:'username'},
                                {path:'children.to',select:'username'}
                            ];
                            history.populate(opts, function(err, fuckyoubitch) {
                                //console.log(fuckyoubitch);
                                if(fuckyoubitch!=null){
                                    doc.friends[index].chatHistory=fuckyoubitch;
                                    //console.log("dbhelper"+index);
                                    //console.log("dbhelper"+fuckyoubitch);
                                }
                                ++index;
                                done(null, '');
                            });
                        }else{
                            console.log("dbhelper"+index);
                            ++index;
                            done(null, '');
                        }


                    },

                ], function (error, result) {
                    callback();
                })


            },function (err) {
                if(err){

                }else{
                    //console.log(doc);
                    cb(true,doc);
                }
            });

        }

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
