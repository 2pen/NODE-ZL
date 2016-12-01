var STUDENT;
var isStudent = false;
$(init_student);
function init_student() {
    if(window.scriptData.identify=="student"){
        isStudent = true;
    }
    new modal_student();
}


var modal_student = function () {
    var ptrThis;
    var body = document.getElementsByTagName('body'); //body
    var questionInfo = document.getElementsByClassName("questionInfo");//题号+分值+(题目描述)
    var QuestionDetail = document.getElementsByClassName("QuestionDetail");//题目详细内容
    var testInfo = document.getElementsByClassName("testInfo");//右侧题目选择框
    var inputTe = document.getElementsByClassName("inputTe");//答题框

    var modalBox = {
        default:{
              questions:[],
              answers:[],
              index:0//当前题目编号,

        },
        calculTime:function () {
            var goal = new Date("2016-11-28 22:00:00");
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
        displayPaper:function () {
            var bc = document.getElementsByClassName("bc");
            var content = [
                '<div class="main">',
                '    <div class="questionInfo">',
                '       <span>第一题</span>',
                '       <span>分值:20分</span>',
                '       <span>题目描述:</span>',
                '    </div>',
                '    <span class="QuestionDetail">',
                '    </span>',
                '    <div contenteditable="true" class="inputTe"></div>',
                '    <div class="submit">',
                '       <button id="preQuestion" class="button button-pill button-highlight"><i class="iconfont">&#xe601;</i>上一题</button>',
                '       <button id="submit" class="button button-pill button-primary">Submit</button>',
                '       <button id="nextQuestion" class="button button-pill button-action"><i class="iconfont">&#xe600;</i>下一题</button>',
                '    </div>',
                '</div>'
            ].join("");
            bc[0].innerHTML = content;
        },
        bindStartTest:function () {
            var startTest = document.getElementById("startTest");
            startTest.addEventListener('click',function () {
                ptrThis.displayPaper();
                ptrThis.startTest();
            });

        },
        bindTextArea:function () {
            var main = document.getElementsByClassName("main");
            var bindEvent = ["paste","keyup","keydown","resize"];
            var submit = document.createElement("div");
            submit.classList.add("submit");
            submit.innerHTML =  ['       <button id="preQuestion" class="button button-pill button-highlight"><i class="iconfont">&#xe601;</i>上一题</button>',
                '<button id="submit" class="button button-pill button-primary">Submit</button>',
                '<button id="nextQuestion" class="button button-pill button-action"><i class="iconfont">&#xe600;</i>下一题</button>'].join("");
            for (var i = 0;i<bindEvent.length;++i){
                inputTe[0].addEventListener(bindEvent[i],function () {
                    var totalLength = 200+questionInfo[0].clientHeight+QuestionDetail[0].clientHeight+inputTe[0].clientHeight;
                    if(totalLength>main[0].clientHeight){
                        if(main[0].querySelector(".submit")!==null){
                            main[0].removeChild(main[0].querySelector(".submit"));
                            testInfo[0].appendChild(submit);
                        }
                    }else{
                        if(main[0].querySelector(".submit")===null){
                            main[0].appendChild(submit);
                            testInfo[0].removeChild(testInfo[0].querySelector(".submit"));
                        }

                    }
                })
            }


        },
        showTestInfo:function () {
            testInfo[0].style.right = "100px";
        },
        bindSelectQuestion:function () {
            body[0].addEventListener("click",function (e) {
                if(e.target.classList.contains("Number")){
                    ptrThis.default.index = [].indexOf.call(e.target.parentNode.children,e.target)-1;
                    ptrThis.toggleQuestion();
                }
            },false);
        },
        saveAnswer:function () {
            ptrThis.default.answers[ptrThis.default.index].content = inputTe[0].textContent;
        },
        bindButton:function () {
            body[0].addEventListener("click",function (e) {
                var ID = e.target.getAttribute("id");
                switch (ID){
                    case "preQuestion":
                        ptrThis.default.index = ptrThis.default.index==0?0:ptrThis.default.index-1;
                        ptrThis.toggleQuestion();
                        break;
                    case "submit":
                        ptrThis.saveAnswer();
                        socketFun.submitAnswer(ptrThis.default.index);
                        return;
                    case "nextQuestion":
                        ptrThis.default.index = ptrThis.default.index==4?4:ptrThis.default.index+1;
                        ptrThis.toggleQuestion();
                        break;
                    default:
                        break;
                }

            },false);
        },

        toggleQuestion:function () {
            inputTe[0].textContent = ptrThis.default.answers[ptrThis.default.index].content;
            questionInfo[0].children[0].textContent="第"+(ptrThis.default.questions[ptrThis.default.index].index+1)+"题";
            questionInfo[0].children[1].textContent="分值:"+ptrThis.default.questions[ptrThis.default.index].score;
            QuestionDetail[0].textContent=ptrThis.default.questions[ptrThis.default.index].question;
        },
        setQuestions:function () {
            ptrThis.default.questions = window.scriptData.subject.questions;
            console.log(ptrThis.default.questions);
        },
        setAnswers:function () {
            ptrThis.default.answers = window.scriptData.answer.questions;
        },
        setAnswersForTeacher:function (index) {
            ptrThis.default.answers = window.scriptData.students[index].questions;
        },
        init:function () {
            ptrThis = this;
            ptrThis.setQuestions();
            ptrThis.setAnswers();
            ptrThis.calculTime();   //准备考试界面的倒计时
            ptrThis.bindStartTest();//绑定开始考试按钮的监听事件
        },
        startTest:function () {
            ptrThis.toggleQuestion();
            ptrThis.bindTextArea();//绑定输入框的监听事件
            ptrThis.showTestInfo();//将题目选择框弹出
            ptrThis.bindSelectQuestion();//绑定选择问题监听事件
            ptrThis.bindButton();//绑定上一题、提交、下一题按钮
        },
        initForTeacher:function () {
            ptrThis = this;
            ptrThis.setQuestions();
            console.log("ptrThis已经绑定了");
        }
    }
    STUDENT = modalBox;
    if(isStudent){
        return modalBox.init();
    }else{
        return modalBox.initForTeacher();
    }

}

