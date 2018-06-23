import React, {Component} from 'react'
import classNames from 'classnames'
import {OrderedMap} from 'immutable'
import _ from 'lodash'
import {ObjectID} from '../../helpers/objectid'

export default class FacebookChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            messages: new OrderedMap(),
            activeTab: 1,
            pageId: '598135600563114',
            pageName: '50K',
            newMessage: ''
        }
        this.firstPage = true;
        this._onResize = this._onResize.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
        this.scrollMessagesToBottom = this.scrollMessagesToBottom.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderAvatars = this.renderAvatars.bind(this);
    }

    renderAvatars(converstation) {
        return <img src={converstation.avatar} alt={converstation.senders}/>
    }

    renderAvatarPage() {
        const url = 'https://graph.facebook.com/' + this.state.pageId + '/picture?width=70&height=70';
        return <img className="img-circle" src={url} alt={this.state.pageName}/>
    }


    renderTitle(converstation = null) {
        if (!converstation) {
            return null;
        }
        return <h2>{converstation.senders}</h2>
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
        else {
            return (
                <div className="message-body">
                    <div className="message-text">
                        <img src={message.attachment.media.image.src} height={message.attachment.media.image.height}
                             width={message.attachment.media.image.width} alt=""/>
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
            const channel = facebookChat.getActiveConversation();
            const channelId = _.get(channel, '_id', null);
            const currentUser = facebookChat.getCurrentUser();
            const message = {
                _id: messageId,
                channelId: channelId,
                body: newMessage,
                userId: _.get(currentUser, '_id'),
                me: true,
            };
            facebookChat.addMessage(messageId, message);
            this.setState({
                newMessage: '',
            })
        }
    }

    _onResize() {
        this.setState({
            height: window.innerHeight
        });
    }

    componentDidUpdate() {
        // this.getDataMess();
        if (this.firstPage)
            this.scrollMessagesToBottom();
    }

    componentWillUpdate() {
    }

    getDataMess(facebookChat) {
        const messages = facebookChat.getMessages();
        if (messages.size > 0)
            this.setState({
                messages: messages
            });
    }

    componentWillReceiveProps(nextProps) {
        const {facebookChat} = nextProps;
        this.getDataMess(facebookChat);
        console.log('Component Will Receive Props!')
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
                    facebookChat.fetchConversationAndComment();
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
            facebookChat.getMessagesFromConversation();
        }
    }

    setActiveTab(type) {
        if (this.state.activeTab === type) return false;
        const {facebookChat} = this.props;
        facebookChat.conversations = new OrderedMap();
        facebookChat.resetCursor();
        switch (type) {
            case 1:
                facebookChat.fetchConversationAndComment();
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


    render() {
        const {facebookChat} = this.props;
        const {height, activeTab} = this.state;
        const style = {
            height: height,
        };
        const activeChannel = facebookChat.getActiveConversation();
        const conversations = facebookChat.getConversations();

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
                <nav id="sidebar">
                    <div className="sidebar-header">
                        <div id="dismiss">
                            <i id="fa-align-right" className="fas fa-align-right"></i>
                        </div>
                    </div>
                    <ul className="list-unstyled components">
                        <div className="sidebar-collap-left">
                            <div className="page-avatar active">
                                {this.renderAvatarPage()}
                            </div>
                        </div>
                        <div className="sidebar-collap-right">
                        </div>
                        <div className="clearfix"/>
                    </ul>
                </nav>

                <div className="header">
                    <div className="content">
                        {this.renderTitle(activeChannel)}
                    </div>
                    <div className="right">
                    </div>
                </div>
                <div className="main">
                    <div className="sidebar-left">
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
                            {conversations.map((conversation, key) => {
                                return (
                                    <div onClick={(key) => {
                                        facebookChat.setActiveConversation(conversation._id, conversation.type);
                                    }} key={conversation._id}
                                         className={classNames('conversation', {'notify': _.get(conversation, 'notify') === true}, {'active': _.get(activeChannel, '_id') === _.get(conversation, '_id', null)})}>
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
                                                {
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
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="content">
                        <div className="conversation-tags">
                            <i className="fa fa-tags"></i>
                        </div>
                        <div ref={(ref) => this.messagesRef = ref} onScroll={this.handleScrollMessage.bind(this)}
                             className="messages">
                            {this.state.messages.size > 0 ? this.state.messages.map((message, index) => {
                                return (
                                    <div key={index} className={classNames('message', {'me': message.me})}>
                                        <div className="message-user-image">
                                            <img src={message.from_avatar} alt=""/>
                                        </div>
                                        {this.renderMessage(message)}
                                    </div>
                                )
                            }) : null}
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
                                    <i className="fa fa-upload"></i>
                                    <p>Tải hình mới</p>
                                </div>
                            </div>
                        </div>}

                    </div>
                    <div className="sidebar-right">
                        <div className="participant-info-customer">
                            <div className="participant-info-customer-detail">
                                Thông tin khách hàng
                            </div>
                            <div>
                                <div className="participant-info-customer-comment border-top">
                                    Lưu ý
                                </div>
                            </div>
                            <div>
                                <div className="participant-info-customer-sample-message border-top">
                                    <i className="fa fa-list-alt"></i>
                                    <ul className="list-unstyled">
                                        <li className="item">
                                            <span>
                                                A check inbox nhé a, nếu không nhận được tin nhắn của shop phiền anh ib cho
                                                shop ạ. Cám ơn a!
                                            </span>
                                        </li>
                                        <li className="item">
                                            <span>
                                                A cho em chiều cao vs cân nặng em tư vấn size ạ
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="participant-info-customer-orders border-top">
                                Danh sách đơn hàng
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}