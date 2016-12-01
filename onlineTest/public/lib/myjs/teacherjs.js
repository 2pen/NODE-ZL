var TEACHER;
$(init_teacher);
function init_teacher() {
    new modal_teacher();
}

var modal_teacher = function () {
    var ptrThis;
    var body = document.getElementsByTagName('body'); //body
     var modalBox = {
         default:{
             studentIndex:0

         },
         changeToCorrect:function () {
             var correct = document.getElementById("submit");
             correct.setAttribute("id","correct");
             correct.textContent = "打分";
             correct.addEventListener("click",function () {
                 var getScore = document.getElementsByClassName("getScore");
                 var score = getScore[0].value;
                 if(score.match(/^[1-9]\d*$/)){
                     score = parseInt(score);
                     if(score<=window.scriptData.subject.questions[STUDENT.default.index].score){
                         socketFun.submitScore(window.scriptData.students[ptrThis.default.studentIndex].user.userId,
                             STUDENT.default.index,score);
                     }else{
                         alert("分数太高！");
                     }
                 }else{
                     alert("格式有误");
                 }
             });
         },
         appendScoreLine:function () {
             var submit = document.getElementsByClassName("submit");
             var scoreLine = document.createElement("div");
             submit[0].parentNode.insertBefore(scoreLine,submit[0]);
             scoreLine.classList.add("score");
             scoreLine.innerHTML = ['<span>该题成绩:</span>',
                 '<input class="getScore" type="text">'
             ].join("");
         },
         appendBackButton:function () {
             var back = document.createElement("button");
             var bc = document.getElementsByClassName("bc");
             var classes = ["button","button-pill","button-primary"];
             back.setAttribute("id","back");
             for (var i = 0;i<3;++i){
                 back.classList.add(classes[i]);
             }
             back.innerHTML = '<i class="iconfont">&#xe63f;</i>';
             body[0].appendChild(back);
             back.addEventListener("click",function () {
                 window.location.reload();//刷新当前页面.
             });
         },
        bindQueryStudent:function () {
            body[0].addEventListener("click",function (e) {
                if(e.target.classList.contains("studentInfo")||e.target.parentNode.classList.contains("studentInfo")){
                    console.log(STUDENT);
                    ptrThis.default.studentIndex = [].indexOf.call(e.target.parentNode.children,e.target);
                    STUDENT.displayPaper();
                    STUDENT.setAnswersForTeacher(ptrThis.default.studentIndex);
                    STUDENT.toggleQuestion();
                    STUDENT.bindButton();
                    ptrThis.appendScoreLine();
                    ptrThis.changeToCorrect();
                    ptrThis.appendBackButton();
                }
            })

        },
        init:function () {
            ptrThis = this;
            ptrThis.bindQueryStudent();


        }
    }
    TEACHER = modalBox;
    return modalBox.init();
}