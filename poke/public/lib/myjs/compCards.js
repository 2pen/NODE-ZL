
function compCards(array) {
    var ptr;
    var end = false;
    var box = {
        cardsType:{
            count:array.length,
            type:"ONE",
            value:data[array[0]].value
        },
        setType:function (type) {
            this.cardsType.type = type;
        },
        statusOne:function () {
            if(this.cardsType.count==1){
                end = true;
                return ;
            }
            if(data[array[0]].value==data[array[1]].value){          //如果第一个和第二个数字相同
                this.setType("TWO");
                return ;
            }
            if(data[array[0]].value==data[array[1]].value+1){
                this.setType("STRAIGHT");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusTwo:function () {
            if(this.cardsType.count==2){
                end = true;
                return ;
            }
            if(data[array[1]].value==data[array[2]].value){
                this.setType("THREE");
                return ;
            }
            if(data[array[1]].value==data[array[2]].value+1){
                this.setType("TWO-ONE");
            }else{
                this.setType("ERR");
            }

        },
        statusThree:function () {
            if(this.cardsType.count==3){
                end = true;
                return ;
            }
            if(data[array[2]].value==data[array[3]].value){
                this.setType("BOMB");
                return ;
            }
            if(data[array[2]].value==data[array[3]].value+1){
                this.setType("THREE-ONE");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusStraight:function () {
            if(this.cardsType.count<5){
                this.setType("ERR");
                end = true;
                return ;
            }
            if(ptr<this.cardsType.count-1){
                if(data[array[ptr]].value!=data[array[ptr+1]].value+1){
                    this.setType("ERR");
                    end = true;
                    return ;
                }
            }else{

                end = true;
                return ;
            }
        },
        statusTwoOne:function () {
            if(ptr==this.cardsType.count-1){                //TwoOne处于中间状态,结束则出错
                this.setType("ERR");
                return ;
            }
            if(data[array[ptr]].value==data[array[ptr+1]].value){
                this.setType("TWO-TWO");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusTwoTwo:function () {
            if(ptr==this.cardsType.count-1){
                end = true;
                return ;
            }
            if(data[array[ptr]].value==data[array[ptr]].value+1){
                this.setType("TWO-ONE");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusThreeOne:function () {
            if(ptr==this.cardsType.count-1){
                this.setType("ERR");
                return ;
            }
            if(data[array[ptr]].value==data[array[ptr+1]].value){
                this.setType("THREE-TWO");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusThreeTwo:function () {
            if(ptr==this.cardsType.count-1){
                this.setType("ERR");
                return ;
            }
            if(data[array[ptr]].value==data[array[ptr+1]].value){
                this.setType("THREE-THREE");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusThreeThree:function () {
            if(ptr==this.cardsType.count-1){
                end = true;
                return ;
            }
            if(data[array[ptr]].value==data[array[ptr+1]].value+1){
                this.setType("THREE-ONE");
            }else{
                this.setType("ERR");
            }
            return ;
        },
        statusBomb:function () {
            if(ptr==this.cardsType.count-1){
                end = true;
                return ;
            }
            if(data[array[ptr]].value!=data[array[ptr+1]].value){
                this.setType("ERR");
            }
        },
        ERR:function () {
            end = true;
            return ;
        }
    };
    for(ptr = 0;ptr<box.cardsType.count;++ptr){
        console.log("END:"+end);
        console.log(box.cardsType);
        if(end){

            break;
        }
        switch(box.cardsType.type){
            case "ONE":
                box.statusOne();
                break;
            case "TWO":
                box.statusTwo();
                break;
            case "THREE":
                box.statusThree();
                break;
            case "STRAIGHT":
                box.statusStraight();
                break;
            case "TWO-ONE":
                box.statusTwoOne();
                break;
            case "TWO-TWO":
                box.statusTwoTwo();
                break;
            case "THREE-ONE":
                box.statusThreeOne();
                break;
            case "THREE-TWO":
                box.statusThreeTwo();
                break;
            case "THREE-THREE":
                box.statusThreeThree();
                break;
            case "BOMB":
                box.statusBomb();
                break;
            case "ERR":
                box.ERR();
                break;
        }
    }
    return box.cardsType;

}