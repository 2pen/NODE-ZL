var ioServer = function () {
    var io = global.io;
    var client = {};
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

            client[obj.receiver].emit('receive',obj.message);
            socket.emit('send',obj.message);
        })
        socket.on('disconnect',function () {
            console.log(name+"disconnected!");
        })
    });
}

module.exports = ioServer;
