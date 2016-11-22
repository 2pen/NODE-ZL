var async = require('async');
var User = require('./schema/user');
var dbHelper = require('../db/dbHelper');
var ioServer = function () {
    var io = global.io;
    var seats = {};
    var array = [0,1,2];
    var users = {};
    var giupCount = 0;
    var poke = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,
        38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];

    io.on("connection",function (socket) {
        socket.emit('connect');                     //建立连接后由服务器发送链接成功的消息
        socket.on("addUser",function (userId) {
            var obj = {};
            users[userId]=socket;

            async.each(array, function (item,callback) {
                if(seats.hasOwnProperty(item)&&seats[item].isSit==1){
                    User.findOne({_id:seats[item].id},function (err,doc) {
                        obj[item]={
                            id:doc._id,
                            imgUrl:doc.imgUrl,
                            index:item
                        }
                        //console.log(item);
                        //console.log(obj);
                        callback();
                    })
                }else{
                    callback();         //一:这里必须增加回调函数,否则无法使each的回调函数触发二:就算findOne里面已经发送过callback函数也不能再
                                        //下面继续发送callback，不然会发生错误，坑！
                }
            },function (err) {
                socket.emit("seatsInfo",obj)
            });

        })
        socket.on("sitSeat",function (obj) {
            dbHelper.findUsrById(obj.id,function (success,doc) {
                var msg = {
                    index:obj.index,
                    imgUrl:doc.imgUrl,
                    name:doc.username,
                    id:obj.id
                }
                if(!seats.hasOwnProperty(obj.index)||!seats[obj.index].isSit){        //没人坐
                    seats[obj.index] = {
                        isSit:1,
                        id:obj.id,
                        imgUrl:doc.imgUrl,
                        isReady:false,
                        array:[],
                        name:doc.username
                    };
                    socket.broadcast.emit("playerSit",msg);
                    socket.emit("playerSit",msg);
                    //只有坐下新位置才能判断是否移除原来的位置
                    for(var i = 0;i<3;++i){
                        //不是index对应的座位并且有人坐
                        if(i!=obj.index){
                            if(seats.hasOwnProperty(i.toString())&&seats[i].isSit){
                                if(seats[i].id==obj.id){
                                    socket.broadcast.emit("leave",i);
                                    socket.emit("leave",i);
                                    seats[i].isSit = 0;

                                }
                            }
                        }
                    }
                }
                var count = 0;
                for(var i = 0;i<3;++i){
                    if(seats.hasOwnProperty(i.toString())&&seats[i].isSit){
                        ++count;
                    }
                }
                //console.log(users);

                if(count==3){
                    var temp = poke.slice(0,poke.length);
                    var turn = Math.floor(Math.random()*3);
                    for(var i = 0;i<2;++i){
                        seats[i].array = [];
                        for(var j = 0;j<18;++j){
                            var index = Math.floor(Math.random()*(temp.length));  //生成0到temp.length-1的数
                            var para = temp[index];
                            seats[i].array.push(para);
                            temp.splice(index,1);
                        }
                    }
                    seats[2].array = [];
                    for(var m = 0;m<temp.length;++m){
                        seats[2].array.push(temp[m]);
                    }
                    for(var i = 0;i<3;++i){
                        users[seats[i].id].emit("gameStart",seats,turn);
                    }

                }
                //console.log(seats);

            })
        })
        socket.on("postCards",function (obj) {
            giupCount = 0;
            console.log(obj);
            if(obj.sendOut){
                for(var i = 0;i<3;++i){
                    seats[i].isReady=false;
                }
            }
            for(var i = 0;i<3;++i){
                    users[seats[i].id].emit("postCards",obj);
            }
        })
        socket.on("readyMsg",function (obj) {
            seats[obj.index].isReady = obj.isReady;
            var count = 0;
            for(var i = 0;i<3;++i){
                if(seats[i].isReady==true){
                    ++count;
                }
            }
            if(count==3){
                var temp = poke.slice(0,poke.length);
                var turn = Math.floor(Math.random()*3);
                for(var i = 0;i<2;++i){
                    seats[i].array = [];
                    for(var j = 0;j<18;++j){
                        var index = Math.floor(Math.random()*(temp.length));  //生成0到temp.length-1的数
                        var para = temp[index];
                        seats[i].array.push(para);
                        temp.splice(index,1);
                    }
                }
                seats[2].array = [];
                for(var m = 0;m<temp.length;++m){
                    seats[2].array.push(temp[m]);
                }
                for(var i = 0;i<3;++i){
                    users[seats[i].id].emit("reStart",seats[i].array,turn);
                }
            }
            console.log(seats);
        })
        socket.on("giveup",function () {
            ++giupCount;
            for(var i = 0;i<3;++i){
                users[seats[i].id].emit("giveup",giupCount);
            }

        })
        socket.on("touxiang",function (index) {
            for(var i = 0;i<3;++i){
                seats[i].isReady=false;
            }
            for(var i = 0;i<3;++i){
                users[seats[i].id].emit("renshu",seats[index]);
            }
        })
    })
}

module.exports = ioServer;
