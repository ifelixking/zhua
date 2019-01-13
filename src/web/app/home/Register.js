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


export default class Register extends React.Component {
	constructor(props) {
		super(props);

		this.ref_form = React.createRef();
		this.ref_username = React.createRef();
		this.ref_password = React.createRef();
		this.ref_repassword = React.createRef();

		// this.onOK = this.onOK.bind(this)
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.emitEmptyUsername = this.emitEmptyUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.emitEmptyPassword = this.emitEmptyPassword.bind(this)
		this.onChangeRePassword = this.onChangeRePassword.bind(this)
		this.emitEmptyRePassword = this.emitEmptyRePassword.bind(this)
		this.okByPressEnter = this.okByPressEnter.bind(this)
		this.onVisibleChange = this.onVisibleChange.bind(this)

		this.state = {
			username: '',
			password: '',
			repassword: '',
			loading: false
		}
	}

	onChangeUsername(e) { this.setState({ username: e.target.value }) }
	onChangePassword(e) { this.setState({ password: e.target.value }) }
	onChangeRePassword(e) { this.setState({ repassword: e.target.value }) }

	emitEmptyUsername() { this.ref_username.current.focus(); this.setState({ username: '' }) }
	emitEmptyPassword() { this.ref_password.current.focus(); this.setState({ password: '' }) }
	emitEmptyRePassword() { this.ref_repassword.current.focus(); this.setState({ repassword: '' }) }

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

		let login; {
			const suffix1 = this.state.username ? <Icon type="close-circle" onClick={this.emitEmptyUsername} /> : null;
			const suffix2 = this.state.password ? <Icon type="close-circle" onClick={this.emitEmptyPassword} /> : null;
			const suffix3 = this.state.repassword ? <Icon type="close-circle" onClick={this.emitEmptyRePassword} /> : null;
			login = (
				<form ref={this.ref_form} style={{ paddingTop: '8px' }}>
					<div style={css_key}>请输入您的邮箱作为账号</div>
					<div style={css_field}>
						<Input disabled={this.state.loading} autoComplete='email' placeholder="邮箱" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							suffix={suffix1} value={this.state.username} onChange={this.onChangeUsername} onPressEnter={this.okByPressEnter} ref={this.ref_username} />
					</div>
					<div style={css_key}>设置密码</div>
					<div style={css_field}>
						<Input disabled={this.state.loading} type="password" autoComplete='new-password' placeholder="密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							suffix={suffix2} value={this.state.password} onChange={this.onChangePassword} onPressEnter={this.okByPressEnter} ref={this.ref_password} />
					</div>
					<div style={css_key}>再次输入密码</div>
					<div style={css_field}>
						<Input disabled={this.state.loading} type="password" autoComplete='comfirm-password' placeholder="密码" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							suffix={suffix3} value={this.state.repassword} onChange={this.onChangeRePassword} onPressEnter={this.okByPressEnter} ref={this.ref_repassword} />
					</div>
				</form>
			)
		}

		let _this = this
		const onOK = function (e) {
			// 这里的 this 指向 Popconfirm, 可调用 setVisible 来控制提示框持续显示
			this.setVisible(true);

			if (!utils.validEmail(_this.state.username)) { message.error('邮箱格式不正确'); _this.ref_username.current.focus(); _this.ref_username.current.select(); return }
			if (_this.state.password.length < 6) { message.error('密码需要至少6位'); _this.ref_password.current.focus(); _this.ref_password.current.select(); return }
			if (_this.state.password != _this.state.repassword) { message.error('两次密码输入不一致'); _this.ref_repassword.current.focus(); _this.ref_repassword.current.select(); return }

			_this.setState({ loading: true }); let theButton = e.target; theButton.disabled = true

			let __this = this
			co(function* () {
				let result = yield Service.registe({ email: _this.state.username, password: _this.state.password });
				_this.setState({ loading: false }); theButton.disabled = false
				if (result.data == null) {
					switch (result.desc) {
						case 'EMAIL_ALREADY_EXIST': { _this.ref_username.current.focus(); _this.ref_username.current.select(); message.error('该邮箱已经注册, 不能重复使用'); return }
						default: message.error('注册失败, 请重试'); return;
					}
				}
				_this.setState({ username: '', password: '', repassword: '' }); __this.setVisible(false)
				_this.props.onLogin(result.data)
				yield Service.nSave('loginInfo', JSON.stringify(result.data))		// 写本地
				message.success('注册成功');
			})
		}


		return (
			<Popconfirm overlayClassName='zhua-loginPop' overlayStyle={{ width: '300px' }} placement="bottomRight" title={login} onConfirm={onOK} okText="注册" icon={null} onVisibleChange={this.onVisibleChange}>
				<a href="javascript:;" style={Object.assign({}, { cursor: 'pointer' }, this.props.style)}>注册</a>
			</Popconfirm>
		)
	}
}
