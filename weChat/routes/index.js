var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');
var fs = require('fs');
var request = require('request');
/* GET home page. */
router.get('/', function(req, res, next) {
  dbHelper.findUsrInfo(req, function (success, data) {
    //console.log(data.friends);
    res.render('chat', {
      user:data,
      scriptData:JSON.stringify(data)
    });
  })

});

router.post('/uploadImgFF',function (req,res,next) {
  //1.获取客户端传来的src_str字符串=>判断是base64还是普通地址=>获取图片类型后缀(jpg/png etc)
//=>如果是base64替换掉"前缀"("data:image\/png;base64," etc)
//2.base64 转为 buffer对象 普通地址则先down下来
//3.写入硬盘(后续可以将地址存入数据库)
//4.返回picture地址
  console.log("fuck!!!!!");

  var src_str = req.body.base64,
      timestamp = new Date().getTime();
  console.log(src_str);

  if ( src_str.match(/^data:image\/png;base64,|^data:image\/jpg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,/) ) {
    //处理截图 src_str为base64字符串
    console.log("shit");

    var pic_suffix = src_str.split(';',1)[0].split('/',2)[1],
        base64 = src_str.replace(/^data:image\/png;base64,|^data:image\/jpg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,/, ''),
        buf = new Buffer(base64, 'base64'),
        store_path = './upload/' + timestamp + '.' + pic_suffix;
        console.log(store_path);

    fs.writeFile(store_path, buf, function (err) {
      console.log("fuck!");
      if (err) {
        throw err;
      } else {
        res.json({'store_path': store_path});
      }
  });
} else {// 处理非chrome的网页图片 src_str为图片地址
  console.log("网页图片"+src_str);
  var temp_array = src_str.split('.'),
      pic_suffix = temp_array[temp_array.length - 1],
      store_path = './upload/' + timestamp + '.' + pic_suffix,
      wstream = fs.createWriteStream(store_path);
  console.log(store_path);
  request(src_str).pipe(wstream);
  wstream.on('finish', function (err) {
    console.log("进入finish");
    if( err ) {
      throw err;
    } else {
      res.json({'store_path': store_path});
    }
  });


}
})

router.post('/uploadImg', function(req, res, next) {

  var io = global.io;

  var form = new formidable.IncomingForm();
  var path = "";
  var fields = [];

  form.encoding = 'utf-8';
  form.uploadDir = "upload";
  form.keepExtensions = true;
  form.maxFieldsSize = 30000 * 1024 * 1024;


  var uploadprogress = 0;
  //console.log("start:upload----"+uploadprogress);

  form.parse(req);

  form.on('field', function(field, value) {
    fields[field] = value;
  })
      .on('file', function(field, file) {
        path = '\\' + file.path;
        if(fields['filetype'].match(/image/)){
          var str = fields['filetype'].match(/[^image\/]\w+$/);
          var str = str[0];
          var reg = new RegExp(str);
          if(!file.path.match(reg)){
            fs.rename(file.path,file.path+'.'+str, function(err){
              if(err){
                throw err;
              }
              console.log('done!');
              path = '\\' + file.path+'.'+str;
            })
          }else{
            path = '\\' + file.path;
          }
        }else{
          path = '\\' + file.path;
        }



      })
      .on('progress', function(bytesReceived, bytesExpected) {

        uploadprogress = (bytesReceived / bytesExpected * 100).toFixed(0);
        //console.log("upload----"+ uploadprogress);
        io.sockets.in('sessionId').emit('uploadProgress', uploadprogress);
      })
      .on('end', function() {

        //console.log('-> upload done\n');
        entries.code = 0;

        if(fields['filetype'].match(/image/)){
          var str = fields['filetype'].match(/[^image\/]\w+$/);
          var str = str[0];
          var reg = new RegExp(str);
          if(!path.match(reg)){
            path = path + '.' + str;
          }
        }


        entries.data = path;
        res.writeHead(200, {
          'content-type': 'text/json'
        });
        res.end(JSON.stringify(entries));
      })
      .on("err",function(err){
        var callback="<script>alert('"+err+"');</script>";
        res.end(callback);//这段文本发回前端就会被同名的函数执行
      }).on("abort",function(){
    var callback="<script>alert('"+ttt+"');</script>";
    res.end(callback);
  });

});

module.exports = router;
