var MODALBOX;
$(init);
function init() {
    MODALBOX = new modal();
}


var modal = function () {
    var ptrThis;
    var modalBox = {
        calculTime:function () {
            var goal = new Date("2016-11-23 22:00:00");
            var now = new Date();
            var deltaTotalTime = (goal.getTime()-now.getTime())/1000;
            var deltaHours = Math.floor(deltaTotalTime/3600);
            var deltaMinutes = Math.floor((deltaTotalTime-3600*deltaHours)/60);
            var deltaSeconds = Math.floor(deltaTotalTime-deltaHours*3600-deltaMinutes*60);
            var deltaTime = document.getElementById("deltaTime");
            deltaTime.textContent = "时间还剩"+deltaHours+"小时"+deltaMinutes+"分钟"+deltaSeconds+"秒";
            setInterval(function () {
                now = new Date();
                deltaTotalTime = (goal.getTime()-now.getTime())/1000;
                deltaHours = Math.floor(deltaTotalTime/3600);
                deltaMinutes = Math.floor((deltaTotalTime-3600*deltaHours)/60);
                deltaSeconds = Math.floor(deltaTotalTime-deltaHours*3600-deltaMinutes*60);
                deltaTime.textContent = "时间还剩"+deltaHours+"小时"+deltaMinutes+"分钟"+deltaSeconds+"秒";
            },1000)
        },
        bindStartTest:function () {
            var startTest = document.getElementById("startTest");
            startTest.addEventListener('click',function () {
                var bc = document.getElementsByClassName("bc");
                bc[0].innerHTML = "";
                
            });
        },
        init:function () {
            ptrThis = this;
            ptrThis.calculTime();
            ptrThis.bindStartTest();
        }
    }
    return modalBox.init();
}

