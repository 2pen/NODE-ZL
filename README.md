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

###2016-06-29
###如何让div沉底
在进行布局的时候会发现div无法沉底，如果设置position：absolute会和父元素的父元素进行匹配，原因在于父元素没有设置position这一属性。
###子元素设置margin属性导致父元素也产生偏移
body内设置一个img，在使用margin-top后，整个body也会产生偏移，经检查是html元素也需要设置position。
###完成登录功能时遇到的BUG
世界上没有什么BUG是一个小时解决不了的，如果有，那就五个小时
###
首先，我第一次nodejs的版本是6.X，在webstorm上debug的时候会出现各种v8debug is not defined的提示，看得让人很别扭。解决BUG是多个步骤合起来的，具体也不清楚是哪一步。
一：login.js文件末端添加
```javascript
<script src="/blog/login.js"></script>
```
二：卸载6.X版本的nodejs版本，装为4.4.6.第一次nodejs默认装在Program Files而不是Program Files（x86），我的系统是64位，让人不得不怀疑我下错了32位的nodejs。
三：head.hbs文件添加
```javascript
<script src="/lib/cookies/jquery.cookie.js"></script>
```
###
于是，就把这奇怪的bug给解决了。
###登录功能的相关实现
一：index.js文件添加如下代码
```javascript
var dbHelper = require('../db/dbHelper');
router.post('/login', function(req, res, next) {
    dbHelper.findUsr(req.body, function (success, doc) {
        res.send(doc);
    })
});
```
推测../db/dbHelper中的..是父文件夹的父文件夹
二：创建user.js,用以包含user的数据
三：dbHelper.js实现查找用户名和密码
```javascript
exports.findUsr = function (data,cb) {
    User.findOne({
        username:data.usr
    },function (err,doc) {
        var user = (doc!==null)? doc.toObject() : '';
        if(err){
            console.log(err)
        }else if(doc===null){
            entries.code = 99;
            entries.msg='用户名错误！';
            cb(false,entries);
        }else if(user.password!==data.pwd){
            entries.code = 99;
            entries.msg='密码错误！';
            cb(false,entries);
        }else if(user.password===data.pwd){
            entries.data = user;
            entries.code=0;
            cb(true,entries);
        }

    })
}
```
四：login.js提交登录数据，根据返回的数据来进行下一步操作

###2016-06-30
###如何使段落中的文本不换行
white-space: nowrap
###如何使自己定义的css属性覆盖bootstrap
添加！important
###将数据库的内容导入到页面中
```javascript
router.get('/blog', function(req, res, next) {
  dbHelper.findNews(req, function (success, data) {
    res.render('blog', {
      entries: data.results,
      pageCount: data.pageCount,
      pageNumber: data.pageNumber,
      count: data.count,
    });
  })
});

```
登录/blog页面后就会使用findNews，将数据传送给cb回调函数。

```javascript
{{#each entries}}
{{/each}}
```
包裹了需要复写的日志框
###数据库的相关知识
```javascript
var newsSchema = new Schema({
    title: String,
    content: String,
    meta: {
        updateAt: {type:Date, default: Date.now()},
        createAt: {type:Date, default: Date.now()}
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});
```

其中的
```javascript
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
```
ref表外部引用，相当于关系数据库的join

###还有东西想写，明天要练车去，晚上还得洗澡╮(╯▽╰)╭

###2016-07-07
###如何实现页面分页
核心代码
```javascript
<div class="box-footer">
    <nav>
        <ul class="pagination">
            <li>
                <a href="{{#le pageNumber 1}}?{{else}}?page={{reduce pageNumber 1}}{{/le}}"
                   aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            {{#times pageCount 1 pageCount}}
                <li {{#equals pageNumber this.step}}class="active" {{/equals}}>
                    <a href="?page={{step}}{{#if recommend}}&recommend={{recommend}}{{/if}}{{#if type}}&type={{type}}{{/if}}">{{step}}</a>
                </li>
            {{/times}}
            <li>
                <a href="{{#ge pageNumber pageCount}}?page={{pageCount}}{{else}}?page={{add pageNumber 1}}{{/ge}}"
                   aria-label="Previous">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</div>
```
这是基于bootstrap的功能，用于实现页面分页。由三部分li元素组成，第一部分和第三部分li表示页面往前和往后翻一页。第二部分li由数据库重复加载，表示1,2,3......页码。
因为不熟悉这个架构，所以全靠脑补。{{#le pageNumber 1}}?{{else}}?page={{reduce pageNumber 1}}{{/le}}将页面跳转到前一页，可以看出{{#le pageNumber 1}}{{/le}}两个
标签内涵判断条件#le pageNumber 1，pageNumber<=1的情况下进行某个动作，否则进行另一个动作。?{{else}}?page={{reduce pageNumber 1}}这个可能就是动作主题，由else判断，
条件成立的情况下不进行任何动作，不成立的情况下通过reduce将pageNumber-1实现往前跳转。{{#times pageCount 1 pageCount}}{{/times}}的功能可见hbsHelper的times函数功能
，用于循环插入数据。
###文章插入头像
在user数据里面插入imgUrl:String,通过更新数据操作更改imgUrl的地址，不过问题是更新数据操作只能更新一条，而且也没有实现头像。于是删除了全部的用户数据，然后插入一条
新的数据。于是就头像就出来了。
