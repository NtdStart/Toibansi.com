import {OrderedMap} from 'immutable'
import _ from 'lodash'
import Service from '../services/service'
import CallFacebookAPI from '../services/CallFacebookAPI'
import MessageModel from '../model/MesagesModel'
import Realtime from '../realtime/realtime'
import ConversationModel from '../model/ConversationModel'
import CommentModel from '../model/CommentModel'


export default class ConversationController {
    constructor(appComponent) {
        this.app = appComponent;
        this.service = new Service();
        this.callFacebookAPI = new CallFacebookAPI();
        this.activeChannelId = null;
        this.activeChannelType = null;
        this.token = this.getTokenFromLocalStore();
        this.user = this.getUserFromLocalStorage();
        this.users = new OrderedMap();
        this.search = {
            users: new OrderedMap(),
        }
        this.realtime = new Realtime(this);
        this.conversations = new OrderedMap();
        this.converstation = new ConversationModel(this);
        this.messages = new OrderedMap();
        this.comments = new OrderedMap();
        this.comment = new CommentModel(this);
        this.message = new MessageModel(this);
        this.pageId = this.callFacebookAPI.getPageId();
        this.converstation.pageId = this.message.mine = this.pageId;
        this.nextConversation = null;
        this.nextMessage = null;
        this.isLoading = false;
        this.fetchConversationAndComment();
    }

    isConnected() {
        return this.realtime.isConnected;
    }

    handleSocket(data) {
        console.log(data)
        if (typeof data.entry[0].messaging !== 'undefined') {
            let mess = data.entry[0].messaging[0];
            let message = {
                snippet: mess.message.text,
                updated_time: mess.timestamp,
                senders: {
                    data: [
                        {
                            id: mess.sender.id,
                            name: 'xxx'
                        }
                    ]
                },
                type: 'FBMessage',
                unread_count: 1,
                can_reply: 1
            }
            this.converstation.onAdd(message, 'inbox');
        }

        if (typeof data.entry[0].changes !== 'undefined') {

        }
    }

    fetchConversations() {
        this.isLoading = true;
        this.callFacebookAPI.getConversations(this.nextConversation, null).then((response) => {
            this.nextConversation = (response.data.paging.next)? response.data.paging.cursors.after : null;
            const channels = response.data.data;
            _.each(channels, (c) => {
                this.converstation.onAdd(c, 'inbox');
            });
            this.isLoading = false;
        }).catch((err) => {
            console.log("An error fetching user conversations", err);
        })
    }

    fetchConversationAndComment() {
        this.isLoading = true;
        let conversations = this.callFacebookAPI.getConversations(this.nextConversation, null);
        let comments = this.callFacebookAPI.getComments(this.nextConversation,null);
        Promise.all([conversations, comments])
            .then(response => {
                let conversations = response[0].data.data;
                _.each(conversations, (c) => {
                    this.converstation.onAdd(c, 'inbox');
                });

                let comments = response[1].data.data;
                _.each(comments, (c) => {
                    if (typeof c.comments !== 'undefined')
                        this.converstation.onAdd(c.comments, 'comment');
                });
                this.isLoading = false;
            })
            .catch(err => {
                console.log("An error fetching user conversations", err);
            })
    }

    fetchComments() {
        this.isLoading = true;
        this.callFacebookAPI.getComments(this.nextConversation,null).then((response) => {
            this.nextConversation = (response.data.paging.next)? response.data.paging.cursors.after : null;
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


    addUserToCache(user) {
        user.avatar = this.loadUserAvatar(user);
        const id = _.toString(user._id);
        this.users = this.users.set(id, user);
        return user;
    }

    getUserTokenId() {
        return _.get(this.token, '_id', null);
    }

    loadUserAvatar(user) {
        return `https://api.adorable.io/avatars/100/${user._id}.png`
    }

    startSearchUsers(q = "") {

        // query to backend servr and get list of users.
        const data = {search: q};

        this.search.users = this.search.users.clear();

        this.service.post('api/users/search', data).then((response) => {

            // list of users matched.
            const users = _.get(response, 'data', []);

            _.each(users, (user) => {

                // cache to this.users
                // add user to this.search.users

                user.avatar = this.loadUserAvatar(user);
                const userId = `${user._id}`;

                this.users = this.users.set(userId, user);
                this.search.users = this.search.users.set(userId, user);


            });


            // update component
            this.update();


        }).catch((err) => {


            //console.log("searching errror", err);
        })

    }

    setUserToken(accessToken) {

        if (!accessToken) {

            this.localStorage.removeItem('token');
            this.token = null;

            return;
        }

        this.token = accessToken;
        localStorage.setItem('token', JSON.stringify(accessToken));

    }

    getTokenFromLocalStore() {


        if (this.token) {
            return this.token;
        }

        let token = null;

        const data = localStorage.getItem('token');
        if (data) {

            try {

                token = JSON.parse(data);
            }
            catch (err) {

                console.log(err);
            }
        }

        return token;
    }

    getUserFromLocalStorage() {

        let user = null;
        const data = localStorage.getItem('me');
        try {

            user = JSON.parse(data);
        }
        catch (err) {

            console.log(err);
        }


        if (user) {

            // try to connect to backend server and verify this user is exist.
            const token = this.getTokenFromLocalStore();
            const tokenId = _.get(token, '_id');

            const options = {
                headers: {
                    authorization: tokenId,
                }
            }
            this.service.get('api/users/me', options).then((response) => {

                // this mean user is logged with this token id.

                const accessToken = response.data;
                const user = _.get(accessToken, 'user');

                this.setCurrentUser(user);
                this.setUserToken(accessToken);

            }).catch(err => {

                this.signOut();

            });

        }
        return user;
    }

    setCurrentUser(user) {


        // set temporary user avatar image url
        user.avatar = this.loadUserAvatar(user);
        this.user = user;


        if (user) {
            localStorage.setItem('me', JSON.stringify(user));

            // save this user to our users collections in local
            const userId = `${user._id}`;
            this.users = this.users.set(userId, user);
        }

        this.update();

    }

    clearCacheData() {
        this.conversations = this.conversations.clear();
        this.messages = this.messages.clear();
        this.users = this.users.clear();
    }

    signOut() {

        const userId = _.toString(_.get(this.user, '_id', null));
        const tokenId = _.get(this.token, '_id', null); //this.token._id;
        // request to backend and loggout this user

        const options = {
            headers: {
                authorization: tokenId,
            }
        };

        this.service.get('api/me/logout', options);

        this.user = null;
        localStorage.removeItem('me');
        localStorage.removeItem('token');

        this.clearCacheData();

        if (userId) {
            this.users = this.users.remove(userId);
        }

        this.update();
    }

    register(user) {

        return new Promise((resolve, reject) => {

            this.service.post('api/users', user).then((response) => {

                console.log("use created", response.data);

                return resolve(response.data);
            }).catch(err => {

                return reject("An error create your account");
            })


        });
    }

    login(email = null, password = null) {

        const userEmail = _.toLower(email);


        const user = {
            email: userEmail,
            password: password,
        }
        //console.log("Ttrying to login with user info", user);


        return new Promise((resolve, reject) => {


            // we call to backend service and login with user data

            this.service.post('api/users/login', user).then((response) => {

                // that mean successful user logged in

                const accessToken = _.get(response, 'data');
                const user = _.get(accessToken, 'user');

                this.setCurrentUser(user);
                this.setUserToken(accessToken);

                // call to realtime and connect again to socket server with this user

                // this.realtime.connect();

                // begin fetching user's conversations

                this.fetchConversations();

                //console.log("Got user login callback from the server: ", accessToken);


            }).catch((err) => {

                console.log("Got an error login from server", err);
                // login error

                const message = _.get(err, 'response.data.error.message', "Login Error!");

                return reject(message);
            })

        });


    }

    removeMemberFromChannel(channel = null, user = null) {

        if (!channel || !user) {
            return;
        }

        const userId = _.get(user, '_id');
        const channelId = _.get(channel, '_id');

        channel.members = channel.members.remove(userId);

        this.conversations = this.conversations.set(channelId, channel);

        this.update();

    }

    addUserToChannel(channelId, userId) {


        const channel = this.conversations.get(channelId);

        if (channel) {

            // now add this member id to conversations members.
            channel.members = channel.members.set(userId, true);
            this.conversations = this.conversations.set(channelId, channel);
            this.update();
        }

    }

    getSearchUsers() {

        return this.search.users.valueSeq();
    }

    onCreateNewChannel(channel = {}) {

        const channelId = _.get(channel, '_id');
        this.add(channelId, channel);
        this.setActiveConversation(channelId);

        //console.log(JSON.stringify(this.conversations.toJS()));

    }

    getCurrentUser() {

        return this.user;
    }

    fetchChannelMessages(channelId) {
        let channel = this.conversations.get(channelId);
        if (channel && !_.get(channel, 'isFetchedMessages')) {
            const token = _.get(this.token, '_id');
            //this.token._id;
            const options = {
                headers: {
                    authorization: token,
                }
            }
            this.service.get(`api/channels/${channelId}/messages`, options).then((response) => {
                channel.isFetchedMessages = true;
                const messages = response.data;
                _.each(messages, (message) => {
                    this.realtime.onAddMessage(message);
                });
                this.conversations = this.conversations.set(channelId, channel);
            }).catch((err) => {
                console.log("An error fetching channel 's messages", err);
            })
        }
    }

    setActiveConversation(id, type) {
        if (this.activeChannelId===id) return false;
        this.activeChannelId = id;
        this.activeChannelType = type;
        this.messages = new OrderedMap();
        this.resetCursor();
        this.getMessagesFromConversation();
    }

    getActiveConversation() {
        return this.conversations ? this.conversations.get(this.activeChannelId) : this.conversations.first();
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

    sendMessage(id, message = {}) {
        const channelId = _.get(message, 'channelId');
        if (channelId) {
            let message_send = _.get(message, 'body');
            this.callFacebookAPI.sendMessage(channelId, message_send, null).then((response) => {
                this.callFacebookAPI.getMessageById(response.data.id, null).then((res) => {
                    let newMessage = _.get(res, 'data');

                    this.message.onAdd(newMessage, 'inbox');

                    let currentChannel = this.conversations.get(this.activeChannelId);

                    let conversation = {
                        id: this.activeChannelId,
                        can_reply: currentChannel.can_reply,
                        snippet: message.message,
                        updated_time: new Date().getTime() / 1000,
                        unread_count: currentChannel.unread + 1,
                        last_reply: true,
                        senders: {
                            data: [
                                {
                                    name: currentChannel.senders,
                                    id: currentChannel.userFbId
                                }
                            ]
                        }
                    }
                    this.converstation.onAdd(conversation, 'inbox');
                }).catch((err) => {
                    console.log("An error fetching message", err);
                })
            }).catch((err) => {
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

                    this.converstation.onAdd(conversation, 'comment');
                }).catch((err) => {
                    console.log("An error fetching comment", err);
                })
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
            let req = (type==='FBMessage')? this.callFacebookAPI.getMessage(activeChannel, this.nextMessage, null) : this.callFacebookAPI.getReplyComment(activeChannel, this.nextMessage, null);
            req.then((response) => {
                this.isLoading = false;
                if (type==='FBMessage') {
                    this.nextMessage = (response.data.paging.next)? response.data.paging.cursors.after : null;
                } else if (response.data.comment_count>0) {
                    this.nextMessage = (response.data.comments.paging.next)? response.data.comments.paging.cursors.after : null;
                }
                let messages = [];
                if (type==='FBComment') {
                    const res = response.data;
                    messages = (res.comment_count>0)? response.data.comments.data : [];
                    let item = {
                        id: res.id,
                        created_time: res.created_time,
                        from: res.from,
                        message: res.message
                    };
                    if (typeof res.attachment!=='undefined') {
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
                    this.message.onAdd(mess, type);
                });
                return this.getMessages();
            }).catch((err) => {
                console.log("An error fetching user conversations", err);
            })
        }
    }

    getMessages() {
        this.messages = this.messages.sort((a, b) => a.created_time > b.created_time);
        return this.messages.valueSeq();
    }

    add(index, channel = {}) {
        this.conversations = this.conversations.set(`${index}`, channel);
        this.update();
    }

    addMess(index, mess = {}) {
        this.messages = this.messages.set(`${index}`, mess);
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

    resetChannel() {
        this.activeChannelId = null;
        this.activeChannelType = null;
        this.messages = new OrderedMap();
    }

    update() {
        this.app.forceUpdate()
    }
}