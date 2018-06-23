'use strict';

var config = require('../config');

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
var ioEvents = function ioEvents(io) {

	// Rooms namespace
	io.of('/rooms').on('connection', function (socket) {
		// Create a new room
		socket.on('createRoom', function (title) {});
	});

	// Chatroom namespace
	io.of('/chatroom').on('connection', function (socket) {
		// Join a chatroom
		socket.on('join', function (roomId) {});
		// When a socket exits
		socket.on('disconnect', function () {
			// Check if user exists in the session
			if (socket.request.session.passport == null) {
				return;
			}
			// Find the room to which the socket is connected to,
			// and remove the current user + socket from this room
		});

		// When a new message arrives
		socket.on('newMessage', function (roomId, message) {
			// No need to emit 'addMessage' to the current socket
			// As the new message will be added manually in 'main.js' file
			// socket.emit('addMessage', message);
			socket.broadcast.to(roomId).emit('addMessage', message);
		});
	});
};

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var init = function init(app) {

	var server = require('http').Server(app);
	var io = require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	io.set('transports', ['websocket']);

	// Using Redis
	// let port = config.redis.port;
	// let host = config.redis.host;
	// let password = config.redis.password;
	// let pubClient = redis(port, host, { auth_pass: password });
	// let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	// io.adapter(adapter({ pubClient, subClient }));

	// Allow sockets to access session data
	io.use(function (socket, next) {
		require('../session')(socket.request, {}, next);
	});

	// Define all Events
	ioEvents(io);

	// The server object will be then used to list to a port number
	return server;
};

module.exports = init;
//# sourceMappingURL=index.js.map