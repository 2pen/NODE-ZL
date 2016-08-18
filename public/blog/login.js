$(init);

function init() {
    $("body").on('click','#loginBtn',doLogin);
    $("body").css("position","absolute");                   //attr只能给已有的属性赋值，css可以给没有的属性赋值
}

function doLogin() {
    $.ajax({
        type:"POST",
        url:"/login",
        contentType:"application/json",
        dataType:"json",
        data:JSON.stringify({
            'usr':$("#usr").val(),
            'pwd':$("#pwd").val()
        }),
        success:function (result) {
            if(result.code==99){
                $(".login-box-msg").text(result.msg);
                $(".login-box-msg").css('padding-bottom','0');
            }else{
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('imgurl', result.data.imgUrl, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/blog";
            }
        }
    })
    
}