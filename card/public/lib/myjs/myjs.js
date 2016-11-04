function Person() {
    this.imgUrl = "/images/doge.jpg";
    this.name = "zhangle";
}
window.onload = function () {
    new modal();
    
}
var modal = function () {
    var user = new Person();
    var ptrThis;
    var modalBox = {
        default:{
            cards:[52,0,1,16,25,37,3,29,42]
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
                            console.log("x坐标:"+array[i]%13+"   y坐标"+Math.floor(array[i]/13));

                            $cards.append($card);
                        },i*300);
                    }else{
                        var $card = $("<div>").addClass("card");
                        $card.css({
                            'background-position':(array[i]%13*-90)+"px "+(Math.floor(array[i]/13)*-120)+"px"
                        });                                            //background-position:0px -480px;
                        $card.attr({
                            index:array[i]
                        });
                        console.log("x坐标:"+array[i]%13+"   y坐标"+Math.floor(array[i]/13));

                        $cards.append($card);
                    }

                })(i);

            }
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
        sendCards:function () {
            var array = new Array();
            $(".showCardLine").empty();
            $(".cardsLine .card").each(function () {
                if($(this).hasClass("select")){
                    array.push($(this).attr("index"));
                }
            })
            ptrThis.cardsSort(array);
            ptrThis.placeCards($(".showCardLine"),array,false);
        },
        clearCards:function () {
            $(".showCardLine").empty();
        },
        init:function () {
            ptrThis = this;
            var isDrag;
            var overCount = 0;
            var index = [0,0,0];
            this.cardsSort(this.default.cards);                                       //按照花色,牌大小排序
            this.placeCards($(".cardsLine"),this.default.cards,true);                                      //放置扑克
            $("body").on("mousedown",".cardsLine .cards .card",function (e) {
                e.preventDefault();
                overCount = 1;
                index[overCount-1] = $(this).index();
                if(e.which==1){
                    isDrag = true;
                    ableOut = true;
                }
                ptrThis.toggleCard($(this));
            })
            $("body").on("click","#sendCards",function () {
                ptrThis.sendCards();
            })
            $("body").on("click","#clearCards",function () {
                ptrThis.clearCards();
            })
            $("body").mousedown(function (e) {
                if(e.which==1){
                    isDrag = true;
                }
                console.log("down");
            })
            $("body").mouseup(function (e) {
                if(e.which==1){
                    isDrag = false;
                }
                console.log("up");

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

                console.log($(this).index());

            })


        }
    }
    return modalBox.init();

}