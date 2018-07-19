import {OrderedMap, Map, List} from 'immutable'
import _ from 'lodash'
import FacebookAPI from '../services/FacebookAPI'
import MessageModel from '../model/MesagesModel'
import ConversationModel from '../model/ConversationModel'
import CommentModel from '../model/CommentModel'
import Realtime from '../realtime/realtime'

export default class ConversationController {
    constructor(appComponent) {
        this.app = appComponent;
        this.callFacebookAPI = new FacebookAPI();
        this.activeChannelId = null;
        this.activeChannelType = null;
        this.user = null;
        this.comments = new OrderedMap();
        this.comment = new CommentModel(this);
        this.message = new MessageModel(this);
        this.pageId = this.callFacebookAPI.getPageId();
        this.nextConversation = null;
        this.nextMessage = null;
        this.isLoading = false;


        this.conversationsMap = new Map();
        this.messagesMap = new Map();
        this.messages = new List();
        this.conversation = new ConversationModel(this);
        this.conversation.pageId = this.message.mine = this.pageId;


        this.realtime = new Realtime(this);

        // this.fetchConversationAndComment();
    }


    fetchConversations() {
        this.isLoading = true;
        this.callFacebookAPI.getConversations(this.nextConversation, null).then((response) => {
            this.nextConversation = (response.data.paging.next) ? response.data.paging.cursors.after : null;
            const conversations = response.data.data;
            _.each(conversations, (c) => {
                this.conversation.init(c, 'inbox');
            });
            this.isLoading = false;
            this.update();
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }

    fetchConversationAndComment() {
        this.isLoading = true;
        let conversations = this.callFacebookAPI.getConversations(this.nextConversation, null);
        let comments = this.callFacebookAPI.getComments(this.nextConversation, null);
        Promise.all([conversations, comments])
            .then(response => {
                let conversations = response[0].data.data;
                _.each(conversations, (c) => {
                    this.conversation.init(c, 'inbox');
                });

                let comments = response[1].data.data;
                _.each(comments, (c) => {
                    if (typeof c.comments !== 'undefined')
                        this.conversation.init(c.comments, 'comment');
                });
                this.isLoading = false;
            })
            .catch(err => {
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
                    this.conversation.init(c.comments, 'comment');
            });
            this.isLoading = false;
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }


    setActiveConversation(id, type) {
        if (this.activeChannelId === id) return false;
        this.activeChannelId = id;
        this.conversation.conversation.unread = 0;
        this.activeChannelType = type;
        this.resetCursor();
        this.getMessagesFromConversation();
    }

    getActiveConversation() {
        const conversation = this.conversationsMap.get(this.activeChannelId);
        return conversation;
    }

    getActiveChannelId() {
        return this.activeChannelId;
    }


    updateMessage(conversationId, msgId) {
        this.callFacebookAPI.getMessageById(msgId, null).then((res) => {
            let msg = _.get(res, 'data');
            this.message.onAdd(msg, 'inbox');
            this.addMsgToMap(conversationId, this.messages);
            let currentConversation = this.conversationsMap.get(conversationId);
            let conversation = {
                id: conversationId,
                can_reply: currentConversation.can_reply,
                snippet: msg.message,
                updated_time: new Date().getTime() / 1000,
                unread_count: currentConversation.unread + 1,
                last_reply: true,
                senders: {
                    data: [
                        {
                            name: currentConversation.senders,
                            id: currentConversation.userFbId
                        }
                    ]
                }
            };
            this.conversation.init(conversation, 'inbox');
            this.update();

        }).catch((err) => {
            console.log("An error fetching message", err);
        })

    }


    sendMessage(conversationId, message = {}, callback) {
        if (conversationId) {
            let message_send = _.get(message, 'body');
            this.callFacebookAPI.sendMessage(conversationId, message_send, null).then((response) => {
                    let broadcastMsg = {
                        conversationId: conversationId,
                        msgId: response.data.id
                    };
                    this.realtime.send(
                        {
                            action: 'broadcast',
                            payload: broadcastMsg
                        }
                    );
                }
            ).catch((err) => {
                console.log("An error sending message", err);
            })
        }
    }

    postComment(id, message = {}) {
        const channelId = _.get(message, 'channelId');
        if (channelId) {
            let message_send = _.get(message, 'body');
            this.callFacebookAPI.postComment(channelId, message_send, null).then(response => {
                this.callFacebookAPI.getCommentById(response.data.id, null).then((res) => {
                    let newComment = _.get(res, 'data');

                    this.message.onAdd(newComment, 'comment');

                    let currentChannel = this.conversations.get(this.activeChannelId);

                    let conversation = {
                        data: [
                            {
                                id: this.activeChannelId,
                                can_comment: 1,
                                comment_count: 1,
                                comments: {
                                    data: [
                                        {
                                            created_time: new Date().getTime() / 1000,
                                            from: {
                                                id: this.callFacebookAPI.getPageId(),
                                                created_time: new Date().getTime() / 1000,
                                            },
                                            message: message.message
                                        }
                                    ]
                                },
                                from: {
                                    name: currentChannel.senders,
                                    id: currentChannel.userFbId
                                },
                                unread_count: 0,
                                last_reply: true
                            }
                        ]
                    }

                    this.conversation.init(conversation, 'comment');
                }).catch((err) => {
                    console.log("An error fetching comment", err);
                })
            }).catch((err) => {
                console.log("An error posting comment", err);
            })
        }
    }

    getMoreMessages() {
        this.isLoading = true;
        let activeChannel = this.activeChannelId;
        this.messages = this.messagesMap.get(activeChannel);
        if (undefined === this.messages) {
            this.messages = new List();
        }
        let type = this.activeChannelType;
        if (null === activeChannel) {
            return new List();
        } else {
            let req = (type === 'FBMessage') ? this.callFacebookAPI.getMessage(activeChannel, this.nextMessage, null) : this.callFacebookAPI.getReplyComment(activeChannel, this.nextMessage, null);
            req.then((response) => {
                this.isLoading = false;
                if (type === 'FBMessage') {
                    this.nextMessage = (response.data.paging.next) ? response.data.paging.cursors.after : null;
                } else if (response.data.comment_count > 0) {
                    this.nextMessage = (response.data.comments.paging.next) ? response.data.comments.paging.cursors.after : null;
                }
                let messagesList = response.data.data;
                _.each(messagesList, (mess) => {
                    this.message.onAdd(mess, type);
                });
                if (undefined !== this.messages && this.messages.size > 0) {
                    this.addMsgToMap(activeChannel, this.messages);
                    this.update();
                }
                return new List();
            }).catch((err) => {
                console.log("An error fetching user conversations", err);
            })
        }
    }

    getMessagesFromConversation() {
        this.isLoading = true;
        let activeChannel = this.activeChannelId;
        this.messages = new List();
        this.messagesMap = this.messagesMap.delete(activeChannel);
        let type = this.activeChannelType;
        if (null === activeChannel) {
            return new List();
        } else {
            let req = (type === 'FBMessage') ? this.callFacebookAPI.getMessage(activeChannel, this.nextMessage, null) : this.callFacebookAPI.getReplyComment(activeChannel, this.nextMessage, null);
            req.then((response) => {
                this.isLoading = false;
                if (type === 'FBMessage') {
                    this.nextMessage = (response.data.paging.next) ? response.data.paging.cursors.after : null;
                } else if (response.data.comment_count > 0) {
                    this.nextMessage = (response.data.comments.paging.next) ? response.data.comments.paging.cursors.after : null;
                }
                let messagesList = [];
                if (type === 'FBComment') {
                    const res = response.data;
                    messagesList = (res.comment_count > 0) ? response.data.comments.data : [];
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
                    messagesList.push(item)
                } else {
                    messagesList = response.data.data;
                }
                _.each(messagesList, (mess) => {
                    this.message.onAdd(mess, type);
                });
                if (undefined !== this.messages && this.messages.size > 0) {
                    this.addMsgToMap(activeChannel, this.messages);
                    this.update();
                }
                return new List();
            }).catch((err) => {
                console.log("An error fetching user conversations", err);
            })
        }
    }

    getMessages(activeChannel) {
        this.messages = this.messagesMap.get(activeChannel);
        return this.messages;
    }


    addConversation(index, conversation) {
        this.conversationsMap = this.conversationsMap.set(index, conversation);
    }


    addMess(index, mess) {
        if (undefined === this.messages) {
            this.messages = new List();
        }
        this.messages = this.messages.push(mess);
    }

    addMsgToMap(index, mess) {
        this.messagesMap = this.messagesMap.set(index, mess);
    }

    getConversations() {
        let conversations = this.conversationsMap.valueSeq().toArray();
        return conversations;
    }

    resetCursor() {
        this.nextConversation = null;
        this.nextMessage = null;
    }

    resetChannel() {
        this.activeChannelId = null;
        this.activeChannelType = null;
        this.messages = new List();
    }

    update() {
        this.app.forceUpdate()
    }
}