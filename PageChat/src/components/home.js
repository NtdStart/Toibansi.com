import React, { Component } from 'react'
import  Service  from '../services/service'
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.service = new Service()
        this.state = {
            email: '',
            password: '',
            height: window.innerHeight
        }

        this._onResize = this._onResize.bind(this);
        this._loginClick = this._loginClick.bind(this)
        this._handleChange = this._handleChange.bind(this)
    }

    _onResize() {
        this.setState({
            height: window.innerHeight
        });
    }
    _loginClick = event => {
        event.preventDefault()
        const data = {
            email: this.state.email,
            pass: this.state.password
        };
        this.service.post('user', data)
            .then(response => {
                let obj = response.data
                if (obj.code === 1) {
                    this.props.history.push("/chat");
                }
            })
    }
    _handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        return (
            <div className="wrapper">
                <div className="container">
                    <h1>Welcome</h1>
                    <form className="form">
                        <input id="email" type="text" placeholder="Username" value={this.state.email} onChange={this._handleChange} />
                        <input id="password" type="password" placeholder="Password" value={this.state.password} onChange={this._handleChange} />
                        <a onClick={this._loginClick} className="btn-login btn btn-info" id="login-button">Login </a>
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