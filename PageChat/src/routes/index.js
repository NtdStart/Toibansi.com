import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import DelegateMarkdownLinks from "./DelegateMarkdownLinks";
import App from '../components/chat';

export default class Routes extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <DelegateMarkdownLinks>
                    <Switch>
                        <Route exact path='/' component={App}/>
                        <Route exact path='/test' component={App}/>
                    </Switch>
                </DelegateMarkdownLinks>
            </Router>
        )
    }
}