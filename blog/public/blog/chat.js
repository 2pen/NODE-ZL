


(function($){
    var content = $(".chat-content");                   //聊天框内容
    var input = $(".input-content");                    //输入框内容
    var send = $(".send-message");                      //发消息按钮
    var GroupChat = $(".GroupChat");
    var socket = io.connect('http://localhost:3000');
    var Frilist = $(".Fri-list");
    socket.on("open",function () {
        console.log("与服务器建立连接");
        socket.emit("addUser",$("#findName").data('name'));
    })
    GroupChat.on('click',function () {
        var array = new Array();
        $("input[id^='choose-Fri']").each(function () {
            if($(this).is(':checked')) {
                array.push($(this).parent().siblings('.FriList').children().eq(0).text());

            }

        })
        array.push($("#findName").data("name"));
        console.log(array);
        socket.emit("createGroup",array);
    })
    socket.on('groupInit',function (obj) {
        $(".groupTalk").css("display","flex");
        var Fri = ' <div class="singleFri"><img src="'+$(".userImg").children("img").attr("src")+'"><span>'+$("#findName").data("name")+'</span></div>';
        Frilist.append(Fri);
        for(var i=0;i<obj.array.length;++i){
            if(obj.array[i]!=$("#findName").data("name")){
                var Fri = ' <div class="singleFri"><img src="'+obj.memberinfo[obj.array[i]]+'"><span>'+obj.array[i]+'</span></div>';
                Frilist.append(Fri);
            }
        }
    })
    send.on('click',function () {
        var message = input.val();
        var receiver = $(".selectFri").children("div").text();
        console.log(receiver);
        var obj = {
            message:message,
            receiver:receiver
        }
        if(!message)return ;
        socket.send(obj);
        input.val('');
    })
    socket.on('receive',function (msg) {
            var message = '<div class="chat-line"><img src="'+$(".chatPerson").children("img").attr("src")+'"'+'><div class="chat-lineContent">'+msg+' </div> </div>';
            content.append(message);

    })
    socket.on('send',function (msg) {
        var message = '<div class="chat-line-receiver"><img src="'+$(".userImg").children("img").attr("src")+'"'+'><div class="chat-lineContent">'+msg+' </div> </div>';
        content.append(message);

    })


})(jQuery);