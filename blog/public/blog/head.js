$(init)

function init() {

    var imgUrl = $.cookie('imgurl');

    $(".uig").attr("src",imgUrl);
    $(".chat-line-receiver").children("img").attr("src",$(".userImg").children("img").attr("src"));

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
        $this = $(this);
        $('.FriList').removeClass('selectFri');
        $this.addClass('selectFri');
        $(".chat-content").text('');
        $('.chatWindow').css("display","flex");
        $('.chatPerson').children("img").attr("src",$this.children("img").attr("src"));
        $('.chat-name').children().eq(0).text($this.children().eq(0).text());
        $(".chat-line").children("img").attr("src",$this.children("img").attr("src"));
    })
})(jQuery);