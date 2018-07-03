var express = require('express');
var app = express();
var db = require('./db/db');
var routers = require('./routers/index')
var UserController = require('./user/UserController');
app.use(routers);
app.use('/users', UserController);

module.exports = app;