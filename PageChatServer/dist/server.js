'use strict';

var http = require('http');
var express = require('express');
var app = express();
var cors = require('cors');
var routers = require('./routers');
var bodyParser = require('body-parser');
var WebSocketServer,
    _require = require('uws'),
    Server = _require.Server;
var path = require('path');

var _require2 = require('../package.json'),
    version = _require2.version;

app.server = http.createServer(app);

app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.wss = new Server({
    server: app.server
});

var wwwPath = path.join(__dirname, 'www');
app.use('/', express.static(wwwPath));
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(routers);

module.exports = app;
//# sourceMappingURL=server.js.map