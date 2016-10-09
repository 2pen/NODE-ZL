var async = require('async');
var User = require('./schema/user');
var ioServer = function () {
    var io = global.io;
    var client = {};
    var temparray;
    var tempmemberinfo;
    io.on('connection', function (socket) {
        var name;
        socket.on("addUser",function (username) {
            client[username] = socket;
            name = username;
            console.log(username);
        })

        console.log('CONNECTED');
        socket.join('sessionId');
        socket.emit('open');//通知客户端已连接
        socket.on('message',function (obj) {
            if(client.hasOwnProperty(obj.receiver)){
                client[obj.receiver].emit('receive',obj);
                socket.emit('send',obj);
            }

        })
        socket.on('createGroup',function (array) {
            var memberinfo ={};
            
            async.forEach(array, function (item,callback) {
                    User.findOne({username:item},function (err,doc) {
                        memberinfo[item] = doc.imgUrl;
                        callback();

                    })

            },function (err) {
                if(err){
                    console.log(err);
                }else{
                    var obj = {
                        array:array,
                        memberinfo:memberinfo
                    }
                    console.log(obj);
                    temparray = array;
                    tempmemberinfo = memberinfo;
                    for(var i=0;i<array.length;++i){
                        client[array[i]].emit('groupInit',obj);

                    }
                }
            });
        })
        socket.on('groupsend',function (obj) {
            console.log(obj);
            var info = {
                message:obj.message,
                poster:obj.poster,
                imgUrl:tempmemberinfo[obj.poster]
            }
            for(var i=0;i<temparray.length;++i){
                client[temparray[i]].emit('groupsend',info);
            }
        })
        socket.on('disconnect',function () {
            console.log(name+"disconnected!");
        })
    });
}

module.exports = ioServer;
