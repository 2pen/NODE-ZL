var socket = io.connect('http://localhost:3000');
var X = window.scriptData;                          //截取服务器发送过来的数据
(function ($) {
    socket.on("connect",function () {
        socket.emit("addUser",X._id);                   //添加用户
    })
    /*
    $("body").on("click",".place",function () {
        MODAL.insertImg($(this));
        var obj = {
            id:X._id,
            index:$(this).parent().index()
        }
        console.log(obj);
        socket.emit("sitSeat",obj);
    })
    */
})(jQuery);