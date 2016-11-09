var async = require('async');
var User = require('./schema/user');
var dbHelper = require('../db/dbHelper');
var ioServer = function () {
    var io = global.io;
    var seats = new Array();
    io.on("connection",function (socket) {
        socket.emit('connect');                     //建立连接后由服务器发送链接成功的消息
        socket.on("addUser",function (userId) {
            console.log(userId+"建立连接");
        })
        socket.on("sitSeat",function (obj) {
            dbHelper.findUsrById(obj.id,function (success,doc) {
                var msg = {
                    index:obj.index,
                    imgUrl:doc.imgUrl,
                    name:doc.username,
                    id:obj.id
                }
                console.log(msg);
                socket.broadcast.emit("playerSit",msg);
                socket.emit("playerSit",msg);
            })
        })
    })
}

module.exports = ioServer;
