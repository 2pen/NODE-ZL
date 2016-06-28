# NODE-ZL
# 学习日志
### nodejs文件基本结构

/bin
... www
/node_modules
/public
...images
...javascripts
...stylesheets
/routes
...index
/views
.../layouts
.../partials
app.js
package.json
###如何配置hbsmuban
...
var hbs = exphbs.create({
  partialsDir: 'views/partials',
  layoutsDir: "views/layouts/",
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
...
###如何映射静态文件目录
###如何配置路由
...
app.use('/', routes);
app.use('/admin', admin);
...
表示将网址后缀是/还是/admin区分开来

###z-index无效该怎么办
...在设置元素的堆叠顺序时发现z-index无效，有可能是没有设施position的原因。多个需要产生堆叠效果的div中，选择一个设置为absolute或者relative即可。
###如何实现多个div自适应屏幕高度
...在上一个div具有一定高度后，下一个的div要想占满整个页面，需要设置height:100%，但这样很明显界面会溢出，所以需要将上一个div改成absolute或者需要适应的div设置marigin-top:-XXpx