var express = require("express");
var createError = require('http-errors');
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);
var auth = require("./middlewares/auth");
var passport =require("passport");

require("dotenv").config();

require("./config/passport");

var uri = process.env.MONGODB_URL;

mongoose.connect(uri,
{ useNewUrlParser : true, useUnifiedTopology : true },
(err) => {
    console.log(err ? err : "Connected");
});

const app = express();

var port = normalizePort(process.env.PORT || '3030');

// built in middlewares

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.use(session({
  secret : process.env.SESSION_SECRET,
  saveUninitialized : false,
  resave : true,
  store : new MongoStore({mongooseConnection : mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.currentLoggedUserInfo);
app.use(auth.urlInfo);

app.use((req,res,next) => {
  console.log(req.session);
  next();
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routing middlewares

app.use("/", require("./routers/index"));
app.use("/articles", require("./routers/articles"));
app.use("/users", require("./routers/users"));
app.use("/auth", require("./routers/auth"));

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

app.listen(port);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }