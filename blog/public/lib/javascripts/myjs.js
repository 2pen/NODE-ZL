
$("#groupDelete").on('click',function () {
    var array = new Array();

    $(".whetherDelete").each(function () {
        if($(this).is(':checked')) {
            array.push($(this).data('arctleid'));
        }
        
    });
    var data = JSON.stringify({ 'main': array,'pageNumber':$(".pagenumber").text()});
    groupsDelete(data);
});

function groupsDelete(data) {
    var promise = $.ajax({
        type: "post",
        url: "/admin/groupDelete",
        dataType: "json",
        contentType: "application/json",
        data:data
    });
    promise.done(function () {
        location.href = window.location.href;
    });
}


