import React, {Component} from 'react'
import classNames from 'classnames'
import {OrderedMap} from 'immutable'
import _ from 'lodash'
import {ObjectID} from '../helpers/objectid'
import UserBar from './user-bar'
import CallFacebookAPI from "../services/CallFacebookAPI";


export default class Messenger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            messages: new OrderedMap(),
            newMessage: 'Hello there...',
            searchUser: "",
            showSearchUser: false,
        }
        this.CallFacebookAPI = new CallFacebookAPI();
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
        const {store} = this.props;
        // create new message
        if (_.trim(newMessage).length) {
            const messageId = new ObjectID().toString();
            const channel = store.getActiveConversation();
            const channelId = _.get(channel, '_id', null);
            const currentUser = store.getCurrentUser();
            const message = {
                _id: messageId,
                channelId: channelId,
                body: newMessage,
                userId: _.get(currentUser, '_id'),
                me: true,
            };
            store.addMessage(messageId, message);
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
        console.log('Component DID Update!')
        this.scrollMessagesToBottom();
    }

    componentWillUpdate() {
        console.log('Component Will Update!')
    }

    getDataMessages() {
        this.time_out = setTimeout(() => {
            const {store} = this.props;
            const messages = store.getMessages();
            if (messages.size > 0)
                this.setState({
                    messages: messages
                });
        }, 2000)
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
        const {store} = this.props;
        const {height} = this.state;
        const style = {
            height: height,
        };
        const activeChannel = store.getActiveConversation();
        const conversations = store.getConversations();
        return (
            <div style={style} className="app-messenger">
                <div className="header">
                    <div className="left">
                        <button className="left-action"><i className="icon-settings-streamline-1"/></button>
                        <button onClick={this._onAddToFirst} className="right-action"><i
                            className="icon-edit-modify-streamline"/></button>
                        <h2>Chat Lists</h2>
                    </div>
                    <div className="content">
                        {this.renderTitle(activeChannel)}
                    </div>
                    <div className="right">
                        <UserBar store={store}/>
                    </div>
                </div>
                <div className="main">
                    <div className="sidebar-left">
                        <div className="chanels">
                            {conversations.map((conversation, key) => {
                                return (
                                    <div onClick={(key) => {
                                        store.setActiveConversation(conversation._id);
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