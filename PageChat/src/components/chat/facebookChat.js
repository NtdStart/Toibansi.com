import React, {Component} from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import {ObjectID} from '../../helpers/objectid'
import ChatBoxRight from './chatBoxRight'
import NavigationLeft from './navigationLeft'
import {List} from "immutable";


export default class FacebookChat extends Component {

    constructor(props) {
        super(props);
        new ChatBoxRight(this);
        new NavigationLeft(this);


        this.state = {
            height: window.innerHeight,
            conversations: new List(),
            messagesArray: new List(),
            activeConversation: '',
            activeConversationId: '',
            activeUserFbId: '',
            activeTab: 1,
            pageId: '598135600563114',
            pageName: '50K',
            newMessage: ''
        }
        this.update = false;
        this.firstPage = true;
        this._onResize = this._onResize.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
        this.scrollMessagesToBottom = this.scrollMessagesToBottom.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderAvatars = this.renderAvatars.bind(this);
    }

    renderAvatars(conversation) {
        return <img src={conversation.avatar} alt={conversation.senders}/>
    }


    renderTitle(conversation = null) {
        if (!conversation) {
            return null;
        }
        return <h4>{conversation.senders}</h4>
    }

    renderViewOnFb(userId = null) {
        if (!userId) {
            return null;
        }
        let linkFb = 'https://www.facebook.com/' + userId;
        return <a title="Xem facebook" alt="Xem facebook" target="_blank" href={linkFb}> <i
            className="fab fa-facebook-f"></i> </a>
    }

    scrollMessagesToBottom() {
        if (this.messagesRef) {
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
        }
    }

    renderMessage(message) {
        if (message.attachment == null)
            return (
                <div className="message-body">
                    <div className="message-text">
                        {message.message}
                    </div>
                </div>
            )
        else if (message.attachment.data !== undefined) {
            return (
                <div className="message-body">
                    {message.attachment.data.map(image => {
                        return (
                            <div key={image.id} className="message-attack">
                                <img src={image.image_data.url} width="50%"
                                     alt=""/>
                            </div>
                        )
                    })}
                </div>
            )
        } else if (message.attachment.media) {
            return (
                <div className="message-body">
                    <div className="message-attack">
                        <img src={message.attachment.media.image.src}
                             width="50%" alt=""/>
                    </div>
                </div>
            )
        }
    }

    handleSend() {
        const {newMessage} = this.state;
        const {facebookChat} = this.props;
        // create new message
        if (_.trim(newMessage).length) {
            const messageId = new ObjectID().toString();
            const activeConversation = facebookChat.getActiveConversation();
            const conversationId = activeConversation._id;
            const message = {
                _id: messageId,
                created_time: new Date().getTime() / 1000,
                message: newMessage,
                from: {
                    name: '',
                    id: facebookChat.callFacebookAPI.getPageId()
                },
                channelId: facebookChat.activeChannelId,
                body: newMessage,
                me: true,
            };

            if (conversationId.charAt(0) === 't') {
                facebookChat.sendMessage(conversationId, message);
                this.scrollMessagesToBottom();
            } else {
                facebookChat.postComment(conversationId, message);
            }

            this.setState({
                newMessage: '',
            })
        }
    }


    sendPhoto(event, props) {
        const file = event.target.files[0];
        const {facebookChat} = props;

        const messageId = new ObjectID().toString();
        const channel = facebookChat.getActiveConversation();
        const currentUser = channel.userFbId;
        const channelId = channel._id;
        const message = {
            _id: messageId,
            channelId: channelId,
            body: file,
            userId: _.get(currentUser, '_id'),
            me: true,
        };

        if (channelId.charAt(0) === 't') {
            facebookChat.sendMessage(messageId, message);
        } else {
            facebookChat.postComment(messageId, message);
        }
    }

    _onResize() {
        this.setState({
            height: window.innerHeight
        });
    }

    componentDidUpdate() {
        // console.log('Component Did Update Props!')
        if (this.firstPage)
            this.scrollMessagesToBottom();
    }

    componentWillUpdate() {
    }


    componentWillReceiveProps(nextProps) {
        // console.log('Component Will Receive Props!')
        const {facebookChat} = nextProps;
        this.getConversations(facebookChat);
        this.activeConversation(facebookChat);
        this.getMessage(facebookChat);
    }

