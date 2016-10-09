


(function($){
    var chatWindow = $(".chatWindow");
    var chatPerson = $(".chatPerson");
    var input = $(".input-content");                    //输入框内容
    var groupinput = $(".group-input-content");         //群聊
    var send = $(".send-message").children("button");                      //发消息按钮
    var groupsend = $(".group-send-message").children("button");            //群发消息
    var GroupChat = $(".GroupChat");
    var socket = io.connect('http://localhost:3000');
    var Frilist = $(".Fri-list");
    var chatperson = {};
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
        var poster = $("#findName").data('name');
        var obj = {
            message:message,
            receiver:receiver,
            poster:poster
        }
        //console.log(obj);
        if(!message)return ;
        socket.send(obj);
        input.val('');
    })
    groupsend.on('click',function () {
        var message = groupinput.val();
        var poster = $("#findName").data('name');
        var obj = {
            message:message,
            poster:poster
        };
        console.log(obj);
        if(!message)return ;
        socket.emit('groupsend',obj);
        groupinput.val('');
    })
    socket.on('groupsend',function (info) {
        if(info.poster!=$("#findName").data('name')){
            var message = '<div class="chat-line"><img src="'+info.imgUrl+'"'+'><div class="chat-lineContent">'+info.message+' </div> </div>';
            content.append(message);
        }else{
            var message = '<div class="chat-line-receiver"><img src="'+info.imgUrl+'"'+'><div class="chat-lineContent">'+info.message+' </div> </div>';
            content.append(message);
        }
    })
    socket.on('receive',function (obj) {
        var imgUrl;
        var name = obj.poster;
        $(".FriList").each(function () {
            if($(this).children("div").text()==obj.poster){
                imgUrl = $(this).children("img").attr("src");

            }
        })
        chatWindow.css("display","flex");
        chatPerson.children("img").attr("src",imgUrl);

        if(!chatperson.hasOwnProperty(obj.poster)){
            var chatContent =$('<div class="chat-content"></div>');
            chatperson[obj.poster]= chatContent;
        }
        var message = '<div class="chat-line"><img src="'+imgUrl+'"'+'><div class="chat-lineContent">'+obj.message+' </div> </div>';
        chatperson[obj.poster].append(message);

        chatWindow.children(".chat-content").remove();
        chatWindow.children(".chat-head").after(chatperson[obj.poster]);


    })
    socket.on('send',function (obj) {
        if(!chatperson.hasOwnProperty(obj.poster)){
            var chatContent =$('<div class="chat-content"></div>');
            chatperson[obj.poster]= chatContent;
        }
        var message = '<div class="chat-line-receiver"><img src="'+$(".userImg").children("img").attr("src")+'"'+'><div class="chat-lineContent">'+obj.message+' </div> </div>';
        chatperson[obj.poster]='<div class="chat-content">'+$(chatperson[obj.poster]).append(message).html()+'</div>';
        chatWindow.children(".chat-content").remove();
        chatWindow.children(".chat-head").after(chatperson[obj.poster]);
    })


})(jQuery);