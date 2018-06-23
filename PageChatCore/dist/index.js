'use strict';

// Chat application dependencies

Object.defineProperty(exports, "__esModule", {
    value: true
});
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// Chat application components
var routes = require('./routes');
var session = require('./session');
var passport = require('./auth');
var logger = require('./logger');

// Set the port number
var PORT = 3001;
var port = process.env.PORT || PORT;

// View engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

app.listen(process.env.PORT || PORT, function () {
    console.log('App is running on port ' + port);
});

exports.default = app;
//# sourceMappingURL=index.js.map