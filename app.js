var createError = require("http-errors");

// var http = require('http');   // -----


var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// import express-validator library
var expressValidator = require("express-validator");

var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");
require("./passport");
var config = require("./config");
// var { body, validationResult } = require("express-validator");
var indexRoute = require("./routes/index");
var authRoute = require("./routes/auth");
var taskRoute = require("./routes/task");

mongoose
  .connect(config.dbConnstring)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.error("Database connection error:", err));

global.User = require("./models/user");
global.Task = require("./models/task");

var app = express();

// var server = http.createServer(app); // -----


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
    // cookie: {secure: true}
  })
);
app.use(passport.initialize());
app.use(passport.session());
// use express validator
// app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public")));
// creating a session variable
app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next(); // move to the next blocks
});

app.use("/", indexRoute);
app.use("/", authRoute);
app.use("/", taskRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new createError(404, "page not found!");
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
