import React from 'react'
import ReactDOM from 'react-dom'

import { Tabs, Input, Spin, Icon, message, Pagination } from 'antd'
const TabPane = Tabs.TabPane
const Search = Input.Search;
import 'antd/lib/tabs/style'
import 'antd/lib/input/style'
import 'antd/lib/spin/style'
import 'antd/lib/pagination/style'
import 'antd/lib/Popconfirm/style'
import 'antd/lib/message/style'
import co from 'co'
import Cookies from 'js-cookie'

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

		this.ref_search = React.createRef();

		this.init = this.init.bind(this)
		this.onInputURLChange = this.onInputURLChange.bind(this)
		this.onLogin = this.onLogin.bind(this)
		this.onLogout = this.onLogout.bind(this)
		this.open = this.open.bind(this)
		this.nav = this.nav.bind(this)
		this.onProjectPageTo = this.onProjectPageTo.bind(this)
		this.onProjectSearch = this.onProjectSearch.bind(this)
		this.onSearchValueChange = this.onSearchValueChange.bind(this)
		this.onEmptySearchValue = this.onEmptySearchValue.bind(this)
		this.onMyProjectPageTo = this.onMyProjectPageTo.bind(this)
		this.state = {
			loginInfo: null,
			inputURL: '',

			searchValue: '',
			searchInputValue: '',
			projects: null,
			projectsTotalCount: 0,
			projectsPage: 0,

			myProjects: null,
			myProjectsTotalCount: 0,
			myProjectsPage: 0,
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
			.zhua-projects .ant-input-search.ant-input-search-enter-button > .ant-input{
				padding-right: 80px;
			}
		`)
	}

	componentWillMount() {
		this.init()
		let _this = this
		co(function* () {
			let result = yield Service.getProjects()
			_this.setState({ projects: result.data, projectsTotalCount: result.recordCount, projectsPage: result.page })
		})
		co(function* () {
			let result = yield Service.getLoginInfo()
			_this.setState({ loginInfo: result.data })
			if (result.result && result.data) {
				let result2 = yield Service.getMyProjects()
				_this.setState({ myProjects: result2.data, myProjectsTotalCount: result2.recordCount, myProjectsPage: result2.page })
			}
		})
	}

	componentDidMount() {
		utils.doWhile(() => document.getElementById('zhua-inputURL'), () => document.getElementById('zhua-inputURL').focus())
	}

	componentWillUnmount() {
		this.domStyle.remove()
	}

	onLogin(loginInfo) {
		this.setState({ loginInfo })
		_this = this
		if (loginInfo) {
			co(function* () {
				let result2 = yield Service.getMyProjects()
				_this.setState({ myProjects: result2.data, myProjectsTotalCount: result2.recordCount, myProjectsPage: result2.page })
			})
		}
	}

	onLogout() {
		this.setState({ loginInfo: null, myProjects: null, myProjectsTotalCount: 0, myProjectsPage: 0 })
	}

	open(item) {
		co(function* () {
			yield Service.incOpen(item.id)
			yield Service.openning(item.id)
			window.location = item.siteURL
		})
	}

	nav() {
		let url = this.state.inputURL
		if (!url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://')) { url = 'http://' + url }
		if (utils.checkURL(url)) {
			co(function* () {
				yield Service.openning(null)
				window.location = url
			})
		} else {
			message.error("输入的网址不合法")
		}
	}

	onInputURLChange(e) {
		this.setState({ inputURL: e.target.value })
	}

	// 翻页(我的)
	onMyProjectPageTo(page) {
		let _this = this
		co(function* () {
			let result2 = yield Service.getMyProjects(page - 1)
			_this.setState({ myProjects: result2.data, myProjectsTotalCount: result2.recordCount, myProjectsPage: result2.page })
		})
	}

	// 翻页
	onProjectPageTo(page) {
		let _this = this
		this.setState({ searchInputValue: this.state.searchValue })
		co(function* () {
			let result = yield Service.getProjects(_this.state.searchValue, page - 1)
			_this.setState({ projects: result.data, projectsTotalCount: result.recordCount, projectsPage: result.page })
		})
	}

	// 点击搜索
	onProjectSearch() {
		// 注: 只有当 searchInputValue 与 searchValue 不相等时才搜索
		if (this.state.searchInputValue != this.state.searchValue) {
			this.setState({
				searchValue: this.state.searchInputValue,
				projectsPage: 0,
				projects: null
			})
			let _this = this
			co(function* () {
				let result = yield Service.getProjects(_this.state.searchInputValue, 0)
				_this.setState({ projects: result.data, projectsTotalCount: result.recordCount, projectsPage: result.page })
			})
		}
	}

	onSearchValueChange(e) {
		this.setState({ searchInputValue: e.target.value })
	}

	// 清空搜索
	onEmptySearchValue() {
		this.ref_search.current.focus()
		this.setState({ searchInputValue: '', searchValue: '' })

		// 注: 只有当 searchValue 有值, 说明搜索过, 才需要清空搜索
		if (this.state.searchValue) {
			let _this = this
			co(function* () {
				let result = yield Service.getProjects('', 0)
				_this.setState({ projects: result.data, projectsTotalCount: result.recordCount, projectsPage: result.page })
			})
		}
	}

	render() {

		const css_ellipsis = {
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			display: 'inline-block',
			overflow: 'hidden',
		}

		const buildProjectCard = (projects) => {
			return projects.map((item, i) => {
				return (
					<div onClick={() => this.open(item)} key={item.id} className={Styles['card-grid']} style={{ cursor: 'pointer', display: 'inline-block', width: '300px', margin: `0px ${((i + 1) % 4) ? '16px' : '0px'} 16px 0px`, border: '1px solid #e8e8e8', borderRadius: '2px' }}>
						<div style={{ borderBottom: '1px solid #e8e8e8', borderRadius: '2px 2px 0px 0px', backgroundColor: '#fafafa', padding: '12px' }}>
							<span title={item.name} style={Object.assign({}, css_ellipsis, { width: '100px', fontSize: '14px', fontWeight: 'bold' })}>{item.id} : {item.name}</span>
							<span title={item.ownerEmail} style={Object.assign({}, css_ellipsis, { width: '123px', float: 'right', fontSize: '12px', lineHeight: '21px', textAlign: 'right' })}>{item.ownerEmail}</span>
						</div>
						<div style={{ padding: '12px' }}>
							<div title={item.siteURL} style={Object.assign({}, css_ellipsis, { fontSize: '12px', width: '100%', clear: 'both', marginBottom: '4px' })}>{item.siteURL}</div>
							<div><span title={item.siteTitle} style={Object.assign({}, css_ellipsis, { width: '200px' })}>{item.siteTitle}</span><span style={{ float: 'right', fontSize: '12px', lineHeight: '22px' }}>{utils.t(item.modifyTime)}</span></div>
						</div>
					</div>
				)
			})
		}

		const spin = <Spin style={{ marginLeft: '600px', marginTop: '96px' }} indicator={<Icon type="loading" style={{ fontSize: '48px', width: 'auto', height: 'auto' }} spin />} />
		const suffix = this.state.searchInputValue ? <Icon key={1} type="close-circle" onClick={this.onEmptySearchValue} style={{ marginRight: '8px' }} /> : null;
		let siteTabPage = this.state.projects ? (
			<div className="zhua-projects">
				<Search ref={this.ref_search} suffix={suffix} value={this.state.searchInputValue} enterButton style={{ width: '300px', marginBottom: '8px' }} onSearch={this.onProjectSearch} onChange={this.onSearchValueChange} />
				<div style={{ height: '292px' }}>{buildProjectCard(this.state.projects)}</div>
				<Pagination onChange={this.onProjectPageTo} size="small" current={this.state.projectsPage + 1} total={this.state.projectsTotalCount} pageSize={8} />
			</div>
		) : spin

		let myTabPage = this.state.loginInfo ? (
			this.state.myProjects ? (
				<div className="zhua-projects">
					<div style={{ height: '292px' }}>{buildProjectCard(this.state.myProjects)}</div>
					<Pagination onChange={this.onMyProjectPageTo} size="small" current={this.state.myProjectsPage + 1} total={this.state.myProjectsTotalCount} pageSize={8} />
				</div>
			) : spin
		): (
			<div style={{ textAlign: 'center' }}>
				<span>请先登录...</span>
		</div >
		)

		// const buildProjectCard = (projects, withSearch) => {
		// 	let cards
		// 	if (projects) {
		// 		let compItems = projects.map((item, i) => {
		// 			return (
		// 				<div onClick={() => this.open(item)} key={item.id} className={Styles['card-grid']} style={{ cursor: 'pointer', display: 'inline-block', width: '300px', margin: `0px ${((i + 1) % 4) ? '16px' : '0px'} 16px 0px`, border: '1px solid #e8e8e8', borderRadius: '2px' }}>
		// 					<div style={{ borderBottom: '1px solid #e8e8e8', borderRadius: '2px 2px 0px 0px', backgroundColor: '#fafafa', padding: '12px' }}>
		// 						<span title={item.name} style={Object.assign({}, css_ellipsis, { width: '100px', fontSize: '14px', fontWeight: 'bold' })}>{item.id} : {item.name}</span>
		// 						<span title={item.ownerEmail} style={Object.assign({}, css_ellipsis, { width: '123px', float: 'right', fontSize: '12px', lineHeight: '21px', textAlign: 'right' })}>{item.ownerEmail}</span>
		// 					</div>
		// 					<div style={{ padding: '12px' }}>
		// 						<div title={item.siteURL} style={Object.assign({}, css_ellipsis, { fontSize: '12px', width: '100%', clear: 'both', marginBottom: '4px' })}>{item.siteURL}</div>
		// 						<div><span title={item.siteTitle} style={Object.assign({}, css_ellipsis, { width: '200px' })}>{item.siteTitle}</span><span style={{ float: 'right', fontSize: '12px', lineHeight: '22px' }}>{utils.t(item.modifyTime)}</span></div>
		// 					</div>
		// 				</div>
		// 			)
		// 		})
		// 		const suffix = this.state.searchInputValue ? <Icon key={1} type="close-circle" onClick={this.onEmptySearchValue} style={{ marginRight: '8px' }} /> : null;
		// 		cards = ()
		// 	} else {
		// 		cards = <Spin style={{ marginLeft: '600px', marginTop: '96px' }} indicator={<Icon type="loading" style={{ fontSize: '48px', width: 'auto', height: 'auto' }} spin />} />
		// 	}
		// 	return cards
		// }

		// let compProjects = buildProjectCard(this.state.projects, true)
		// let compMyProjects = this.state.loginInfo ? buildProjectCard(this.state.myProjects, false) : (
			
		// )

		let user
		if (this.state.loginInfo) {
			user = <span><User loginInfo={this.state.loginInfo} onLogout={this.onLogout} /></span>
		} else {
			user = <span><Login onLogin={this.onLogin} /><Register style={{ margin: '0px 16px' }} onLogin={this.onLogin} /></span>
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
				<div style={{ width: '1248px', height: '500px', display: 'inline-block', textAlign: 'left', marginTop: '36px' }}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="网站" key="1">{siteTabPage}</TabPane>
						<TabPane tab="我的" key="2">{myTabPage}</TabPane>
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