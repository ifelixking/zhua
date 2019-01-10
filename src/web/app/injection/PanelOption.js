import React from 'react'
import { connect } from 'react-redux'
import { message } from 'antd'
import Login from '../home/Login'
import Register from '../home/Register'
import User from '../home/User'
import * as utils from '../../utils'
import Icon from './Common/Icon'
import { QWebChannel } from './Common/qwebchannel'

export default connect(
	state => {
		return { loginInfo: state.loginInfo }
	},
	dispath => {
		return {
			onLogin: (loginInfo) => {
				dispath({ type: 'SET_LOGININFO', loginInfo })
			},
			onLogout() {
				dispath({ type: 'SET_LOGININFO', loginInfo: null })
			}

		}
	}
)(class PanelOption extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		message.config({ maxCount: 5 });
		this.domStyle = utils.createGlobalStyle(`
				.zhua-loginPop .ant-popover-message-title{
					padding-left: 0px;
				}
				.zhua-loginPop .ant-btn-sm:first-child{
					display:none;
				}
				.zhua-loginPop .ant-btn-primary{
					width: 100%;
					height: 46px;
					margin-left: 0px;
				}
				.zhua-address .ant-input{
					border-radius: 20px;
					padding: 6px 17px;
				}
			`)
	}
	componentWillUnmount() {
		this.domStyle && this.domStyle.remove()
	}

	test(){
		debugger;
		new QWebChannel(qt.webChannelTransport, function (channel) {
			window.Zhua = channel.objects.Zhua;
			Zhua.getInfo("show", "me", function (returnValue) {
				alert("returnValue=" + returnValue);
			});
		});	
	}

	static title = "选项"
	render() {
		const { loginInfo, onLogin, onLogout } = this.props
		const css_frame = { padding: '16px' }
		const css_span = { display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 'calc(100% - 54px)' }

		let domLoginInfo
		if (loginInfo) {
			domLoginInfo = <span style={css_span}><User showText={true} loginInfo={loginInfo} onLogout={onLogout} /></span>
		} else {
			domLoginInfo = <span style={css_span}>
				<span style={{ marginRight: '2px' }}>还没有登录, 请先</span>
				<Login onLogin={onLogin} />
				<span style={{ margin: '0px 2px' }}>或</span>
				<Register onLogin={onLogin} />
			</span>
		}

		return (
			<div style={css_frame}>
				<Icon style={{ fontSize: '24px' }} name='icon-user' />
				{domLoginInfo}
				<button onClick={this.test}>test</button>
			</div>
		)
	}
}
)


