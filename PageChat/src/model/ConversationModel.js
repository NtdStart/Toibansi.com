
export default class ConversationModel {

    constructor(converstation) {
        this.converstation = converstation;
    }


    onAdd(payload) {
        const id = `${payload.id}`;
        const can_reply = `${payload.can_reply}`;
        const snippet = `${payload.snippet}`;
        const senders = `${payload.senders.data[0].name}`;
        const userFbId = `${payload.senders.data[0].id}`;
        const avatar = 'https://graph.facebook.com/' + userFbId + '/picture?width=70&height=70';
        let conversation = {
            _id: id,
            snippet: snippet,
            senders: senders,
            avatar: avatar,
            can_reply: can_reply,
        };
        this.converstation.add(id, conversation);
    }

    send(msg = {}) {
        const isConnected = this.isConnected;
        if (this.ws && isConnected) {
            const msgString = JSON.stringify(msg);
            this.ws.send(msgString);
        }
    }

    authentication() {
        const conversation = this.converstation;
        const tokenId = conversation.getUserTokenId();
        if (tokenId) {
            const message = {
                action: 'auth',
                payload: `${tokenId}`
            }
            this.send(message);
        }

    }

}