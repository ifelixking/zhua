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

		this.ref_form = React.createRef();
		this.ref_username = React.createRef()
		this.ref_password = React.createRef()

		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.emitEmptyUsername = this.emitEmptyUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.emitEmptyPassword = this.emitEmptyPassword.bind(this)
		this.okByPressEnter = this.okByPressEnter.bind(this)
		this.onVisibleChange = this.onVisibleChange.bind(this)

		this.state = {
			username: '',
			password: ''
		}
	}

	onChangeUsername(e) { this.setState({ username: e.target.value }) }
	onChangePassword(e) { this.setState({ password: e.target.value }) }

	emitEmptyUsername() { this.ref_username.current.focus(); this.setState({ username: '' }) }
	emitEmptyPassword() { this.ref_password.current.focus(); this.setState({ password: '' }) }

	okByPressEnter() {
		let btn = this.ref_form.current.parentElement.parentElement.nextElementSibling.lastElementChild
		btn.click()
	}

	onVisibleChange(visible) {
		visible && utils.doWhile(() => this.ref_username.current, () => { this.ref_username.current.focus() })
	}

	render() {

		const css_key = { marginBottom: '8px' }
		const css_field = { marginBottom: '16px' }

		let _this = this
		const onOK = function (e) {
			// 这里的 this 指向 Popconfirm, 可调用 setVisible 来控制提示框持续显示
			this.setVisible(true);

			if (!_this.state.username) { message.error('输入您的账号'); _this.ref_username.current.focus(); _this.ref_username.current.select(); return }
			if (!_this.state.password) { message.error('请输入密码'); _this.ref_password.current.focus(); _this.ref_password.current.select(); return }

			_this.setState({ loading: true }); let theButton = e.target; theButton.disabled = true

			let __this = this
			co(function* () {
				let result = yield Service.login({ username: _this.state.username, password: _this.state.password });
				_this.setState({ loading: false }); theButton.disabled = false
				if (result.data == null) {
					switch (result.desc) {
						case 'USERNAME_PASSWORD_ERROR': { _this.ref_password.current.focus(); _this.ref_password.current.select(); message.error('用户名或密码错误'); return }
						default: message.error('登录失败, 请重试'); return;
					}
				}
				_this.setState({ username: '', password: '' }); __this.setVisible(false)
				_this.props.onLogin(result.data)
				yield Service.nSave('loginInfo', JSON.stringify(result.data))		// 写本地
				message.success('登录成功');
			})
		}

		let login; {
			const suffix1 = this.state.username ? <Icon type="close-circle" onClick={this.emitEmptyUsername} /> : null;
			const suffix2 = this.state.password ? <Icon type="close-circle" onClick={this.emitEmptyPassword} /> : null;
			login = (
				<form ref={this.ref_form} style={{ paddingTop: '8px' }}>
					<div style={css_key}>输入您的账号</div>
					<div style={css_field}>
						<Input placeholder="账号" autoComplete='email' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							suffix={suffix1} value={this.state.username} onChange={this.onChangeUsername} onPressEnter={this.okByPressEnter} ref={this.ref_username} />
					</div>
					<div style={css_key}>请输入密码</div>
					<div style={css_field}>
						<Input type="password" placeholder="密码" autoComplete='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							suffix={suffix2} value={this.state.password} onChange={this.onChangePassword} onPressEnter={this.okByPressEnter} ref={this.ref_password} />
					</div>
				</form>
			)
		}



		return (
			<Popconfirm overlayClassName='zhua-loginPop' overlayStyle={{ width: '300px' }} placement="bottomRight" title={login} onConfirm={onOK} okText="登录" icon={null} onVisibleChange={this.onVisibleChange}>
				<a href="javascript:;" style={Object.assign({}, { cursor: 'pointer' }, this.props.style)}>登录</a>
			</Popconfirm>
		)
	}
}
