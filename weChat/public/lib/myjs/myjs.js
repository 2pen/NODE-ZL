$(init);

function init() {

    
}


(function ($) {
    $("#history").on('click',function () {
        $(".Frilist").removeClass('show');
        $(".chatHistory").addClass('show');
    })
    $("#chooseFrilist").on('click',function () {
        $(".chatHistory").removeClass('show');
        $(".Frilist").addClass('show');
    })
    $("#addFri").on('click',function () {
        if($("#addFriList").css("display")=='none'){
            $("#addFriList").css("display","flex");
        }else{
            $("#addFriList").css("display","none");
        }
    })

})(jQuery);
