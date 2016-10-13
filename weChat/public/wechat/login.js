$(init);

function init() {
    $("body").on('click','#loginBtn',doLogin);
    $("body").on('click','#registerBtn',doRegister);
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
            console.log(result);
            if(result.code==99){
                $(".login-box-msg").text(result.msg);
                $(".login-box-msg").css('padding-bottom','0');
            }else{
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('imgurl', result.data.imgUrl, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/";
            }
        }
    })
    
}
function doRegister() {
    $.ajax({
        type:"POST",
        url:"/login/register",
        contentType:"application/json",
        dataType:"json",
        data:JSON.stringify({
            'usr':$("#usr").val(),
            'pwd':$("#pwd").val()
        }),
        success:function (result) {
            console.log(result);
            if(result.code==99){
                $(".login-box-msg").text(result.msg);
                $(".login-box-msg").css('padding-bottom','0');
            }else{
                $.cookie('username', result.data.username, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('imgurl', result.data.imgUrl, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/";
            }
        }
    })
}