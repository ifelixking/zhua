import React from 'react'
import ReactDOM from 'react-dom'

import { Tabs, Input, Spin, Icon, message } from 'antd'
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
import User from './User'

class App extends React.Component {
	constructor(props) {
		super(props)

		this.init = this.init.bind(this)
		this.onInputURLChange = this.onInputURLChange.bind(this)
		this.onLogin = this.onLogin.bind(this)
		this.onLogout = this.onLogout.bind(this)
		this.open = this.open.bind(this)
		this.nav = this.nav.bind(this)
		this.state = {
			loginInfo: null,
			inputURL: ''
		}
	}

	init() {
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

	componentWillMount() {
		this.init()
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

	componentDidMount(){
		utils.doWhile(() => document.getElementById('zhua-inputURL'), () => document.getElementById('zhua-inputURL').focus())
	}

	componentWillUnmount() {
		this.domStyle.remove()
	}

	onLogin(loginInfo) {
		this.setState({ loginInfo })
	}

	onLogout() {
		this.setState({ loginInfo: null })
	}

	open(item) {
		co(function* () {
			yield Service.incOpen(item.id)
			window.location = item.siteURL
		})
	}

	nav() {
		let url = this.state.inputURL
		if (!url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://')) { url = 'http://' + url }
		if (utils.checkURL(url)) {
			window.location = url
		} else {
			message.error("输入的网址不合法")
		}
	}

	onInputURLChange(e) {
		this.setState({ inputURL: e.target.value })
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
						<div onClick={() => this.open(item)} key={item.id} className={Styles['card-grid']} style={{ cursor: 'pointer', display: 'inline-block', width: '300px', margin: `0px ${((i + 1) % 4) ? '16px' : '0px'} 16px 0px`, border: '1px solid #e8e8e8', borderRadius: '2px' }}>
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
			user = <span onClick={this.logout}><User loginInfo={this.state.loginInfo} onLogout={this.onLogout} /></span>
		} else {
			user = <span><Login onLogin={this.onLogin} /><Register onLogin={this.onLogin} /></span>
		}

		return (
			<div style={{ padding: '16px 32px', textAlign: 'center' }}>
				<div style={{ textAlign: 'right', height: '32px' }}>{user}</div>
				<div style={{ clear: 'both', marginTop: '64px' }}>
					<h1 style={{ fontSize: '48px', color: '#FF7F00' }}>Zhua</h1>
				</div>
				<div className='zhua-address' style={{ whiteSpace: 'nowrap' }}>
					<Input id='zhua-inputURL' onPressEnter={this.nav} onChange={this.onInputURLChange} value={this.state.inputURL} size="large" style={{ width: '640px', }} placeholder="http://输入要抓取信息的网址" />
					<div onClick={this.nav} style={{ display: 'inline-block', marginLeft: '16px', background: '#ff5f00', padding: '0px 12px', borderRadius: '4px', lineHeight: '32px', boxSizing: 'border-box', cursor: 'pointer' }}>
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