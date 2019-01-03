import React from 'react'
import ReactDOM from 'react-dom'

import { Tabs, Input, Spin, Icon } from 'antd'
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
import Login from './Login'
import Register from './Register'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.onLogin = this.onLogin.bind(this)
		this.logout = this.logout.bind(this)
		this.state = {
			loginInfo: null
		}
	}

	componentWillMount() {
		let _this = this
		co(function* () {
			let result = yield Service.getRecentAndPopular()
			_this.setState({ recentProjects: result.recent, popularProjects: result.popular })
		})
		co(function* () {
			let result = yield Service.getLoginInfo()
			_this.setState({ loginInfo: result.data })
		})
	}

	onLogin(loginInfo) {
		this.setState({ loginInfo })
	}

	logout() {
		let _this = this
		co(function* () {
			let result = yield Service.logout()
			_this.setState({ loginInfo: null })
		})
	}

	render() {

		const css_ellipsis = {
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			display: 'inline-block',
			overflow: 'hidden',
		}

		const buildProjectCard = (projects) => {
			let cards
			if (projects) {
				cards = projects.map((item, i) => {
					return (
						<div key={item.id} className={Styles['card-grid']} style={{ cursor: 'pointer', display: 'inline-block', width: '300px', margin: `0px ${((i + 1) % 4) ? '16px' : '0px'} 16px 0px`, border: '1px solid #e8e8e8', borderRadius: '2px' }}>
							<div style={{ borderBottom: '1px solid #e8e8e8', borderRadius: '2px 2px 0px 0px', backgroundColor: '#fafafa', padding: '12px' }}>
								<span title={item.name} style={Object.assign({}, css_ellipsis, { width: '100px', fontSize: '14px', fontWeight: 'bold' })}>{item.name}</span>
								<span title={item.ownerEmail} style={Object.assign({}, css_ellipsis, { width: '123px', float: 'right', fontSize: '12px', lineHeight: '21px' })}>{item.ownerEmail}</span>
							</div>
							<div style={{ padding: '12px' }}>
								<div title={item.siteURL} style={Object.assign({}, css_ellipsis, { fontSize: '12px', width: '100%', clear: 'both', marginBottom: '4px' })}>{item.siteURL}</div>
								<div><span title={item.siteTitle} style={Object.assign({}, css_ellipsis, { width: '200px' })}>{item.siteTitle}</span><span style={{ float: 'right', fontSize: '12px', lineHeight: '22px' }}>{utils.t(item.modifyTime)}</span></div>
							</div>
						</div>
					)
				})
			} else {
				let icon = <Icon type="loading" style={{ fontSize: '48px', width: 'auto', height: 'auto' }} spin />
				cards = <Spin style={{ marginLeft: '600px', marginTop: '96px' }} indicator={icon} />
			}
			return cards
		}

		let recentProjects = buildProjectCard(this.state.recentProjects)
		let popularProjects = buildProjectCard(this.state.popularProjects)

		let user
		if (this.state.loginInfo) {
			user = <span onClick={this.logout}>{this.state.loginInfo.username}</span>
		} else {
			user = <span><Login onLogin={this.onLogin} /><Register onLogin={this.onLogin} /></span>
		}

		return (
			<div style={{ padding: '16px 32px', textAlign: 'center' }}>
				<div style={{ textAlign: 'right' }}>{user}</div>
				<div style={{ clear: 'both', marginTop: '64px' }}>
					<h1 style={{ fontSize: '48px', color: '#FF7F00' }}>Zhua</h1>
				</div>
				<div style={{ whiteSpace: 'nowrap' }}>
					<Input size="large" style={{ width: '640px', }} placeholder="输入要抓取信息的网址" />
					<div style={{ display: 'inline-block', marginLeft: '16px', background: '#ff5f00', padding: '0px 12px', borderRadius: '4px', lineHeight: '32px', boxSizing: 'border-box', cursor: 'pointer' }}>
						<MyIcon style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }} name='icon-enter' />
					</div>
				</div>
				<div style={{ width: '1248px', height: '352px', display: 'inline-block', textAlign: 'left', marginTop: '36px' }}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="最新" key="1">{recentProjects}</TabPane>
						<TabPane tab="最热" key="2">{popularProjects}</TabPane>
					</Tabs>
				</div>
				<div style={{ marginTop: '36px' }}>
					<span style={{ fontFamily: '宋体', fontSize: '12px' }}>Copyright &copy;2019 zhua</span>
				</div>
			</div>
		)
	}
}



ReactDOM.render(<App />, document.getElementById('root'))