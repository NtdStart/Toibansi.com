import _ from 'lodash'

export default class ConversationModel {

    constructor(converstation) {
        this.converstation = converstation;
    }


    onAdd(payload, key) {
        let id, can_reply, snippet, senders, userFbId, avatar;
        if (key==='inbox') {
            id = `${payload.id}`;
            can_reply = `${payload.can_reply}`;
            snippet = `${payload.snippet}`;
            senders = `${payload.senders.data[0].name}`;
            userFbId = `${payload.senders.data[0].id}`;
            avatar = 'https://graph.facebook.com/' + userFbId + '/picture?width=70&height=70';
            let conversation = {
                _id: id,
                snippet: snippet,
                senders: senders,
                avatar: avatar,
                can_reply: can_reply,
                type: 'FBMessage'
            };
            this.converstation.add(id, conversation);
        }
        if (key==='comment') {
            _.each(payload.data, (c) => {
                id = `${c.id}`;
                can_reply = `${c.can_comment}`;
                snippet = (c.comment_count>0)? c.comments.data[c.comment_count-1].message : c.message;
                senders = `${c.from.name}`;
                userFbId = `${c.from.id}`;
                avatar = 'https://graph.facebook.com/' + userFbId + '/picture?width=70&height=70';
                let conversation = {
                    _id: id,
                    snippet: snippet,
                    senders: senders,
                    avatar: avatar,
                    can_reply: can_reply,
                    type: 'FBComment'
                };
                this.converstation.add(id, conversation);
            });
        }
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