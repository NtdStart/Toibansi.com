'use strict';

// Chat application dependencies
var express = require('express');
var cons = require('consolidate');
var app = express();
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// Chat application components
var routes = require('./app/routes');
var logger = require('./app/logger');

// Set the port number
var port = process.env.PORT || 3001;

app.engine('html', cons.swig);
// set .html as the default extension
// View engine setup
app.set('view engine', 'html');
app.set('views', __dirname + '/src/views');

// Middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.use('/', routes);

// Middleware to catch 404 errors
app.use(function (req, res, next) {
    res.status(404).sendFile(process.cwd() + '/src/views/404.htm');
});

app.listen(port);