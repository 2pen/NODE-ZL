var input = $(".input-content");                    //输入框内容
var USER_NAME = $("#findName").text();               //当前用户名字
var USER_ID = $("#findName").data('id');             //当前用户ID
var CHAT_PERSON = {};                                 //一个包含聊天对象的对象
var chatWindow = $(".chatWindow");                  //聊天框
var ONCHATFRI;
var FRI_INFO = '<div class="addFriInfo" data-id="{0}"><img src="{1}"><span>{2}</span><button class="mkFri button button-primary button-box button-small"><i class="fa fa-plus"></i></button></div>';
var MSG_RECEIVE = '<div class="chat-line"><img src="{0}"><div class="chat-lineContent">{1}</div></div>';
var MSG_SEND = '<div class="chat-line-receiver"><img src="{0}"><div class="chat-lineContent">{1}</div></div>';
var socket = io.connect('http://localhost:3000');
var X = window.scriptData;                          //截取服务器发送过来的数据
(function($){

    var groupinput = $(".group-input-content");         //群聊
    var send = $(".send-message").children("button");                      //发消息按钮
    var groupsend = $(".group-send-message").children("button");            //群发消息
    var GroupChat = $(".GroupChat");
    var Frilist = $(".Fri-list");
    var startSearch = $("#startSearch");

    socket.on("open",function () {
        socket.emit("addUser",USER_NAME);
    })

    startSearch.on('click',function () {
        var ADD_FRI = $("#searchAddFri").val();               //搜索框的好友名字
        if(ADD_FRI!=''){
            socket.emit('searchFri',ADD_FRI);
        }
    })

    $("body").on('click','.FriendInfo',function(e){
        displayHis($(this));
        $(".chat-content").scrollTop($('.chat-content')[0].scrollHeight-$('.chat-content')[0].clientHeight);

    })

    $("body").on('click','.mkFri',function(e){
        var msg = {
            inviter: USER_ID,       //成为好友的邀请人
            receiver: $(this).parent().data('id')        //成为好友的接收人
        }
        socket.emit('becomeFri',msg);
    });

    GroupChat.on('click',function () {
        var array = new Array();
        $("input[id^='choose-Fri']").each(function () {
            if($(this).is(':checked')) {
                array.push($(this).parent().siblings('.FriList').children().eq(0).text());

            }

        })
        array.push(USER_NAME);
        console.log(array);
        socket.emit("createGroup",array);
    })

    socket.on('searchFri',function (user) {
        var FriInfo;
        FriInfo=$.format(FRI_INFO, user._id, user.imgUrl,user.username);
        $(".FriInfoList").empty().append(FriInfo);
    })

    socket.on('groupInit',function (obj) {
        $(".groupTalk").css("display","flex");
        var Fri = ' <div class="singleFri"><img src="'+$(".userImg").children("img").attr("src")+'"><span>'+USER_NAME+'</span></div>';
        Frilist.append(Fri);
        for(var i=0;i<obj.array.length;++i){
            if(obj.array[i]!=USER_NAME){
                var Fri = ' <div class="singleFri"><img src="'+obj.memberinfo[obj.array[i]]+'"><span>'+obj.array[i]+'</span></div>';
                Frilist.append(Fri);
            }
        }
    })

    send.on('click',function () {

        sendMsg();
        $(".emoji-wysiwyg-editor").text('');

    })
    groupsend.on('click',function () {
        var message = groupinput.val();
        var poster = USER_NAME;
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
        if(info.poster!=USER_NAME){
            var message = '<div class="chat-line"><img src="'+info.imgUrl+'"'+'><div class="chat-lineContent">'+info.message+' </div> </div>';
            content.append(message);
        }else{
            var message = '<div class="chat-line-receiver"><img src="'+info.imgUrl+'"'+'><div class="chat-lineContent">'+info.message+' </div> </div>';
            content.append(message);
        }
    })

    socket.on('receive',function (obj) {
        receive(obj);
    })
    socket.on('send',function (obj) {
        socketsend(obj);

    })


})(jQuery);

function socketsend(obj) {
    if(!CHAT_PERSON.hasOwnProperty(obj.receiver)){
        var chatContent =$('<div class="chat-content"></div>');
        CHAT_PERSON[obj.receiver]= chatContent;
    }
    var message;
    message = $.format(MSG_SEND,$("#getimg").children("img").attr("src"),obj.message);
    message = $.insertEmoji(message);
    CHAT_PERSON[obj.receiver]='<div class="chat-content">'+$(CHAT_PERSON[obj.receiver]).append(message).html()+'</div>';
    chatWindow.children(".chat-content").remove();
    chatWindow.children(".tool_bar").before(CHAT_PERSON[obj.receiver]);
    $(".chat-content").scrollTop($('.chat-content')[0].scrollHeight-$('.chat-content')[0].clientHeight);

}

