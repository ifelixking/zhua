import React from 'react'
import ReactDOM from 'react-dom'
import { Tabs, Input } from 'antd'
import 'antd/lib/Tabs/style'
import 'antd/lib/Input/style'
const TabPane = Tabs.TabPane
import Icon from '../injection/Common/Icon'
import * as Service from '../../service'
import co from 'co'
import * as utils from '../../utils'
import Styles from '../injection/index.css'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillMount() {
		let _this = this
		co(function* () {
			let result = yield Service.getProjects()
			_this.setState({ lastProjects: result.data })
		})
	}

	render() {

		const css_ellipsis = {
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			display: 'inline-block',
			overflow: 'hidden',
		}

		let lastProjects
		if (this.state.lastProjects) {
			lastProjects = this.state.lastProjects.map(item => {
				return (
					<div className={Styles['card-grid']} style={{ cursor:'pointer', display: 'inline-block', width: '300px', margin: '0px 16px 16px 0px', border: '1px solid #e8e8e8', borderRadius: '2px' }}>
						<div style={{ borderBottom: '1px solid #e8e8e8', borderRadius: '2px 2px 0px 0px', backgroundColor: '#fafafa', padding: '12px' }}>
							<span title={item.name} style={Object.assign({}, css_ellipsis, { width: '100px', fontSize: '14px', fontWeight: 'bold' })}>{item.name}</span>
							<span title={item.ownerEmail} style={Object.assign({}, css_ellipsis, { width: '123px', float: 'right', fontSize: '12px', lineHeight:'21px' })}>{item.ownerEmail}</span>
						</div>
						<div style={{ padding: '12px' }}>
							<div title={item.siteURL} style={Object.assign({}, css_ellipsis, { fontSize:'12px', width: '100%', clear: 'both', marginBottom: '4px' })}>{item.siteURL}</div>
							<div><span title={item.siteTitle} style={Object.assign({}, css_ellipsis, { width: '200px' })}>{item.siteTitle}</span><span style={{ float: 'right', fontSize: '12px', lineHeight: '22px' }}>{utils.t(item.modifyTime)}</span></div>
						</div>
					</div>
				)
			})
		}

		return (
			<div style={{ padding: '16px 32px' }}>
				<div><span style={{ float: 'right', cursor: 'pointer' }}>登录</span></div>
				<div style={{ clear: 'both', textAlign: 'center', marginTop: '64px' }}>
					<h1 style={{ fontSize: '48px', color: '#FF7F00' }}>Zhua</h1>
				</div>
				<div style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
					<Input size="large" style={{ width: '640px', }} placeholder="输入要抓取信息的网址" />
					<div style={{ display: 'inline-block', marginLeft: '16px', background: '#ff5f00', padding: '0px 12px', borderRadius: '4px', lineHeight: '32px', boxSizing: 'border-box', cursor: 'pointer' }}>
						<Icon style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }} name='icon-enter' />
					</div>
				</div>
				<div style={{ margin: '40px 48px', minHeight: '320px' }}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="最新" key="1">{lastProjects}</TabPane>
						<TabPane tab="最热" key="2">Content of Tab Pane 2</TabPane>
					</Tabs>
				</div>
				<div style={{ textAlign: 'center' }}>
					<span style={{ fontFamily: '宋体', fontSize: '12px' }}>Copyright &copy;2019 zhua</span>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))