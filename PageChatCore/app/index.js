var express = require('express');
var app = express();
var routers = require('./routers');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routers);

module.exports = app;