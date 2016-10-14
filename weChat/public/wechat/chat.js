


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
    var startSearch = $("#startSearch");
    var chatperson = {};
    socket.on("open",function () {
        console.log($("#findName").text()+"与服务器建立连接");
        socket.emit("addUser",$("#findName").text());
    })
    startSearch.on('click',function () {
        if($("#searchAddFri").val()!=''){
            socket.emit('searchFri',$("#searchAddFri").val());
        }
    })
    $("body").on('click','.FriendInfo',function(e){
        var obj = {
            poster:$("#findName").text(),
            receiver:$(this).children("span").text()
        }
        socket.emit('clearNotRead',obj);
        $(this).children("div").hide();
        $(this).children("div").children("button").text('0');
        $(".FriendInfo").removeClass('onChat');
        $(this).addClass('onChat');
        $("#selfInfo").children("span").text($(".onChat").children("span").text());

        chatWindow.children(".chat-content").remove();
        chatWindow.children(".detailedInfo").after(chatperson[$(".onChat").children("span").text()]);

        if(!chatperson.hasOwnProperty($(".onChat").children("span").text())){
            //console.dir(window.scriptData.friends[1].chatHistory);
            createChatcontent($(".onChat"));

        }
        chatWindow.children(".chat-content").remove();
        chatWindow.children(".tool_bar").before(chatperson[$(".onChat").children("span").text()]);

    })
    function createChatcontent(obj) {
        var chatContent =$('<div class="chat-content"></div>');
        chatperson[obj.children("span").text()]= chatContent;
        for(var i = 0;i< window.scriptData.friends.length;++i){
            if(!window.scriptData.friends[i].chatHistory){
                console.log("fuck");
                continue;
            }
            if((window.scriptData.friends[i].chatHistory.personOne.username==obj.children("span").text()
                &&window.scriptData.friends[i].chatHistory.personTwo.username==$("#findName").text())||
                (window.scriptData.friends[i].chatHistory.personOne.username==$("#findName").text()
                &&window.scriptData.friends[i].chatHistory.personTwo.username==obj.children("span").text())){
                var chatContent =$('<div class="chat-content"></div>');
                chatperson[obj.children("span").text()]= chatContent;

                for(var j=0;j<window.scriptData.friends[i].chatHistory.children.length;++j){
                    if(window.scriptData.friends[i].chatHistory.children[j].from.username==obj.children("span").text()){
                        var imgUrl = obj.children("img").attr("src");
                        var message = '<div class="chat-line"><img src="'+imgUrl+'"'+'><div class="chat-lineContent">'+window.scriptData.friends[i].chatHistory.children[j].message+' </div> </div>';
                        chatperson[obj.children("span").text()]='<div class="chat-content">'+$(chatperson[obj.children("span").text()]).append(message).html()+'</div>';
                    }else{
                        var message = '<div class="chat-line-receiver"><img src="'+$("#getimg").children("img").attr("src")+'"'+'><div class="chat-lineContent">'+window.scriptData.friends[i].chatHistory.children[j].message+' </div> </div>';
                        chatperson[obj.children("span").text()]='<div class="chat-content">'+$(chatperson[obj.children("span").text()]).append(message).html()+'</div>';
                    }
                }
                console.log(chatperson[obj.children("span").text()]);
            }
        }

    }
    $("body").on('click','.mkFri',function(e){

        var msg = {
            inviter: $("#findName").data('id'),       //成为好友的邀请人
            receiver: $(this).parent().data('id')        //成为好友的接收人
        }
        console.log(msg);

        socket.emit('becomeFri',msg);
    });
    $(".mkFri").on('click',function () {                //这样无法对动态添加的元素进行监听

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
    socket.on('searchFri',function (user) {
        var FriInfo = '<div class="addFriInfo" data-id="'+user._id+'">'+
            '<img src="'+user.imgUrl+'">'+
            '<span>'+user.username+'</span>'+
            '<button class="mkFri button button-primary button-box button-small"><i class="fa fa-plus"></i></button>'+
            '</div>';
        $(".FriInfoList").empty().append(FriInfo);
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
        var receiver = $(".onChat").children("span").text();
        var poster = $("#findName").text();
        var obj = {
            message:message,
            receiver:receiver,
            poster:poster
        }
        console.log(obj);
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
        var objection;
        $(".FriendInfo").each(function () {
            if($(this).children("span").text()==obj.poster){
                objection=$(this);
                imgUrl = $(this).children("img").attr("src");
                if(!$(this).hasClass('onChat')){
                    $(this).children("div").show();
                    $(this).children("div").children("button").text(parseInt($(this).children("div").children("button").text())+1);
                }else{
                    var clearData = {
                        poster:$("#findName").text(),
                        receiver:$(".onChat").children("span").text()
                    }
                    socket.emit('clearNotRead',clearData);
                }
                console.log(imgUrl);
            }
        })

        if(!chatperson.hasOwnProperty(obj.poster)){
            createChatcontent(objection);
        }
        var message = '<div class="chat-line"><img src="'+imgUrl+'"'+'><div class="chat-lineContent">'+obj.message+' </div> </div>';
        chatperson[obj.poster]='<div class="chat-content">'+$(chatperson[obj.poster]).append(message).html()+'</div>';

        if($(".onChat").children("span").text()==obj.poster){
            chatWindow.children(".chat-content").remove();
            chatWindow.children(".tool_bar").before(chatperson[obj.poster]);
        }


    })
    socket.on('send',function (obj) {
        if(!chatperson.hasOwnProperty(obj.receiver)){
            var chatContent =$('<div class="chat-content"></div>');
            chatperson[obj.receiver]= chatContent;
        }
        var message = '<div class="chat-line-receiver"><img src="'+$("#getimg").children("img").attr("src")+'"'+'><div class="chat-lineContent">'+obj.message+' </div> </div>';
        chatperson[obj.receiver]='<div class="chat-content">'+$(chatperson[obj.receiver]).append(message).html()+'</div>';
        chatWindow.children(".chat-content").remove();
        chatWindow.children(".tool_bar").before(chatperson[obj.receiver]);
    })


})(jQuery);