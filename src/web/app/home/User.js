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


export default class User extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const { loginInfo } = this.props
		
		let _this = this
		const onOK = function (e) {
			// 这里的 this 指向 Popconfirm, 可调用 setVisible 来控制提示框持续显示
			this.setVisible(true);
			_this.setState({ loading: true }); let theButton = e.target; theButton.disabled = true
			let __this = this
			co(function* () {
				let result = yield Service.logout()
				_this.setState({ loading: false }); theButton.disabled = false
				__this.setVisible(false)
				_this.props.onLogout(result.data)
				message.success('已注销');
			})
		}

		let content = <span>{loginInfo.username}</span>
		let title
		if (this.props.showText){
			title = <a href="javascript:;" style={{ cursor: 'pointer', fontSize: '12px', marginRight: '12px', lineHeight: '12px' }}>{loginInfo.username}</a>
		}else{
			title = <MyIcon style={{ cursor: 'pointer', fontSize: '24px', marginRight: '12px', lineHeight: '24px' }} name="icon-user" />
		}
		return (
			<Popconfirm overlayClassName='zhua-loginPop' overlayStyle={{ width: '300px' }} placement="bottomRight" title={content} onConfirm={onOK} okText="注销" icon={null}>
				{title}
			</Popconfirm>
		)
	}
}
