var socket = io.connect('http://localhost:3000');
var X = window.scriptData;                          //截取服务器发送过来的数据

    socket.on("connect",function () {
        socket.emit("addUser",X._id);                   //添加用户
    })
    socket.on("playerSit",function (obj) {
        MODAL.insertImg($(".seat").eq(obj.index).children(),obj);
    })
    socket.on("leave",function (index) {
        MODAL.removeImg($(".seat").eq(index).children());
    })
    socket.on("seatsInfo",function (obj) {
        console.log("seatsInfo"+obj);
        for(var key in obj){
            console.log(key);
            MODAL.insertImg($(".seat").eq(obj[key].index).children(),obj[key]);
        }
    })
    socket.on("gameStart",function (seats) {
        MODAL.startGame(seats);
    })
var socketFun = {
    sit:function ($this) {
        /*
        $(".seat").each(function () {                   //这里不能用$this.parent()来追踪,因为$this.parent()只是找到三个seat中的一个而已,没卵用
            console.log($(this).children().attr("data-id"));
            if($(this).children().attr("data-id")==X._id){
                MODAL.removeImg($(this).children());
            }
        })
        */
        var obj = {
            id:X._id,
            index:$this.parent().index()
        }
        console.log(obj);
        socket.emit("sitSeat",obj);
    },

}
    
