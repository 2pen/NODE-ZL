
$("#groupDelete").on('click',function () {
    var array = new Array();

    $(".whetherDelete").each(function () {
        if($(this).is(':checked')) {
            alert($(this).data('arctleid'));
            array.push($(this).data('arctleid'));
        }

    });
    console.log(array);
});
