require("dotenv").config(); // load env file
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expHbs = require('express3-handlebars');
const Handlebars = require("handlebars")
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
const mongoose = require('mongoose');
const async = require("async");

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const { equal } = require('handlebars-helpers')();

const flash = require("express-flash");
const session = require('express-session');

const app = express();


// Set up session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Set up flash middleware
app.use(flash());

/**
 * Make MongoDB connection
 */
(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/lms');
})();

app.engine('hbs', expHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
