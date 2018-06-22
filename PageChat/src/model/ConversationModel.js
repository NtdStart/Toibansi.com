import _ from 'lodash'
import {parseUnixTime} from '../helpers/functions.js';

export default class ConversationModel {

    constructor(converstation) {
        this.converstation = converstation;
        this.pageId = null;
    }

    onAdd(payload, key) {
        let id, can_reply, snippet, senders, userFbId, avatar, updated_time, last_reply;
        if (key==='inbox') {
            id = `${payload.id}`;
            can_reply = `${payload.can_reply}`;
            snippet = `${payload.snippet}`;
            senders = `${payload.senders.data[0].name}`;
            userFbId = `${payload.senders.data[0].id}`;
            updated_time = `${payload.updated_time}`;
            avatar = 'https://graph.facebook.com/' + userFbId + '/picture?width=70&height=70';
            let conversation = {
                _id: id,
                snippet: snippet,
                senders: senders,
                avatar: avatar,
                can_reply: can_reply,
                type: 'FBMessage',
                last_reply: true,
                unix_time: updated_time,
                updated_time: parseUnixTime(updated_time),
            };
            this.converstation.add(id, conversation);
        }
        if (key==='comment') {
            _.each(payload.data, (c) => {
                id = `${c.id}`;
                can_reply = `${c.can_comment}`;
                last_reply = (c.comment_count>0)? this.checkLastReply(c.comments.data[c.comment_count-1].from.id) : false;
                snippet = (c.comment_count>0)? c.comments.data[c.comment_count-1].message : c.message;
                senders = `${c.from.name}`;
                userFbId = `${c.from.id}`;
                updated_time = (c.comment_count>0)? c.comments.data[c.comment_count-1].created_time : c.created_time;
                avatar = 'https://graph.facebook.com/' + userFbId + '/picture?width=70&height=70';
                if (typeof c.attachment!=='undefined') snippet = c.attachment.type;
                let conversation = {
                    _id: id,
                    snippet: snippet,
                    senders: senders,
                    avatar: avatar,
                    can_reply: can_reply,
                    type: 'FBComment',
                    unix_time: updated_time,
                    updated_time: parseUnixTime(updated_time),
                    last_reply: last_reply
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

    checkLastReply(from_id){
        return this.pageId === from_id;
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