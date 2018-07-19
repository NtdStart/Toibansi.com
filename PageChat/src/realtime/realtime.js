import {websocketUrl} from '../config/config'

export default class Realtime {
    constructor(app) {
        this.app = app;
        this.ws = null;
        this.isConnected = false;
        this.connect();
        // this.reconnect();
    }

    reconnect() {
        window.setInterval(() => {
            this.connect();
        }, 3000)
    }

    decodeMessage(msg) {
        let message = {};

        try {
            message = JSON.parse(msg);

        }
        catch (err) {
            console.log(err);
        }

        return message;
    }

    send(msg = {}) {
        const isConnected = this.isConnected;
        if (this.ws && isConnected) {
            const msgString = JSON.stringify(msg);
            this.ws.send(msgString);
        }

    }

    connect() {
        console.log("Begin connecting to server via websocket.");
        const ws = new WebSocket(websocketUrl);
        this.ws = ws;
        ws.onopen = () => {
            console.log("You are connected");
            this.isConnected = true;
            ws.onmessage = (event) => {
                const data = this.decodeMessage(event.data);
                this.app.updateMessage(data.conversationId, data.msgId);
                console.log("Message from the server: ", data.conversationId);
            }
        }

        ws.onclose = () => {
            console.log("You disconnected!!!");
            this.isConnected = false;
            // this.app.update();
        }

        ws.onerror = () => {
            this.isConnected = false;
            // this.app.update();
        }


    }
}