var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var exphbs = require('express-handlebars');
var hbsHelper = require('./lib/hbsHelper');
var authority = require('./db/authority');
var routes = require('./routes/index');
var session     = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var hbs = exphbs.create({
  partialsDir:'views/partials',
  layoutsDir:"views/layouts/",
  defaultLayout:'main',
  extname:'.hbs',
  helpers:hbsHelper
});
app.engine('hbs', hbs.engine);      //没这句就跑不起来,设置视图引擎
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));

app.use(session({
  name:'blogOfLiyang',
  maxAge: 1000*60*60,
  secret: 'liyang-web-node-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use('/login',require('./routes/login'));
app.use('/', authority.isAuthenticated,routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
