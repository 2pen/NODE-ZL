$(init);

function init() {
    $("body").on('click','#loginBtn',doLogin);
    $("body").on('click','#registerBtn',doRegister);
}

function doLogin() {
    var goal;
    if($(".chooseIdentity").eq(0).children("input").is(':checked')){
        goal = "student";
    }else{
        goal = "teacher";
    }
    $.ajax({
        type:"POST",
        url:"/login",
        contentType:"application/json",
        dataType:"json",
        data:JSON.stringify({
            'usrId':$("#usr").val(),
            'pwd':$("#pwd").val(),
            'identify':goal,
        }),
        success:function (result) {
            console.log(result);
            if(result.code==99){
                $(".login-box-msg").text(result.msg);
                $(".login-box-msg").css('padding-bottom','0');
            }else{
                $.cookie('username',result.data.username,{expires:30})
                $.cookie('userId', result.data.userId, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/"+goal;
            }
        }
    })
    
}
function doRegister() {
    var goal;
    if($(".chooseIdentity").eq(0).children("input").is(':checked')){
        goal = "student";
    }else{
        goal = "teacher";
    }
    $.ajax({
        type:"POST",
        url:"/login/register",
        contentType:"application/json",
        dataType:"json",
        data:JSON.stringify({
            'usrId':$("#usr").val(),
            'pwd':$("#pwd").val(),
            'identify':goal,
        }),
        success:function (result) {
            console.log(result);
            if(result.code==99){
                $(".login-box-msg").text(result.msg);
                $(".login-box-msg").css('padding-bottom','0');
            }else{
                $.cookie('username',result.data.username,{expires:30})
                $.cookie('userId', result.data.userId, {expires:30});
                $.cookie('password', result.data.password, {expires:30});
                $.cookie('id', result.data._id, {expires:30});
                location.href = "/"+goal;
            }
        }
    })
}