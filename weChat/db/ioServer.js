var async = require('async');
var User = require('./schema/user');
var chatPerson =require('./schema/chatHistory');
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
            //console.log(username);
        })

        //console.log('CONNECTED');
        socket.join('sessionId');
        socket.emit('open');//通知客户端已连接
        //console.log('open');
        socket.on('message',function (obj) {
            var id1,id2;        //id1为posterid,id2为receivererid
            async.parallel({
                fuck1:function(done){
                    User.findOne({username:obj.poster},function(error,doc){
                        if(!error){
                            if(doc!=null){
                                id1 = doc._id;
                            }
                            done(null,id1);
                        }
                        else{
                            done(error,null);
                        }

                    });
                },
                fuck2:function(done){
                    User.findOne({username:obj.receiver},function(error,doc){
                        if(!error){
                            if(doc!=null){
                                id2 = doc._id;
                            }
                            done(null,id2);
                        }
                        else{
                            done(error,null);
                        }

                    });
                },

            },function(error,result){
                if(!error)
                {
                    chatPerson.findOne({$or: [
                        { personOne: result.fuck1, personTwo: result.fuck2},
                        { personOne: result.fuck2, personTwo: result.fuck1}]}).exec(function (err,doc) {
                        if(doc==null){
                            var shit = new chatPerson({
                                personOne:result.fuck1,
                                personTwo:result.fuck2,
                                personOneNotRead:0,
                                personTwoNotRead:0,
                            })
                            shit.save(function (err) {
                                if(err){
                                    console.log('保存失败');
                                }
                                chatPerson.update({$or: [
                                    { personOne: result.fuck1, personTwo: result.fuck2},
                                    { personOne: result.fuck2, personTwo: result.fuck1}]}, {$addToSet:{'children':
                                {
                                    from:id1,
                                    to:id2,
                                    message:obj.message,
                                    time:Date.now()
                                }},$inc: {"personTwoNotRead": 1}},function (err,doc) {

                                });
                                console.log('success');
                            })
                        }else{
                            chatPerson.update({$or: [
                                { personOne: result.fuck1, personTwo: result.fuck2},
                                { personOne: result.fuck2, personTwo: result.fuck1}]}, {$addToSet:{'children':
                            {
                                from:id1,
                                to:id2,
                                message:obj.message,
                                time:Date.now()
                            }} },function (err,doc) {
                                if(doc.personOne==id2){
                                    chatPerson.update({$or: [
                                        { personOne: result.fuck1, personTwo: result.fuck2},
                                        { personOne: result.fuck2, personTwo: result.fuck1}]},{$inc:{'personOneNotRead':1}},
                                        function (err,doc) {

                                    })
                                }else{
                                    chatPerson.update({$or: [
                                            { personOne: result.fuck1, personTwo: result.fuck2},
                                            { personOne: result.fuck2, personTwo: result.fuck1}]},{$inc:{'personTwoNotRead':1}},
                                        function (err,doc) {

                                        })
                                }

                            });
                        }

                    });
                }
                else{
                    console.log('err');
                }
            });



            if(client.hasOwnProperty(obj.receiver)){
                client[obj.receiver].emit('receive',obj);

            }
            socket.emit('send',obj);

        })
        socket.on('clearNotRead',function (clearData) {
            var id1,id2;
            async.series({
                fuck1:function(done){
                    User.findOne({username:clearData.poster},function(error,doc){
                        if(!error){
                            if(doc!=null){
                                id1 = doc._id;
                            }
                            done(null,id1);
                        }
                        else{
                            done(error,null);
                        }

                    });
                },
                fuck2:function(done){
                    User.findOne({username:clearData.receiver},function(error,doc){
                        if(!error){
                            if(doc!=null){
                                id2 = doc._id;
                            }
                            done(null,id2);
                        }
                        else{
                            done(error,null);
                        }

                    });
                },

            },function(error,result){
                if(!error)
                {
                    chatPerson.findOne({$or: [
                        { personOne: result.fuck1, personTwo: result.fuck2},
                        { personOne: result.fuck2, personTwo: result.fuck1}]},function (err,doc)
                        {
                            if(doc!=null){
                            //console.log(doc);
                            doc=doc.toObject();
                            if(doc.personOne==id1){
                                chatPerson.update({$or: [
                                        { personOne: result.fuck1, personTwo: result.fuck2},
                                        { personOne: result.fuck2, personTwo: result.fuck1}]},{$set:{'personOneNotRead':0}},
                                    function (err,doc) {

                                    })
                            }else{
                                chatPerson.update({$or: [
                                        { personOne: result.fuck1, personTwo: result.fuck2},
                                        { personOne: result.fuck2, personTwo: result.fuck1}]},{$set:{'personTwoNotRead':0}},
                                    function (err,doc) {

                                    })
                            }
                        }


                        }
                    );
                }
                else{
                    console.log('err');
                }
            });
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
                    //console.log(obj);
                    temparray = array;
                    tempmemberinfo = memberinfo;
                    for(var i=0;i<array.length;++i){
                        client[array[i]].emit('groupInit',obj);

                    }
                }
            });
        })
        socket.on('searchFri',function (name) {
            //console.log(name);
            User.findOne({username:name},function (err,doc) {
                //console.log(doc);
                socket.emit('searchFri',doc);

            })
        })
        socket.on('becomeFri',function (msg) {
            //console.log(msg);
            User.update({'_id':msg.inviter}, {$addToSet:{'friends':msg.receiver} },function (err,doc) {

            });
            User.update({'_id':msg.receiver}, {$addToSet:{'friends':msg.inviter} },function (err,doc) {
            }  );
        })
        socket.on('groupsend',function (obj) {
            //console.log(obj);
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
            //console.log(name+"disconnected!");
        })
    });
}

module.exports = ioServer;