function receive(obj) {
    var imgUrl;
    var objection;
    $(".FriendInfo").each(function () {
        if($(this).children("span").text()==obj.poster){
            objection=$(this);
            imgUrl = objection.children("img").attr("src");
            if(!objection.hasClass('onChat')){
                objection.children("div").show();
                objection.children("div").children("button").text(parseInt($(this).children("div").children("button").text())+1);
            }else{
                var clearData = {
                    poster:USER_NAME,
                    receiver:ONCHATFRI
                }
                socket.emit('clearNotRead',clearData);
            }
            console.log(imgUrl);
        }
    })

    if(!CHAT_PERSON.hasOwnProperty(obj.poster)){
        createChatcontent(objection);
    }
    var message;
    message=$.format(MSG_RECEIVE,imgUrl,obj.message);
    message = $.insertEmoji(message);
    CHAT_PERSON[obj.poster]='<div class="chat-content">'+$(CHAT_PERSON[obj.poster]).append(message).html()+'</div>';

    if(ONCHATFRI==obj.poster){
        chatWindow.children(".chat-content").remove();
        chatWindow.children(".tool_bar").before(CHAT_PERSON[obj.poster]);

        $(".chat-content").scrollTop($('.chat-content')[0].scrollHeight-$('.chat-content')[0].clientHeight);

    }

}

function sendMsg() {
    var message = input.val();
    var receiver = ONCHATFRI;
    var poster = USER_NAME;
    var obj = {
        message:message,
        receiver:receiver,
        poster:poster
    }
    console.log(obj);
    if(!message)return ;
    socket.send(obj);
    input.val('');
}

function displayHis($this) {
    $this.children("div").hide();
    $this.children("div").children("button").text('0');
    $(".FriendInfo").removeClass('onChat');
    $this.addClass('onChat');
    ONCHATFRI = $('.onChat').children("span").text();         //正在聊天的好友的信息
    var obj = {
        poster:USER_NAME,
        receiver:ONCHATFRI
    }
    socket.emit('clearNotRead',obj);

    $("#selfInfo").children("span").text(ONCHATFRI);

    chatWindow.children(".chat-content").remove();
    chatWindow.children(".detailedInfo").after(CHAT_PERSON[ONCHATFRI]);

    if(!CHAT_PERSON.hasOwnProperty(ONCHATFRI)){
        //console.dir(window.scriptData.friends[1].chatHistory);
        createChatcontent($(".onChat"));

    }

    chatWindow.children(".chat-content").remove();

    chatWindow.children(".tool_bar").before(CHAT_PERSON[ONCHATFRI]);
}

function createChatcontent(obj) {
    var chatContent =$('<div class="chat-content"></div>');
    CHAT_PERSON[obj.children("span").text()]= chatContent;

    for(var i = 0;i< X.friends.length;++i){
        if(!X.friends[i].chatHistory){
            console.log("fuck");
            continue;
        }
        if((X.friends[i].chatHistory.personOne.username==obj.children("span").text()
            &&X.friends[i].chatHistory.personTwo.username==USER_NAME)||
            (X.friends[i].chatHistory.personOne.username==USER_NAME
            &&X.friends[i].chatHistory.personTwo.username==obj.children("span").text())){
            var chatContent =$('<div class="chat-content"></div>');
            CHAT_PERSON[obj.children("span").text()]= chatContent;

            for(var j=0;j<X.friends[i].chatHistory.children.length;++j){
                if(X.friends[i].chatHistory.children[j].from.username==obj.children("span").text()){
                    var imgUrl = obj.children("img").attr("src");
                    var message;
                    message = $.format(MSG_RECEIVE,imgUrl,X.friends[i].chatHistory.children[j].message);

                    message = $.insertEmoji(message);

                    CHAT_PERSON[obj.children("span").text()]='<div class="chat-content">'+$(CHAT_PERSON[obj.children("span").text()]).append(message).html()+'</div>';
                }else{
                    var message;
                    message = $.format(MSG_SEND,$("#getimg").children("img").attr("src"),X.friends[i].chatHistory.children[j].message);
                    message = $.insertEmoji(message);
                    CHAT_PERSON[obj.children("span").text()]='<div class="chat-content">'+$(CHAT_PERSON[obj.children("span").text()]).append(message).html()+'</div>';
                }
            }
            console.log(CHAT_PERSON[obj.children("span").text()]);
        }
    }


}