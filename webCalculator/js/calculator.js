
var preSymbol;
var preNumber;
var flag = false;
var Node = function (newData) {
	this.next = null;
	this.data = newData;

    this.Init = function(){  
        this.data = newData;  
    };  
    this.Init();  
}
var List = function(){
	this.head = null;
	this.size = 0;

    this.Init = function(){  
            this.head = null;  
            this.size = 0;  
        }  
    this.Init(); 

	this.Insert = function(newData){
		this.size += 1;
		var newNode = new Node(newData);
		if(this.head == null){
			this.head = newNode;
			return;
		}
		var tempNode = this.head;
		while(tempNode.next != null)
			tempNode = tempNode.next;
		tempNode.next = newNode;
	}

	this.GetData = function(pos){
		if(pos>=this.size||pos<0){
			return null;
		}else{
			var tempNode = this.head;
			for(var i = 0;i<pos;++i){
				tempNode = tempNode.next;
			}
			return tempNode.data;
		}
	}

	this.Remove = function(pos){
		if(pos>=this.size||pos<0){
			return null;
		}
		this.size -= 1;
		var tempNode = this.head;
		if(pos==0){
			this.head = this.head.next;
			return this.head;
		}
        for(i = 0;i < pos - 1;i++){  
                tempNode = tempNode.next;  
        }  
        tempNode.next = tempNode.next.next;  
        return tempNode.next;  
	}

	this.Print = function(){
		tempNode = this.head;  
            while(tempNode != null){  
                console.log(tempNode.data);  
                tempNode = tempNode.next;  
            }  
	}
}

function testKind(e) {
	var typeNodeS;
	switch(e){
		case '+':
			typeNodeS = "plus";
			break;
		case '-':
			typeNodeS = "minus";
			break;
		case '×':
			typeNodeS = "muti";
			break;
		case '÷':
			typeNodeS = "divide";
			break;
		case '.':
			typeNodeS = "point";
			break;
		default:
			typeNodeS = "number";
			break;
	}
	return typeNodeS;
}

