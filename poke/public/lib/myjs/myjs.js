
var MODAL;
$(init);
function init() {

    new modal();
    $("body").on("click","#sendCards",statusMachine);
}
function statusMachine() {
    switch(MODAL.default.status){
        case "DISCARD":
            MODAL.preSend();
            break;
        case "WAITNG":
            MODAL.notYourTurn();
            break;
        case "GAMEOVER":
            MODAL.readyGame();
        default:
            break;
    }
}
var modal = function () {
    var ptrThis;
    
    var modalBox = {
        default:{
            cards:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,
            38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],
            status:"",
            myIndex:0,
            leftIndex:0,
            rightIndex:0,
            turn:0,
            disCardTrue:false,
            formercardsType:{}
        },
        placeCards:function ($goal,cardArray,isDelay) {
            var $cards = $("<div>").addClass("cards");
            var array = cardArray;
            for(var i = 0;i<array.length;++i){
                (function(i){
                    if(isDelay){
                        setTimeout(function(){
                            var $card = $("<div>").addClass("card");
                            $card.css({
                                'background-position':(array[i]%13*-90)+"px "+(Math.floor(array[i]/13)*-120)+"px"
                            });                                            //background-position:0px -480px;
                            $card.attr({
                                index:array[i]
                            });
                            //console.log("x坐标:"+array[i]%13+"   y坐标"+Math.floor(array[i]/13));

                            $cards.append($card);
                        },i*0);
                    }else{
                        var $card = $("<div>").addClass("card");
                        $card.css({
                            'background-position':(array[i]%13*-90)+"px "+(Math.floor(array[i]/13)*-120)+"px"
                        });                                            //background-position:0px -480px;
                        $card.attr({
                            index:array[i]
                        });
                        //console.log("x坐标:"+array[i]%13+"   y坐标"+Math.floor(array[i]/13));

                        $cards.append($card);
                    }

                })(i);

            }
            $goal.empty();
            $goal.append($cards);
        },
        comp:function (a,b) {
            if(data[a].value>data[b].value){
                return false;
            }else if(data[a].value==data[b].value){
                if(data[a].lever>data[b].lever){
                    return true;
                }else{
                    return false;
                }
            }else {
                return true;
            }
        },
        toggleCard:function ($this) {
            if(!$this.hasClass("select")){
                $this.addClass("select");
            }else{
                $this.removeClass("select");
            }
        },
        cardsSort:function (cards) {
            cards.sort(this.comp);
        },
        removeCards:function () {

            $(".cardsLine .card").each(function () {
                if($(this).hasClass("select")){
                    $(this).remove();
                }
            })


        },
        justifyWhich:function (obj) {
            if(obj.posterIndex!=MODAL.default.myIndex){
                MODAL.default.formercardsType=compCards(obj.array);
            }
            MODAL.default.disCardTrue = false;
            var $goal;
            console.log("posterIndex"+obj.posterIndex);
            console.log("array"+obj.array);

            switch(obj.posterIndex){
                case MODAL.default.myIndex:
                    ptrThis.removeCards();
                    $goal = $(".showCardLine");
                    break;
                case MODAL.default.leftIndex:
                    $goal = $(".leftPlayer").children(".otherCards");
                    break;
                case MODAL.default.rightIndex:
                    $goal = $(".rightPlayer").children(".otherCards");
                    break;
                default:
                    break;
            }

            ptrThis.placeCards($goal,obj.array,false);
            MODAL.default.turn = (MODAL.default.turn+1)%3;
            console.log("Now turn is"+MODAL.default.turn);
            if(MODAL.default.turn==MODAL.default.myIndex){
                MODAL.default.status = "DISCARD";
            }else{
                MODAL.default.status = "WAITNG"
            }
            if(obj.sendOut){
                if(obj.posterIndex==MODAL.default.myIndex){
                    ptrThis.end(true);
                }else{
                    ptrThis.end(false);
                }

            }
        },
        someOneTouXiang:function (seats) {
            MODAL.default.status = "GAMEOVER";
            $("#sendCards").text("准备");
            alert(seats.name+"这位玩家投降!");
            $(".showCardLine").empty();
            $(".cardsLine").empty();
            $(".leftPlayer").children(".otherCards").empty();
            $(".rightPlayer").children(".otherCards").empty();
        },
        clearCards:function () {
            $(".showCardLine").empty();
        },
        drawothers:function (objLeft,objRight) {
            var content = [
            '    <div class="others">',
            '        <div class="player leftPlayer">',
            '            <div class="otherPlayer">',
            '                <img src="/images/leftIcon.jpg">',
            '                <span>TOM</span>',
            '            </div>',
            '            <div class="otherCards">',
            '            </div>',
            '       </div>',
            '       <div class="player rightPlayer">',
            '            <div class="otherCards">',
            '            </div>',
            '            <div class="otherPlayer">',
            '                <img src="/images/rightIcon.jpg">',
            '                <span>TOM</span>',
            '            </div>',
            '        </div>',
            '    </div>'
            ].join("");
            var $others = $(content);
            $others.children(".leftPlayer").children(".otherPlayer").children("img").attr({
                src:objLeft.imgUrl
            });
            $others.children(".leftPlayer").children(".otherPlayer").children("span").text(objLeft.name);
            $others.children(".rightPlayer").children(".otherPlayer").children("img").attr({
                src:objRight.imgUrl
            });
            $others.children(".rightPlayer").children(".otherPlayer").children("span").text(objRight.name);
            $(".bc").append($others);
        },
        drawuser:function (obj) {
            var content = [
            '    <div class="user">',
            '        <div class="avatar">',
            '            <img src="/images/doge.jpg">',
            '        <span>TOM</span>',
            '        </div>',
            '        <div class="twoCards">',
            '           <div class="showCardLine">',
            '            </div>',
            '            <div class="cardsLine">',
            '            </div>',
            '        </div>',
            '        <div class="sendCards">',
            '           <button  id="sendCards" class="button button-glow button-rounded button-primary">出牌</button>',
            '           <button  id="giveup" class="button button-glow button-rounded button-primary">放弃</button>',
            '           <button  id="clearCards" class="button button-glow button-rounded button-primary">清空</button>',
            '           <button  id="touxiang" class="button button-glow button-rounded button-primary">投降</button>',
            '        </div>',
            '    </div>',
            ].join("");
            var $user = $(content);
            $user.children(".avatar").children("img").attr({
                src:obj.imgUrl
            })
            $user.children(".avatar").children("span").text(obj.name);
            $(".bc").append($user);
        },
        insertImg:function ($this,obj) {
            var $img = $("<img>");
            $img.attr({
                src:obj.imgUrl,
            });
            $this.attr("data-id",obj.id);
            $this.empty();
            $this.append($img);
        },
        removeImg:function ($this) {
            $this.empty();
        },
        startGame:function (seats,turn) {
            MODAL.default.turn = turn;

            $(".bc").empty();


            for(var i = 0;i<3;++i){
                if(seats[i].id==X._id){
                   MODAL.default.myIndex = i;
                   MODAL.default.cards = seats[i].array;
                }
            }
            if(MODAL.default.myIndex==turn){
                alert("现在由"+seats[turn].name+"先发牌!");
                MODAL.default.status = "DISCARD";
                MODAL.default.disCardTrue = true;
            }else{
                alert("现在由"+seats[turn].name+"先发牌!");
                MODAL.default.status = "WAITNG";
                MODAL.default.disCardTrue = false;
            }
            MODAL.default.leftIndex = ((MODAL.default.myIndex-1)<0)?2:MODAL.default.myIndex-1;
            MODAL.default.rightIndex = ((MODAL.default.myIndex+1)>2)?0:MODAL.default.myIndex+1;
            this.cardsSort(this.default.cards);                                       //按照花色,牌大小排序
            this.drawothers(seats[MODAL.default.leftIndex],seats[MODAL.default.rightIndex]);
            this.drawuser(seats[MODAL.default.myIndex]);
            this.placeCards($(".cardsLine"),this.default.cards,true);                                      //放置扑克
            this.initPlay();
        },
        preSend:function () {
            var array  = new Array();
            $(".cardsLine .card").each(function () {
                if($(this).hasClass("select")){
                    array.push($(this).attr("index"));
                }
            });
            var temp = compCards(array);
            //console.log(compCards(array));
            //console.log(temp);
            if(MODAL.default.disCardTrue){
                if(temp.type!="ERR"){
                    socketFun.sendCards(array);
                }else{
                    alert("无法出牌");
                }
            }else{
                var flag = ptrThis.compWhichLarger(temp);
                if(flag){
                    socketFun.sendCards(array);
                }else{
                    alert("无法出牌");
                }
            }

            //ptrThis.sendCards();
        },
        notYourTurn:function () {
            alert("Not Your Turn!Please Wait!");
        },
        compWhichLarger:function (temp) {
            switch(temp.type){
                case "ERR":
                    return false;
                case "BOMB":
                    if(MODAL.default.formercardsType.type=="BOMB"){
                        if(temp.count>MODAL.default.formercardsType.count){
                            return true;
                        }else if(temp.count==MODAL.default.formercardsType.count&&temp.value>MODAL.default.formercardsType.value){
                            return true;
                        }
                    }else{
                        return true;
                    }
                    break;
                default:
                    if(temp.type==MODAL.default.formercardsType.type&&
                    temp.count==MODAL.default.formercardsType.count&&
                        temp.value>MODAL.default.formercardsType.value){
                        return true;
                    }else{
                        return false;
                    }
            }

        },
        init:function () {
            ptrThis = this;
            $("body").on("click",".place",function (e) {
                socketFun.sit($(this));
            })
        },
        end:function (isWin) {
            MODAL.default.status = "GAMEOVER";
            ptrThis.gameover(isWin);
        },
        reStart:function (array,turn) {
            this.default.cards = array;
            this.cardsSort(this.default.cards);                                       //按照花色,牌大小排序
            this.placeCards($(".cardsLine"),this.default.cards,true);                                      //放置扑克
            this.default.turn = turn;
            switch(turn){
                case MODAL.default.myIndex:
                    alert("由你先发牌");
                    break;
                case MODAL.default.leftIndex:
                    alert("由你左边的人先发牌");
                    break;
                case MODAL.default.rightIndex:
                    alert("由你右边的人先发牌");
                    break;
                default:
                    break;
            }
            if(MODAL.default.myIndex==turn){
                MODAL.default.status = "DISCARD";
                MODAL.default.disCardTrue = true;
            }else{
                MODAL.default.status = "WAITNG"
                MODAL.default.disCardTrue = false;
            }
            $("#sendCards").removeClass("ready");
            $("#sendCards").removeClass("button-highlight");
            $("#sendCards").addClass("button-primary");
            $("#sendCards").text("出牌");
        },
        readyGame:function () {
            if(!$("#sendCards").hasClass("ready")){
                $("#sendCards").addClass("ready");
                $("#sendCards").addClass("button-highlight");
                $("#sendCards").removeClass("button-primary");
                $("#sendCards").text("取消");
                var obj = {
                    index:MODAL.default.myIndex,
                    isReady:true
                }
                socketFun.readyMsg(obj);
            }else{
                $("#sendCards").removeClass("ready");
                $("#sendCards").removeClass("button-highlight");
                $("#sendCards").addClass("button-primary");
                $("#sendCards").text("准备");
                var obj = {
                    index:MODAL.default.myIndex,
                    isReady:false
                }
                socketFun.readyMsg(obj);
            }
        },
        gameover:function (isWin) {
            $("#sendCards").text("准备");
            if(isWin){
                alert("You Win!");
            }else{
                alert("You Lose!");
            }
            $(".showCardLine").empty();
            $(".cardsLine").empty();
            $(".leftPlayer").children(".otherCards").empty();
            $(".rightPlayer").children(".otherCards").empty();
        },
        giveUp:function () {
            if(MODAL.default.turn==MODAL.default.myIndex){
                if(MODAL.default.disCardTrue){
                    alert("你必须出牌,垃圾！");
                }else{
                    socketFun.giveUp();
                }
            }else{
                alert("没到你的回合,别急");
            }

        },
        giveUpReply:function (giupCount) {
            switch (MODAL.default.turn){
                case MODAL.default.myIndex:
                    ptrThis.clearCards();
                    break;
                case MODAL.default.leftIndex:
                    $(".leftPlayer").children(".otherCards").empty();
                    break;
                case MODAL.default.rightIndex:
                    $(".rightPlayer").children(".otherCards").empty();
                    break;
            }
            MODAL.default.turn = (MODAL.default.turn+1)%3;
            console.log("Now turn is:"+MODAL.default.turn);
            if(MODAL.default.myIndex==MODAL.default.turn){
                MODAL.default.status = "DISCARD";
            }else{
                MODAL.default.status = "WAITNG"
            }
            if(giupCount==2&&MODAL.default.myIndex==MODAL.default.turn){
                MODAL.default.disCardTrue = true;
            }
        },
        initPlay:function () {

            var isDrag;
            var overCount = 0;
            var index = [0,0,0];


            $("body").on("click","#touxiang",function () {
                socketFun.touxiang(MODAL.default.myIndex);
            })

            $("body").on("mousedown",".cardsLine .cards .card",function (e) {
                e.preventDefault();
                overCount = 1;
                index[overCount-1] = $(this).index();
                if(e.which==1){
                    isDrag = true;
                }
                ptrThis.toggleCard($(this));
            })
            $("body").on("click","#giveup",function () {
                ptrThis.giveUp();
            })
            $("body").on("click","#clearCards",function () {

                ptrThis.clearCards();
            })
            $("body").mousedown(function (e) {
                if(e.which==1){
                    isDrag = true;
                }
                //console.log("down");
            })
            $("body").mouseup(function (e) {
                if(e.which==1){
                    isDrag = false;
                }
                //console.log("up");

            })
            $("body").on("mouseover",".cardsLine .cards .card",function () {
                ++overCount;
                switch (overCount){
                    case 1:
                    case 2:
                    case 3:
                        index[overCount-1] = $(this).index();
                        break;
                    default:
                        index[0] = index[1];
                        index[1] = index[2];
                        index[2] = $(this).index();
                        break;
                }
                if(overCount>2){
                    var direction;
                    if((index[0]-index[1])*(index[1]-index[2])>0){
                        direction = true;                   //true表同方向
                    }else{
                        direction = false;
                    }
                    if(!direction){
                        if(isDrag){
                            ptrThis.toggleCard($(".cardsLine .cards").children().eq(index[1]));
                            console.log("发生变向"+$(".cardsLine .cards").eq(index[1]).index());
                        }

                    }
                }

                if(isDrag){
                    ptrThis.toggleCard($(this));
                }

                //console.log($(this).index());

            })


        }
    }
    MODAL = modalBox;
    return modalBox.init();

}