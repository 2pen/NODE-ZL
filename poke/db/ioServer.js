var async = require('async');
var User = require('./schema/user');
var dbHelper = require('../db/dbHelper');
var ioServer = function () {
    var io = global.io;
    io.on("connection",function (socket) {
        socket.emit('connect');                     //建立连接后由服务器发送链接成功的消息
        socket.on("addUser",function (userId) {
            console.log(userId+"建立连接");
        })
        socket.on("sitSeat",function (obj) {
            
        })
    })
}

module.exports = ioServer;
