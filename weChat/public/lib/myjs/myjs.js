$(init);

function init() {
    var index = 0;
    $(".msgOffline").each(function () {
        //console.dir(window.scriptData);
        if(window.scriptData.friends[index].hasOwnProperty('chatHistory')){
            if(window.scriptData.friends[index].chatHistory.personOne.username==$("#findName").text()){
                if(window.scriptData.friends[index].chatHistory.personOneNotRead>0){
                    $(this).show();

                    $(this).children("button").text(window.scriptData.friends[index].chatHistory.personOneNotRead);
                }
            }else{

                if(window.scriptData.friends[index].chatHistory.personTwoNotRead>0){
                    $(this).show();

                    $(this).children("button").text(window.scriptData.friends[index].chatHistory.personTwoNotRead);
                }
            }
        }
        ++index;

   })
    
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
