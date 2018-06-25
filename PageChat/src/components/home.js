import React, {Component} from 'react'

export default class Home extends Component {

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
            <div className="wrapper">
                <div className="container">
                    <h1>Welcome</h1>
                    <form className="form">
                        <input type="text" placeholder="Username"/>
                        <input type="password" placeholder="Password"/>
                        <a href="/chat"  className="btn-login btn btn-info" id="login-button">Login </a>
                    </form>
                </div>

                <ul className="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        )
    }
}