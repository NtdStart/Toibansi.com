import React, {Component} from 'react'

export default class chatBoxRight extends Component {

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


    render() {
        return (
            <div className="chat-right">
                <div className="participant-info-customer">
                    <div className="participant-info-customer-detail">
                        Thông tin khách hàng
                    </div>
                    <div>
                        <div className="participant-info-customer-comment border-top">
                            Lưu ý
                        </div>
                    </div>
                    <div>
                        <div className="participant-info-customer-sample-message border-top">
                            <i className="fa fa-list-alt"></i>
                            <ul className="list-unstyled">
                                <li className="item">
                                            <span>
                                                A check inbox nhé a, nếu không nhận được tin nhắn của shop phiền anh ib cho
                                                shop ạ. Cám ơn a!
                                            </span>
                                </li>
                                <li className="item">
                                            <span>
                                                A cho em chiều cao vs cân nặng em tư vấn size ạ
                                            </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="participant-info-customer-orders border-top">
                        Danh sách đơn hàng
                    </div>
                </div>
            </div>
        )
    }
}