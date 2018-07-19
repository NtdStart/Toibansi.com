'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _mongodb = require('mongodb');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wsConnection = function () {
    function wsConnection(app) {
        _classCallCheck(this, wsConnection);

        this.app = app;
        this.connections = (0, _immutable.OrderedMap)();
        this.didLoad();
    }

    _createClass(wsConnection, [{
        key: 'decodeMesasge',
        value: function decodeMesasge(msg) {
            var messageObject = null;
            try {
                messageObject = JSON.parse(msg);
            } catch (err) {
                console.log("An error decode the socket mesage", msg);
            }
            return messageObject;
        }
    }, {
        key: 'sendAll',
        value: function sendAll(obj) {
            var _this = this;

            // send socket messages to all clients.
            this.connections.forEach(function (con, key) {
                var ws = con.ws;
                _this.send(ws, obj);
            });
        }
    }, {
        key: 'send',
        value: function send(ws, obj) {
            var message = JSON.stringify(obj);
            ws.send(message);
        }
    }, {
        key: 'doTheJob',
        value: function doTheJob(socketId, msg) {
            var action = _lodash2.default.get(msg, 'action');
            var payload = _lodash2.default.get(msg, 'payload');

            switch (action) {
                case 'broadcast':
                    this.sendAll(payload);
                    break;
                default:
                    break;
            }
        }
    }, {
        key: 'didLoad',
        value: function didLoad() {
            var _this2 = this;

            this.app.wss.on('connection', function (ws) {
                var socketId = new _mongodb.ObjectID().toString();
                console.log("Someone connected to the server via socket.", socketId);
                var clientConnection = {
                    _id: '' + socketId,
                    ws: ws,
                    userId: null,
                    isAuthenticated: false
                    // save this connection client to cache.
                };_this2.connections = _this2.connections.set(socketId, clientConnection);
                // listen any message from websocket client.
                ws.on('message', function (msg) {
                    var message = _this2.decodeMesasge(msg);
                    _this2.doTheJob(socketId, message);
                });

                ws.on('close', function () {
                    //console.log("Someone disconnected to the server", socketId);
                    var closeConnection = _this2.connections.get(socketId);
                    // let remove this socket client from the cache collection.
                    _this2.connections = _this2.connections.remove(socketId);
                });
            });
        }
    }]);

    return wsConnection;
}();

exports.default = wsConnection;
//# sourceMappingURL=wsConnection.js.map