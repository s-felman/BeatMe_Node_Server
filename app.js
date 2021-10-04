var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose= require('mongoose')
var app = express();


//const routes
var indexRouter = require('./api/routes/index');
var usersRouter = require('./api/routes/users');
var competitionsRouter = require('./api/routes/competitions');

mongoose.connect(`mongodb://localhost:27017/BeatMeDB`, {
    // useUnifiedTopology: true,
    // useCreateIndex: true
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected!');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use('/uploads',express.static('uploads'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3001');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/competitons', competitionsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
