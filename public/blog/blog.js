$(init);


$(document).ready(function(){
    if($.cookie('isReload')==1) {
        $("html,body").scrollTop($.cookie('blogScrollTop'));
        $.cookie('isReload',0);
    }

});

$(".divide").on('click',function (e) {
    if($(this).parent().hasClass('active')){

    }else{
        
        $(this).parent().siblings().removeClass('active');                  //先将父元素的active全部移除
        $(this).parent().addClass('active');                                //当前父元素增加active
        $(this).parents('.commentDivide').siblings('.box-comment').hide();//隐藏全部评论
        for(var i=($(this).text()-1)*5;i<$(this).text()*5;++i){             //显示符合条件的评论
            $(this).parents('.commentDivide').siblings('.box-comment').eq(i).show();
        }
    }
});

$(".addComment").on('click', function (e) {



    var $this = $(this);
    $($this.parent()).validate({
        wrapper:"span",
        onfocusout:false,
        submitHandler:function(form) {
            addComment($this.siblings('.commentId').text(),$this.siblings("#commentContent").val());
        }
    })

});

function addComment(id,data) {

    $.cookie('blogScrollTop', $("html,body").scrollTop());
    $.cookie('isReload',1);
    var jsonData = JSON.stringify({ 'esseyId': id,'commentContent':data,'id': $.cookie('id') });
    postData("/addComment", jsonData, cbReload);
}

function postData(url, data, cb) {


    var promise = $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        contentType: "application/json",
        data:data
    });
    promise.done(cb);
}

function cbReload() {

    location.href = window.location.href;
    
}


