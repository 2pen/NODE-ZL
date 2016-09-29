var ioServer = function () {
    var io = global.io;
    var client = {};
    io.on('connection', function (socket) {

        socket.on("addUser",function (username) {
            client[username] = socket;
            console.log(username);
        })

        console.log('CONNECTED');
        socket.join('sessionId');
        socket.emit('open');//通知客户端已连接
        socket.on('message',function (obj) {

            client[obj.receiver].emit('receive',obj.message);
            socket.emit('send',obj.message);
        })
    });
}

module.exports = ioServer;
