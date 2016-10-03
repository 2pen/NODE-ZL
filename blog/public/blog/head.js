$(init)

function init() {

    var imgUrl = $.cookie('imgurl');

    $(".uig").attr("src",imgUrl);
}

$("#search").validate({
    wrapper:"span",
    onfocusout:false,
    submitHandler:function(form) {
        doSearch($('#params').val());  //验证成功，调用添加慕课函数
    }
})

function doSearch(params) {
    var url = "?page=1&params="+params;
    location.href = url;
}

(function ($) {
    $('.FriList').on('click',function () {
        $(this).addClass('selectFri');
        $(this).siblings('.FriList').removeClass('selectFri');
    })
})(jQuery);