    componentDidMount() {
        // console.log('Component DID MOUNT!')
        window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount() {
        // console.log('Component WILL MOUNT!')
        window.removeEventListener('resize', this._onResize)
    }

    handleScroll() {
        const {facebookChat} = this.props;
        let {offsetHeight, scrollHeight, scrollTop} = this.scroller;
        if (scrollHeight > 0 && scrollHeight - offsetHeight - scrollTop < 50 && !facebookChat.isLoading && facebookChat.nextConversation !== null) {
            switch (this.state.activeTab) {
                case 1:
                    // facebookChat.fetchConversationAndComment();
                    break;
                case 2:
                    facebookChat.fetchConversations();
                    break;
                case 3:
                    facebookChat.fetchComments();
                    break;
                case 4:
                    facebookChat.fetchComments();
                    break;
                default :
                    facebookChat.fetchConversationAndComment();
                    break;
            }
        }
    }

    handleScrollMessage() {
        const {facebookChat} = this.props;
        this.firstPage = false;
        let {scrollTop} = this.messagesRef;
        if (scrollTop < 50 && !facebookChat.isLoading && facebookChat.nextMessage !== null) {
            facebookChat.getMoreMessages();
        }
    }

    setActiveTab(type) {
        if (this.state.activeTab === type) return false;
        const {facebookChat} = this.props;
        facebookChat.resetChannel();
        facebookChat.resetCursor();
        switch (type) {
            case 1:
                // facebookChat.fetchConversationAndComment();
                break;
            case 2:
                facebookChat.fetchConversations();
                break;
            case 3:
                facebookChat.fetchComments();
                break;
            case 4:
                facebookChat.fetchComments();
                break;
            default :
                facebookChat.fetchConversationAndComment();
                break;
        }
        this.firstPage = true;
        this.setState({activeTab: type})
    }

    getMessage(facebookChat) {
        const activeConversation = facebookChat.getActiveConversation();
        if (undefined !== activeConversation) {
            let messagesArray = facebookChat.getMessages(activeConversation._id);
            messagesArray = messagesArray.sort((a, b) => {
                if (a.created_time < b.created_time) {
                    return -1;
                }
                if (a.created_time > b.created_time) {
                    return 1;
                }
                if (a === b) {
                    return 0;
                }
                return 0;
            });
            this.setState({
                messagesArray: messagesArray
            });

        }
    }

    getConversations(facebookChat) {
        let conversations = facebookChat.getConversations();
        conversations = conversations.sort((a, b) => {
            if (a.unix_time > b.unix_time) {
                return -1;
            }
            if (a.unix_time < b.unix_time) {
                return 1;
            }
            if (a === b) {
                return 0;
            }
            return 0;
        });
        this.setState({
            conversations: conversations
        });
    }

    activeConversation(facebookChat) {
        const activeConversation = facebookChat.getActiveConversation();
        if (undefined !== activeConversation) {
            const activeConversationId = activeConversation._id;
            const activeUserFbId = activeConversation.userFbId;
            this.setState({
                activeConversation: activeConversation,
                activeConversationId: activeConversationId,
                activeUserFbId: activeUserFbId
            });
        }
    }


    render() {
        const {facebookChat} = this.props;
        const {height, activeTab} = this.state;
        const style = {
            height: height,
        };

        function renderIcon(reply) {
            if (reply) {
                return (
                    <i className="fas fa-reply"></i>
                )
            }
        }

        return (
            <div style={style} className="app-messenger">
                <div className="overlay"></div>
                <NavigationLeft navLeft={NavigationLeft}/>
                <div className="header">
                    <div className="left"></div>
                    <div className="main">
                    </div>
                    <div className="right">
                    </div>
                </div>
                <div className="chat">
                    <div className="chat-left">
                        <div className="fb-wrap-bar-search">
                            <div className="fb-chat-action-bar">
                                <div className="fb-chat-menu">
                                    <div className={classNames("menu-icon", {"active": activeTab === 1})}
                                         onClick={() => this.setActiveTab(1)}>
                                        <i className="fa fa-inbox fa-2x"></i>
                                    </div>
                                    <div className={classNames("menu-icon", {"active": activeTab === 2})}
                                         onClick={() => this.setActiveTab(2)}>
                                        <i className="far fa-envelope fa-2x"></i>
                                    </div>
                                    <div className={classNames("menu-icon", {"active": activeTab === 3})}
                                         onClick={() => this.setActiveTab(3)}>
                                        <i className="far fa-comment fa-2x"></i>
                                    </div>
                                    <div className={classNames("menu-icon", {"active": activeTab === 4})}
                                         onClick={() => this.setActiveTab(4)}>
                                        <i className="fa fa-eye-slash fa-2x"></i>
                                    </div>
                                    <div className="menu-icon drop-control dropdown">
                                        <span className="dropdown-toggle" data-toggle="dropdown" role="button">
                                            <i className="fa fa-bars fa-2x"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="search-conversation">
                                <div className="flexbox-grid-default">
                                    <div className="flexbox-auto-content">
                                        <div className="wrap-search-input">
                                            <span className="icon-search">
                                                <i className="fas fa-search"></i>
                                            </span>
                                            <input className="search-input" placeholder="Tìm kiếm"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="conversations"
                             onScroll={this.handleScroll.bind(this)}
                             ref={(scroll) => this.scroller = scroll}
                        >
                            {this.state.conversations.map((conversation, key) => {
                                return (
                                    <div onClick={(key) => {
                                        facebookChat.setActiveConversation(conversation._id, conversation.type);
                                    }} key={conversation._id}
                                         className={classNames('conversation', {'unread': conversation.unread > 0}, {'notify': _.get(conversation, 'notify') === true}, {'active': conversation._id === this.state.activeConversationId})}>
                                        <div className="user-image">
                                            {this.renderAvatars(conversation)}
                                        </div>
                                        <div className="conversation-info conversation-snippet">
                                            <p className="conversation-sender">{conversation.senders}</p>
                                            <span>
                                                {renderIcon(conversation.last_reply)}
                                                {conversation.snippet}</span>
                                        </div>
                                        <div className="conversation-right">
                                            <i className="fa fa-clock-o"></i>
                                            <span>{conversation.updated_time}</span>
                                            <div>
                                                <p>   {
                                                    function (type) {
                                                        if (type === 'FBMessage') {
                                                            return (
                                                                <i className="far fa-envelope"></i>
                                                            )
                                                        } else {
                                                            return (
                                                                <i className="far fa-comment"></i>
                                                            )
                                                        }
                                                    }(conversation.type)
                                                }
                                                </p>
                                                <p>  {
                                                    function (unread) {
                                                        if (unread > 0) {
                                                            return (
                                                                <i className="unread fas fa-circle"></i>
                                                            )
                                                        } else {
                                                            return (
                                                                <i className="unread far fa-circle"></i>
                                                            )
                                                        }
                                                    }(conversation.unread)
                                                }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="chat-messages">
                        <div className="conversation-header">
                            <div className="name-conversation">
                                {this.renderTitle(this.state.activeConversation)}
                            </div>
                            <div className="view-profile-fb">
                                {this.renderViewOnFb(this.state.activeUserFbId)}
                            </div>
                        </div>
                        <div className="conversation-tags">
                            <i className="fa fa-tags"></i>
                        </div>
                        <div ref={(ref) => this.messagesRef = ref} onScroll={this.handleScrollMessage.bind(this)}
                             className="messages">
                            {this.state.messagesArray.map((message, index) => {
                                return (
                                    <div key={index} className={classNames('message', {'me': message.me})}>
                                        <div className="message-user-image">
                                            <img src={message.from_avatar} alt=""/>
                                        </div>
                                        {this.renderMessage(message)}
                                    </div>
                                )
                            })}
                        </div>
                        {<div className="messenger-input">
                            <div className="facebook tags">
                                <div className="item">Đã tạo</div>
                                <div className="item">Bỏ qua</div>
                                <div className="item">Boom</div>
                                <a title="Quản lý nhãn">
                                    <i className="fa fa-plus"></i>
                                </a>
                            </div>
                            <div className="text-input">
										<textarea className="form-control" onKeyUp={(event) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                this.handleSend();
                                            }
                                        }} onChange={(event) => {
                                            this.setState({newMessage: _.get(event, 'target.value')});
                                        }} value={this.state.newMessage} placeholder=" Nhập câu trả lời ... "/>
                            </div>
                            <div className="sendMsg">
                                <button onClick={this.handleSend} className="btn btn-info">Send</button>
                            </div>
                            <div className="clearfix"/>
                            <div className="actions">
                                <div className="item">
                                    <i className="fa fa-camera"></i>
                                    <p>Kho hình ảnh</p>
                                </div>
                                <div className="item">
                                    <input ref={input => this.inputElement = input} type="file" className={'hide'}
                                           onChange={(event) => {
                                               this.sendPhoto(event, this.props);
                                           }}/>
                                    <div className="label_input"
                                         onClick={() => this.inputElement.click()}
                                    >
                                        <i className="fa fa-upload"></i>
                                        <p>Tải hình mới</p>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <ChatBoxRight chatRight={ChatBoxRight}/>
                </div>
            </div>
        )
    }
}