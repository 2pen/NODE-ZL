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
...var hbs = exphbs.create({
  partialsDir: 'views/partials',
  layoutsDir: "views/layouts/",
  defaultLayout: 'main',
  extname: '.hbs'
});
app.engine('hbs', hbs.engine);
###如何映射静态文件目录
###如何配置路由
...app.use('/', routes);
app.use('/admin', admin);
表示将网址后缀是/还是/admin区分开来