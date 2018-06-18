import React, {Component} from 'react'
import classNames from 'classnames'
import {OrderedMap} from 'immutable'
import _ from 'lodash'
import {ObjectID} from '../helpers/objectid'
import UserBar from './user-bar'


export default class FacebookChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            messages: new OrderedMap(),
        }
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
        const text = message;
        const html = _.split(text, '\n').map((m, key) => {
            return <p key={key} dangerouslySetInnerHTML={{__html: m}}/>
        })
        return html;
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
        this.scrollMessagesToBottom();
    }

    componentWillUpdate() {
    }

    getDataMess() {
        const {facebookChat} = this.props;
        const messages = facebookChat.getMessages();
        if (messages.size > 0)
            this.setState({
                messages: messages
            });
    }

    componentWillReceiveProps(nextProps) {
        this.getDataMess();
        console.log('Component Will Receive Props!')
    }

    componentDidMount() {
        console.log('Component DID MOUNT!')
        window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount() {
        console.log('Component WILL MOUNT!')
        window.removeEventListener('resize', this._onResize)
    }


    render() {
        const {facebookChat} = this.props;
        const {height} = this.state;
        const style = {
            height: height,
        };
        const activeChannel = facebookChat.getActiveConversation();
        const conversations = facebookChat.getConversations();
        return (
            <div style={style} className="app-messenger">
                <div className="header">
                    <div className="content">
                        {this.renderTitle(activeChannel)}
                    </div>
                    <div className="right">
                        <UserBar facebookChat={facebookChat}/>
                    </div>
                </div>
                <div className="main">
                    <div className="sidebar-left">
                        <div className="chanels">
                            {conversations.map((conversation, key) => {
                                return (
                                    <div onClick={(key) => {
                                        facebookChat.setActiveConversation(conversation._id);
                                    }} key={conversation._id}
                                         className={classNames('chanel', {'notify': _.get(conversation, 'notify') === true}, {'active': _.get(activeChannel, '_id') === _.get(conversation, '_id', null)})}>
                                        <div className="user-image">
                                            {this.renderAvatars(conversation)}
                                        </div>
                                        <div className="chanel-info conversation-snippet">
                                            <p className="conversation-sender">{conversation.senders}</p>
                                            <span>{conversation.snippet}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="content">
                        <div ref={(ref) => this.messagesRef = ref} className="messages">
                            {this.state.messages.size > 0 ? this.state.messages.map((message, index) => {
                                return (
                                    <div key={index} className={classNames('message', {'me': message.me})}>
                                        <div className="message-user-image">
                                            <img src={message.from_avatar} alt=""/>
                                        </div>
                                        <div className="message-body">
                                            <div className="message-text">
                                                {this.renderMessage(message.message)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : null}
                        </div>

                        {<div className="messenger-input">
                            <div className="text-input">
										<textarea className="form-control" onKeyUp={(event) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                this.handleSend();
                                            }
                                        }} onChange={(event) => {
                                            this.setState({newMessage: _.get(event, 'target.value')});
                                        }} value="" placeholder=" Nhập câu trả lời ... "/>
                            </div>
                            <div className="actions">
                                <button onClick={this.handleSend} className="send">Send</button>
                            </div>
                        </div>}

                    </div>
                    <div className="sidebar-right">

                    </div>
                </div>
            </div>
        )
    }
}