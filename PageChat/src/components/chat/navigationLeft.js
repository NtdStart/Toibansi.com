import React, {Component} from 'react'
import UserFacebook from '../user/userFacebook'

export default class navigationLeft extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight,
            pageId: '598135600563114',
            pageName: '50K'
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
    }

    componentWillUnmount() {
        // console.log('Component WILL MOUNT!')
        window.removeEventListener('resize', this._onResize)
    }


    renderAvatarPage() {
        const url = 'https://graph.facebook.com/' + this.state.pageId + '/picture?width=70&height=70';
        return <img className="img-circle" src={url} alt={this.state.pageName}/>
    }



    render() {
        return (
            <nav id="navigation-left">
                <div className="header">
                    <div id="dismiss">
                        <i id="fa-align-right" className="fas fa-align-right"></i>
                    </div>
                </div>
                <ul className="list-unstyled components">
                    <div className="collapse-left">
                        <div className="page-avatar active">
                            {this.renderAvatarPage()}
                        </div>
                        <div className="page-avatar">
                            {this.renderAvatarPage()}
                        </div>
                        <div className="page-avatar">
                            {this.renderAvatarPage()}
                        </div>
                    </div>
                    <div className="collapse-right">
                    </div>
                    <UserFacebook />
                    <div className="clearfix"/>
                </ul>
            </nav>
        )
    }
}