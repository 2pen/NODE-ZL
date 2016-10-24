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

$("body").on('paste','.emoji-wysiwyg-editor',function(event){
    //console.log(event)
    var isChrome = false;
    if ( event.clipboardData || event.originalEvent ) {
        //not for ie11  某些chrome版本使用的是event.originalEvent
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        //console.log(clipboardData);
        if ( clipboardData.items ) {
            // for chrome
            var  items = clipboardData.items,
                len = items.length,
                blob = null;
            isChrome = true;
            //items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
            //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
            //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
            //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
            // console.log('len:' + len);
            // console.log(items[0]);
            // console.log(items[1]);
            // console.log( 'items[0] kind:', items[0].kind );
            // console.log( 'items[0] MIME type:', items[0].type );
            // console.log( 'items[1] kind:', items[1].kind );
            // console.log( 'items[1] MIME type:', items[1].type );

            //阻止默认行为即不让剪贴板内容在div中显示出来


            //在items里找粘贴的image,据上面分析,需要循环
            for (var i = 0; i < len; i++) {
                console.log(items[i]);
                console.log( items[i].type);
                if (items[i].type.indexOf("image") !== -1) {
                    event.preventDefault();
                    //getAsFile() 此方法只是living standard firefox ie11 并不支持
                    blob = items[i].getAsFile();
                }
            }
            console.log(blob);
            if ( blob !== null ) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    // event.target.result 即为图片的Base64编码字符串
                    var base64_str = event.target.result;
                    //console.log(base64_str);
                    //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                    doUpload(blob, 'paste', isChrome);
                }
                reader.readAsDataURL(blob);
            }
        } else {
            //for firefox
            setTimeout(function () {
                //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
                var imgList = document.querySelectorAll('#tar_box img'),
                    len = imgList.length,
                    src_str = '',
                    i;
                for ( i = 0; i < len; i ++ ) {
                    if ( imgList[i].className !== 'my_img' ) {
                        //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                        src_str = imgList[i].src;
                    }
                }
                uploadImgFromPaste(src_str, 'paste', isChrome);
            }, 1);
        }
    } else {
        //for ie11
        setTimeout(function () {
            var imgList = document.querySelectorAll('#tar_box img'),
                len = imgList.length,
                src_str = '',
                i;
            for ( i = 0; i < len; i ++ ) {
                if ( imgList[i].className !== 'my_img' ) {
                    src_str = imgList[i].src;
                }
            }
            uploadImgFromPaste(src_str, 'paste', isChrome);
        }, 1);
    }

})

function doUpload(file, type, isChrome) {

    $(".pg-wrapper").show();

    var file = file;
    console.log(file.type);
    var form = new FormData();
    form.append("file", file);
    form.append("filetype",file.type);
    $.ajax({
        url: "/uploadImg",
        type: "POST",
        data: form,
        async: true,
        processData: false,
        contentType: false,
        success: function(result) {
            $.Insetimage(result.data);


        }
    });
}




function uploadImgFromPaste (file, type, isChrome) {
    var formData = new FormData();
    formData.append('image', file);
    formData.append('submission-type', type);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_image_by_paste');
    xhr.onload = function () {
        if ( xhr.readyState === 4 ) {
            if ( xhr.status === 200 ) {
                var data = JSON.parse( xhr.responseText ),
                    tarBox = document.getElementById('tar_box');
                if ( isChrome ) {
                    var img = document.createElement('img');
                    img.className = 'my_img';
                    img.src = data.store_path;
                    tarBox.appendChild(img);
                } else {
                    var imgList = document.querySelectorAll('#tar_box img'),
                        len = imgList.length,
                        i;
                    for ( i = 0; i < len; i ++) {
                        if ( imgList[i].className !== 'my_img' ) {
                            imgList[i].className = 'my_img';
                            imgList[i].src = data.store_path;
                        }
                    }
                }

            } else {
                console.log( xhr.statusText );
            }
        };
    };
    xhr.onerror = function (e) {
        console.log( xhr.statusText );
    }
    xhr.send(formData);
}