$("body").on('click', '.number', function(event) {
	event.preventDefault();
		flag = false;

	if ($(".output").text()=='0') {
		$(".output").empty();
	}
	$(".output").append(($(this).text()));
});
$("body").on('click', '.clear', function(event) {
	event.preventDefault();
		flag = false;

		$(".output").text('0');
});
$("body").on('click', '.equal', function(event) {
	event.preventDefault();
	if(flag){

		var result = parseFloat($(".output").text())
		switch(preSymbol){
			case "muti":
				result = result * preNumber;
				break;
			case "divide":
				result = result/preNumber;
				break;
			case "plus":
				result = result+preNumber;
				break;
			case "minus":
				result = result-preNumber;
		}
		$(".output").text(result);
		return ;
	}
	var list = new List();

	var array = new Array();
	array = $(".output").text();
	for(var i = 0;i<array.length;++i){
		list.Insert(array[i]);
	}
	var tempNodeF = list.head;
	var tempNodeS = tempNodeF.next;
	var typeNodeF = "number";
	var typeNodeS;
	if(tempNodeS==null){
		$(".output").text(tempNodeF.data);
		return ;
	}else{
		typeNodeS = testKind(tempNodeS.data);
	}
	while(1){							//第一轮循环的目标是将多余的符号缩短到一个，将char数字变为int类型
		if(tempNodeS==null){
			break;
		}
		typeNodeF = testKind(tempNodeF.data);
		typeNodeS = testKind(tempNodeS.data);
		if(typeNodeF=="number"&&typeNodeS=="number"){			//如果是数字则合并
			tempNodeF.data = tempNodeF.data+tempNodeS.data;
			tempNodeF.next = tempNodeF.next.next;
			--list.size;
		}

		if(typeNodeF!="number"&&typeNodeF==typeNodeS){
			tempNodeF.next = tempNodeF.next.next;
			--list.size;
		}

		if(typeNodeF!="number"&&typeNodeS!="number"&&typeNodeF!=typeNodeS){
			$(".output").text("error");
			return ;

		}

		if(typeNodeF!=typeNodeS){			//如果为数字和符号或者是符号和数字的类型
			tempNodeF = tempNodeF.next;
		}
		tempNodeS = tempNodeF.next;
	}
	tempNodeF = list.head;
	tempNodeS = tempNodeF.next;
	while(1){
		if(tempNodeS==null){
			break;
		}
		typeNodeF = testKind(tempNodeF.data);
		typeNodeS = testKind(tempNodeS.data);
		if(typeNodeF=="number"&&typeNodeS=="number"){			//如果是数字则合并
			tempNodeF.data = tempNodeF.data+tempNodeS.data;
			tempNodeF.next = tempNodeF.next.next;
			--list.size;
		}
		if(typeNodeF=="number"&&typeNodeS=="point"){			//如果是数字和小数点则合并
			tempNodeF.data = tempNodeF.data+tempNodeS.data;
			var count = 0;
			for(var i = 0;i<tempNodeF.data.length;++i){
				if(tempNodeF.data[i]==".")
					++count;
			}
			if(count>1){
				console.log(count);
				$(".output").text("error");
				return ;
			}
			tempNodeF.next = tempNodeF.next.next;
			--list.size;
		}
		if(typeNodeF!="poing"&&typeNodeS!="point"&&typeNodeF!=typeNodeS){
			tempNodeF = tempNodeF.next;
		}
		tempNodeS = tempNodeF.next;

	}
	tempNodeF = list.head;
	tempNodeS = tempNodeF.next;


	while(1){
		if(tempNodeS==null){
			break;
		}
		typeNodeF = testKind(tempNodeF.data);
		typeNodeS = testKind(tempNodeS.data);
		if(typeNodeS=="muti"){
			preSymbol = "muti";
			preNumber = parseFloat(tempNodeS.next.data);
			tempNodeF.data = parseFloat(tempNodeF.data)*parseFloat(tempNodeS.next.data);
			tempNodeS = tempNodeS.next.next;
			tempNodeF.next = tempNodeS;

			--list.size;
			--list.size;
		}
		else if(typeNodeS=="divide"){
			preSymbol = "divide";
			preNumber = parseFloat(tempNodeS.next.data);

			tempNodeF.data = parseFloat(tempNodeF.data)/parseFloat(tempNodeS.next.data);
			tempNodeS = tempNodeS.next.next;
			tempNodeF.next = tempNodeS;

			--list.size;
			--list.size;
		}else{
			tempNodeF = tempNodeF.next.next;
		}
		if(tempNodeF==null||tempNodeS==null){
			break;
		}else{
			tempNodeS=tempNodeF.next;
		}

	}
	tempNodeF = list.head;
	tempNodeS = tempNodeF.next;
	while(1){
		if(tempNodeS==null){
			break;
		}
		typeNodeF = testKind(tempNodeF.data);
		typeNodeS = testKind(tempNodeS.data);
		if(typeNodeS=="plus"){
			preSymbol = "plus";
			preNumber = parseFloat(tempNodeS.next.data);

			tempNodeF.data = parseFloat(tempNodeF.data)+parseFloat(tempNodeS.next.data);
			tempNodeS = tempNodeS.next.next;
			tempNodeF.next = tempNodeS;

			--list.size;
			--list.size;
		}
		else if(typeNodeS=="minus"){
			preSymbol = "minus";
			preNumber = parseFloat(tempNodeS.next.data);

			tempNodeF.data = parseFloat(tempNodeF.data)-parseFloat(tempNodeS.next.data);
			tempNodeS = tempNodeS.next.next;
			tempNodeF.next = tempNodeS;

			--list.size;
			--list.size;
		}else{
			tempNodeF = tempNodeF.next.next;
		}
		if(tempNodeF==null||tempNodeS==null){
			break;
		}else{
			tempNodeS=tempNodeF.next;
		}

	}
	flag = true;
	$(".output").text(list.head.data);

});
$("body").on('click', '.point', function(event) {
	event.preventDefault();
	/* Act on the event */
	flag = false;
	$(".output").append(($(this).text()));

});
$("body").on('click', '.symbol', function(event) {
	event.preventDefault();
		flag = false;

		$(".output").append(($(this).text()));
});

$("body").on('click', '.zero', function(event) {
	event.preventDefault();
		flag = false;

	if ($(".output").text()!='0') {
		$(".output").append(($(this).text()));
	}
});
