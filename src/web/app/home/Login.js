import React from 'react'

import { Tabs, Input, Spin, Icon, Popconfirm, message } from 'antd'
const TabPane = Tabs.TabPane
import 'antd/lib/tabs/style'
import 'antd/lib/input/style'
import 'antd/lib/spin/style'
import 'antd/lib/Popconfirm/style'
import 'antd/lib/message/style'
import co from 'co'

import * as Service from '../../service'
import * as utils from '../../utils'
import MyIcon from '../injection/Common/Icon'
import Styles from '../injection/index.css'


export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.ref_username = React.createRef();
		this.ref_password = React.createRef();

		this.onLoginOK = this.onLoginOK.bind(this)
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.emitEmptyUsername = this.emitEmptyUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.emitEmptyPassword = this.emitEmptyPassword.bind(this)

		this.state = {
			username: '',
			password:''
		}
	}

	componentWillMount() {
		this.domStyle = utils.createGlobalStyle(`
			.loginPop .ant-popover-message-title{
				padding-left: 0px;
			}
		`)
	}

	componentWillUnmount() {
		this.domStyle.remove()
	}

	onLoginOK() {

	}

	onChangeUsername(e) { this.setState({ username: e.target.value }) }
	onChangePassword(e) { this.setState({ password: e.target.value }) }

	emitEmptyUsername() { this.ref_username.current.focus(); this.setState({ username: '' })}
	emitEmptyPassword() { this.ref_password.current.focus(); this.setState({ password: '' })}


	render() {

		const css_field = {marginBottom:'8px'}

		let login; {
			const suffix1 = this.state.username ? <Icon type="close-circle" onClick={this.emitEmptyUsername} /> : null;
			const suffix2 = this.state.password ? <Icon type="close-circle" onClick={this.emitEmptyPassword} /> : null;
			login = (
				<div style={{paddingTop:'8px'}}>
					<div style={css_field}>
					<Input placeholder="输入您的账号" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						suffix={suffix1} value={this.state.username} onChange={this.onChangeUsername} ref={this.ref_username}/>
						</div>
						<div style={css_field}>
					<Input type="password" placeholder="输入您的密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						suffix={suffix2} value={this.state.password} onChange={this.onChangePassword} ref={this.ref_password}/>
						</div>
				</div>
			)
		}


		return (
			<Popconfirm overlayClassName='loginPop' overlayStyle={{width:'300px'}} placement="bottomRight" title={login} onConfirm={this.onLoginOK} okText="登录" cancelText="取消" icon={null}>
				<span style={{ cursor: 'pointer' }}>登录</span>
			</Popconfirm>
		)
	}
}
