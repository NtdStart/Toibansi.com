import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DelegateMarkdownLinks from "./DelegateMarkdownLinks";
import Home from '../components/home';
import Chat from '../components/chat';

export default class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight
        }
        this._onResize = this._onResize.bind(this);
    }

    _onResize() {
        this.setState({
            height: window.innerHeight
        });
    }

    render() {
        return (
            <Router>
                <DelegateMarkdownLinks>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/chat' component={Chat}/>
                    </Switch>
                </DelegateMarkdownLinks>
            </Router>
        )
    }
}