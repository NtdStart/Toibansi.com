import React, {Component} from 'react'

export default class userFacebook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
        }
        this._onResize = this._onResize.bind(this);
    }

    _onResize() {
        this.setState({
            height: window.innerHeight
        });
    }

    componentDidUpdate() {
        // console.log('Component DidUpdate Props!')
    }

    componentWillUpdate() {
        // console.log('Component Will Update Props!')
    }


    componentWillReceiveProps(nextProps) {
        // console.log('Component Will Receive Props!')
    }

    componentDidMount() {
        // console.log('Component DID MOUNT!')
        window.addEventListener('resize', this._onResize);
        this.getLoginStatus()
    }

    componentWillUnmount() {
        // console.log('Component WILL MOUNT!')
        window.removeEventListener('resize', this._onResize)
    }


    renderAvatar() {
        const url = 'https://graph.facebook.com/' + this.state.pageId + '/picture?width=70&height=70';
        return <img className="img-circle" src={url} alt={this.state.pageName}/>
    }





    logout() {
        window.FB.logout(function (response) {
            // user is logged out
        });
    }

    getLoginStatus() {
        window.FB.api('/me', function(response) {
            console.log(response);
        });
    }


    render() {
        return (
            <div id="user-facebook">
                <div className="avatar">
                    {this.renderAvatar()}
                </div>
                <a onClick={this.logout} href="/">Thoát</a>
            </div>
        )
    }
}