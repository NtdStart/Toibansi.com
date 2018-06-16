import React, {Component} from 'react'
import ConversationController from '../controller/ConverstationController'
import Messenger from './messenger'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ConversationController: new ConversationController(this),
        }
    }

    render() {
        const {ConversationController} = this.state;
        return <div className="app-wrapper">
            <Messenger store={ConversationController}/>
        </div>
    }
}