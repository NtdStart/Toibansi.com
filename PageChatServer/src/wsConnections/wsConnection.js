import {OrderedMap} from 'immutable'
import {ObjectID} from 'mongodb'
import _ from 'lodash'

export default class wsConnection {

    constructor(app) {
        this.app = app;
        this.connections = OrderedMap();
        this.didLoad();
    }

    decodeMesasge(msg) {
        let messageObject = null;
        try {
            messageObject = JSON.parse(msg);
        }
        catch (err) {
            console.log("An error decode the socket mesage", msg);
        }
        return messageObject;
    }

    sendAll(obj) {
        // send socket messages to all clients.
        this.connections.forEach((con, key) => {
            const ws = con.ws;
            this.send(ws, obj);
        });
    }

    send(ws, obj) {
        const message = JSON.stringify(obj);
        ws.send(message);
    }

    doTheJob(socketId, msg) {
        const action = _.get(msg, 'action');
        const payload = _.get(msg, 'payload');

        switch (action) {
            case 'broadcast':
                this.sendAll(payload);
                break;
            default:
                break;
        }
    }

    didLoad() {
        this.app.wss.on('connection', (ws) => {
            const socketId = new ObjectID().toString();
            console.log("Someone connected to the server via socket.", socketId)
            const clientConnection = {
                _id: `${socketId}`,
                ws: ws,
                userId: null,
                isAuthenticated: false,
            }
            // save this connection client to cache.
            this.connections = this.connections.set(socketId, clientConnection);
            // listen any message from websocket client.
            ws.on('message', (msg) => {
                const message = this.decodeMesasge(msg);
                this.doTheJob(socketId, message);
            });

            ws.on('close', () => {
                //console.log("Someone disconnected to the server", socketId);
                const closeConnection = this.connections.get(socketId);
                // let remove this socket client from the cache collection.
                this.connections = this.connections.remove(socketId);
            });
        });
    }
}