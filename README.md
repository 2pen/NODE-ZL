# NODE-ZL
# 学习日志
###2016-06-27
### nodejs文件基本结构

/bin  
...www  
/node_modules  
...body-parser  
...cheerio  
...cookie-parser  
...debug  
...express  
...express-handlebars  
...hbs  
...mongoose  
...morgan  
...serve-favicon  
/public  
...images  
...javascripts  
...lib  
...stylesheets  
/routes  
...admin.js  
...index.js  
/views  
...admin  
...layouts  
...partials  
...blog.hbs  
...error.hbs  
...index.hbs  
...layout.hbs  
...login.hbs  
app.js  
package.json 


###如何配置hbs模板
```javascript
//先引入模块  
var exphbs =require('express-handlebars');  
```

```javascript
//配置hbs基础模板和分块模板  
var hbs = exphbs.create({  
  partialsDir: 'views/partials',  //partials默认路径为views/partials
  layoutsDir: "views/layouts/",   //layout默认路径为views/layouts/
  defaultLayout: 'main',          //默认布局模板为main.hbs
  extname: '.hbs'                 //设置文件后缀名为.hbs
});  

app.engine('hbs', hbs.engine);  
```


###如何映射静态文件目录  

```javascript

//路由中间件按照顺序匹配，在当前目录下无法匹配时，才进行下一步，默认为public文件夹
//使用static中间件 制定public目录为静态资源目录,其中资源不会经过任何处理
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
//localhost:3000/ 映射到routes文件夹下
app.use('/admin', admin);
//localhost:3000/admin映射到admin文件夹下
```

###  

### 如何配置路由

```javascript
//获取express模块，并且新建router
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Express' , layout:'main'} );
});
//localhost:3000/blog，转到blog.hbs，显示布局为main.hbs
router.get('/login', function(req,res,next) {
    res.render('login',{ title: 'Express', layout:'lg'});
});
//localhost:3000/login，转到login.hbs，显示布局改为lg.hbs

module.exports = router; //开放router的对外接口
```

###上面部分从某个同学抄过来- -


###z-index无效该怎么办
在设置元素的堆叠顺序时发现z-index无效，有可能是没有设施position的原因。多个需要产生堆叠效果的div中，选择一个设置为absolute或者relative即可。
###如何实现多个div自适应屏幕高度
在上一个div具有一定高度后，下一个的div要想占满整个页面，需要设置height:100%，但这样很明显界面会溢出，所以需要将上一个div改成absolute或者需要适应的div设置marigin-top:-XXpx


###2016-06-28

###今天完成任务总结
安装了MongoDB，Robomong，以及WebStorm关于MongoDB的插件。

###
###如何安装MongoDB
主要需要注意的是配置MongoDB的环境。在MongoDB文件夹下创建db文件夹和log文件夹，log文件夹下需要创建MongoDB.log（MongoDB的日志文件）。
###
进入cmd
###
输入：D:\MongoDB\bin>mongod --dbpath D:\MongoDB\db
###
作用：将mongodb的数据库文件创建到D:\MongoDB\db目录
###
输入：D:\MongoDB\bin>mongod -dbpath "D:\MongoDB\db" -logpath "D:\MongoDB\log\MongoDB.log" -install -serviceName "MongoDB"（这里必须以管理员身份运行cmd）
###
作用：注册MongoDB Service
###
以管理员身份运行cmd，输入net start MongoDB(开启服务)，net stop MongoDB(关闭服务)
###用mongoose操作MongoDB
###获得mongoose模板
```javascript
var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/test");
/*  var Schema = mongoose.Schema;  用Schema代替mongoose.Schema*/
```
###存储数据
```javascript
var PersonInfo = new mongoose.Schema({
    age       : Number,
    id        : String,
    phone     : String,
    colloge   : String,
    hometown  : String
});

var Person = mongoose.model('Person',PersonInfo);

var person = new Person({
    age     :'20',
    id      :'3326241995123456',
    phone   :'13819630116',
    colloge :'hznu',
    hometown :'xianju'
})

person.save(function (err) {
    if(err){
        console.log('保存失败');
    }
    console.log('success');
})
```
###增加数据
```javascript
var person1 = new Person({
    age     :'15',
    id      :'3326242000123456',
    phone   :'1776542365',
    colloge :'no',
    hometown :'xianju'
})
person1.save(function (err) {
    if(err){
        console.log('保存失败');
    }
    console.log('success');
})
```
###修改数据
```javascript
var conditions = {age:20};
var update={$set:{hometown:'taizhou'}};
//第一个参数conditions是选择条件，第二个参数update是选择后该如何更改的参数,第三个是回调函数
Person.update(conditions,update,function (error,data) {
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
})
```
###删除数据
```javascript
Person.remove({age:20},function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('删除成功');
    }
})
```
###查询数据
```javascript
//$lt表示小于
Person.find({"age":{"$lt":19}},function (error,docs) {
    if(error){
        console.log(error);
    }else{
        console.log(docs);
    }
})
```
###500错误
500是服务器内部错误
###「理解HTTP」之常见的状态码 
https://segmentfault.com/a/1190000005338367?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io
###如何更快的下载模板
npm install -g mongoose --registry=https://registry.npm.taobao.org


###心得
初次接触WebStorm，觉得功能不错，但是上手阶段有些不适应。安装MongoDB以及配置环境时觉得很麻烦，让我想起了当初配置java的时候
，简直一个德性。不管怎么说获得的还是很多的，希望一年后能玩出个赏心悦目的blog。