
(function ($) {
    $("#history").on('click',function () {
        $(".Frilist").removeClass('show');
        $(".chatHistory").addClass('show');
    })
    $("#chooseFrilist").on('click',function () {
        $(".chatHistory").removeClass('show');
        $(".Frilist").addClass('show');
    })

})(jQuery);
