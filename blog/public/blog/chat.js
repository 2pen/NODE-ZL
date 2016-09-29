
(function($){
    var content = $(".chat-content");                   //聊天框内容
    var input = $(".input-content");                    //输入框内容
    var send = $(".send-message");                      //发消息按钮

    var socket = io.connect('http://localhost:3000');

    socket.on("open",function () {
        console.log("与服务器建立连接");
        socket.emit("addUser",$.cookie('username'));
        console.log($.cookie('username'));
    })
    
    send.on('click',function () {
        var message = input.val();
        var receiver = $(".selectFri").text();
        var obj = {
            message:message,
            receiver:receiver
        }
        if(!message)return ;
        socket.send(obj);
        input.val('');
    })
    socket.on('receive',function (msg) {
            var message = '<div class="chat-line"><img src="/images/zengruiru.jpg"><div class="chat-lineContent">'+msg+' </div> </div>';
            content.append(message);

    })
    socket.on('send',function (msg) {
        var message = '<div class="chat-line-receiver"><img src="/images/icon.jpg"><div class="chat-lineContent">'+msg+' </div> </div>';
        content.append(message);

    })


})(jQuery);