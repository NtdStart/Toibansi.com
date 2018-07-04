import {OrderedMap} from 'immutable'
import _ from 'lodash'
import Service from '../services/service'
import FacebookAPI from '../services/FacebookAPI'
import Realtime from '../realtime/realtime'
import ConversationModel from '../model/ConversationModel'
import CommentModel from '../model/CommentModel'


export default class ConversationController {
    constructor(appComponent) {
        this.app = appComponent;
        this.service = new Service();
        this.callFacebookAPI = new FacebookAPI();
        this.activeChannelId = null;
        this.activeChannelType = null;
        this.realtime = new Realtime(this);
        this.conversations = new OrderedMap();
        this.converstation = new ConversationModel(this);
        this.comments = new OrderedMap();
        this.comment = new CommentModel(this);
        this.nextConversation = null;
        this.nextMessage = null;
        this.isLoading = false;
        this.fetchConversations();
    }

    fetchConversations() {
        this.isLoading = true;
        this.callFacebookAPI.getConversations(this.nextConversation, null).then((response) => {
            this.nextConversation = (response.data.paging.next) ? response.data.paging.cursors.after : null;
            const con = response.data.data;
            _.each(con, (c) => {
                this.converstation.onAdd(c, 'inbox');
            });
            this.isLoading = false;
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }

    fetchConversationAndComment() {
        this.isLoading = true;
        this.callFacebookAPI.get_conversation_comment(this.nextConversation, null).then((response) => {
            this.nextConversation = (response.data.paging.next) ? response.data.paging.cursors.after : null;
            const channels = response.data.data;
            _.each(channels, (c) => {
                this.converstation.onAdd(c, 'inbox');
                this.addItem(c.id, this.converstation);
            });
            this.isLoading = false;
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }

    fetchComments() {
        this.isLoading = true;
        this.callFacebookAPI.getComments(this.nextConversation, null).then((response) => {
            this.nextConversation = (response.data.paging.next) ? response.data.paging.cursors.after : null;
            const channels = response.data.data;
            _.each(channels, (c) => {
                if (typeof c.comments !== 'undefined')
                    this.converstation.onAdd(c.comments, 'comment');
            });
            this.isLoading = false;
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }

    loadUserAvatar(user) {
        return `https://api.adorable.io/avatars/100/${user._id}.png`
    }


    setActiveConversation(id, type) {
        if (this.activeChannelId === id) return false;
        this.activeChannelId = id;
        this.activeChannelType = type;
        this.resetCursor();
        this.getMessagesFromConversation();
        this.update();
        // console.log("ActiveConversation Id ", id);
    }

    getActiveConversation() {
        const conversation = this.conversations ? this.conversations.get(this.activeChannelId) : this.conversations.first();
        return conversation;
    }


    getActiveChannelId() {
        return this.activeChannelId;
    }

    setMessage(message, notify = false) {
        const id = _.toString(_.get(message, '_id'));
        this.messages = this.messages.set(id, message);
        const channelId = _.toString(message.channelId);
        const channel = this.conversations.get(channelId);
        if (channel) {
            channel.messages = channel.messages.set(id, true);
            channel.lastMessage = _.get(message, 'body', '');
            channel.notify = notify;
            this.conversations = this.conversations.set(channelId, channel);
        } else {
            // fetch to the server with channel info
            this.service.get(`api/channels/${channelId}`).then((response) => {
                const channel = _.get(response, 'data');
                /*const users = _.get(channel, 'users');
                _.each(users, (user) => {
                    this.addUserToCache(user);
                });*/
                this.realtime.onAddChannel(channel);
            })
        }
        this.update();
    }

    addMessage(id, message = {}) {
        // we need add user object who is author of this message
        const user = this.getCurrentUser();
        message.user = user;
        this.messages = this.messages.set(id, message);
        // let's add new message id to current channel->messages.
        const channelId = _.get(message, 'channelId');
        if (channelId) {
            let channel = this.conversations.get(channelId);
            channel.lastMessage = _.get(message, 'body', '');
            // now send this channel info to the server
            const obj = {
                action: 'create_channel',
                payload: channel,
            };
            this.realtime.send(obj);
            //console.log("channel:", channel);
            // send to the server via websocket to creawte new message and notify to other members.
            this.realtime.send(
                {
                    action: 'create_message',
                    payload: message,
                }
            );
            channel.messages = channel.messages.set(id, true);
            channel.isNew = false;
            this.conversations = this.conversations.set(channelId, channel);
        }
        this.update();
        // console.log(JSON.stringify(this.messages.toJS()));
    }

    sendMessage(id, message = {}) {
        // we need add user object who is author of this message
        const user = this.getCurrentUser();
        message.user = user;
        this.messages = this.messages.set(id, message);
        // let's add new message id to current channel->messages.
        const channelId = _.get(message, 'channelId');
        if (channelId) {
            let message_send = _.get(message, 'body');
            // now send this channel info to the server
            this.callFacebookAPI.sendMessage(channelId, message_send, null).then((response) => {
                this.update();
            }).catch((err) => {
                console.log("An error sending message", err);
            })
        }
    }

    postComment(id, message = {}) {
        // we need add user object who is author of this message
        const user = this.getCurrentUser();
        message.user = user;
        this.messages = this.messages.set(id, message);
        // let's add new message id to current channel->messages.
        const channelId = _.get(message, 'channelId');
        if (channelId) {
            let message_send = _.get(message, 'body');
            // now send this channel info to the server
            this.callFacebookAPI.postComment(channelId, message_send, null).then((response) => {
                this.update();
            }).catch((err) => {
                console.log("An error posting comment", err);
            })
        }
    }

    getMessagesFromConversation() {
        this.isLoading = true;
        let activeChannel = this.activeChannelId;
        let type = this.activeChannelType;
        if (null == activeChannel) {
            return new OrderedMap();
        } else {
            let req = (type === 'FBMessage') ? this.callFacebookAPI.getMessage(activeChannel, this.nextMessage, null) : this.callFacebookAPI.getReplyComment(activeChannel, this.nextMessage, null);
            let messages = [];
            req.then((response) => {
                this.isLoading = false;
                if (type === 'FBMessage') {
                    this.nextMessage = (response.data.paging.next) ? response.data.paging.cursors.after : null;
                } else if (response.data.comment_count > 0) {
                    this.nextMessage = (response.data.comments.paging.next) ? response.data.comments.paging.cursors.after : null;
                }
                if (type === 'FBComment') {
                    const res = response.data;
                    messages = (res.comment_count > 0) ? response.data.comments.data : [];
                    let item = {
                        id: res.id,
                        created_time: res.created_time,
                        from: res.from,
                        message: res.message
                    };
                    if (typeof res.attachment !== 'undefined') {
                        item['attachment'] = {
                            type: res.attachment.type,
                            media: res.attachment.media
                        }
                    }
                    messages.push(item)
                } else {
                    messages = response.data.data;
                }
                _.each(messages, (mess) => {
                    this.getActiveConversation().message.onAdd(mess, type);
                });
            }).catch((err) => {
                console.log("An error fetching user conversations", err);
            })
        }
    }


    addItem(index, conversation) {
        this.conversations = this.conversations.set(index, conversation);
        this.update();
    }


    getConversations() {
        this.conversations = this.conversations.sort((a, b) => a.unix_time < b.unix_time);
        return this.conversations.valueSeq().toArray();
    }

    resetCursor() {
        this.nextConversation = null;
        this.nextMessage = null;
    }

    update() {
        this.app.forceUpdate();
    }
}