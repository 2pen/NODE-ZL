var express = require('express');
var router = express.Router();
var dbHelper = require('../db/dbHelper');
var formidable = require('formidable');
var entries = require('../db/jsonRes');
var fs = require('fs');
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
