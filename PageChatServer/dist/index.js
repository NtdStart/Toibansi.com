'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _uws = require('uws');

var _uws2 = _interopRequireDefault(_uws);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routers = require('./routers');

var _routers2 = _interopRequireDefault(_routers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 3001;
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

//app.use(morgan('dev'));


app.use((0, _cors2.default)({
    exposedHeaders: "*"
}));

app.use(_bodyParser2.default.json({
    limit: '50mb'
}));
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.wss = new _uws.Server({
    server: app.server
});

// static www files use express
var wwwPath = _path2.default.join(__dirname, 'www');

app.use('/', _express2.default.static(wwwPath));

app.routers = new _routers2.default(app);

app.server.listen(process.env.PORT || PORT, function () {
    console.log('App is running on port ' + app.server.address().port);
});

exports.default = app;
//# sourceMappingURL=index.js.map