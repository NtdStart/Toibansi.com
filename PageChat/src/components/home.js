import React, {Component} from 'react'
import Service from '../services/service'
import FacebookLogin from 'react-facebook-login';

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
        event.preventDefault();
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

    componentDidMount() {
        // console.log('Component DID MOUNT!')
    }

    _handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    loginFacebookClicked = (response) => {
        // console.log(response);
    };

    responseFacebook = (response) => {
        console.log(response);
        if (response.id !== undefined) {
            this.props.history.push("/chat");
        }
    };

    render() {

        return (
            <div className="wrapper">
                <div className="container">
                    <form className="form">
                        <input id="email" type="text" placeholder="Username" value={this.state.email}
                               onChange={this._handleChange}/>
                        <input id="password" type="password" placeholder="Password" value={this.state.password}
                               onChange={this._handleChange}/>
                        <a onClick={this._loginClick} className="btn-login btn btn-info" id="login-button">Login </a>
                        <p className="login-fb-text"> Hoặc </p>
                        <FacebookLogin
                            appId="2032472167011543"
                            autoLoad={false}
                            fields="name,email,picture"
                            onClick={this.loginFacebookClicked}
                            callback={this.responseFacebook}
                            icon="fa fa-facebook"
                            cssClass="my-facebook-button-class"
                        />
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