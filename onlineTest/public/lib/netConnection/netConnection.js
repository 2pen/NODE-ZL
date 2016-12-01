var socket = io.connect('http://localhost:3000');
var X = window.scriptData;                          //截取服务器发送过来的数据


var obj = {
    userId:$.cookie('userId'),
    indentify:X.identify
}
socket.on("connect",function () {
    console.log(obj);
    socket.emit("addUser",obj);
})


var socketFun = {
    copy:function (oldObj,newObj) {
        oldObj = {
            userId:obj.userId,
            indentify:obj.indentify
        };
        return oldObj;
    },
    submitAnswer:function (index) {
        var result = this.copy(obj,result);
        result["number"] = index;
        result["content"] = STUDENT.default.answers[index].content;
        socket.emit("submitAnswer",result);
    },
    submitScore:function (studentId,questionIndex,score) {
        var result = this.copy(obj,result);
        result["studentId"] = studentId;
        result["questionIndex"] = questionIndex;
        result["score"] = score;
        socket.emit("submitScore",result);
    }
}