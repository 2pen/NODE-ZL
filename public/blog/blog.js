$(init);



$("#addComment").on('click', function (e) {

    var $this = $(this);
    addComment($this.siblings('.commentId').text(),$this.siblings("#commentContent").val());

});

function addComment(id,data) {

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

    location.href = "/";
}


