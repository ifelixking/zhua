import React from 'react'
import { connect } from 'react-redux';
import * as Actions from './action'
import Icon from './Common/Icon'

export default connect(
	state => {
		return { projectStore: state.projectStore, theState: state.panelResource_state }
	},
	dispatch => {
		return {
			loadProjects: () => {
				dispatch(Actions.fetchProjects())
			},
			switchPage: (page) => {
				dispatch({ type: 'PANELRESOURCE_SWITCH', page })
			}
		}
	}
)(class PanelResource extends React.Component {
	constructor(props) {
		super(props)
		this.onBtnHomeClick = this.onBtnHomeClick.bind(this)
		this.onSearch = this.onSearch.bind(this)
		this.onBtnMineClick = this.onBtnMineClick.bind(this)
	}
	static title = "资源"

	componentWillMount() {
		// TODO: 判断上次请求时间, 适时请求
		// this.props.loadProjects()
	}

	onBtnHomeClick() {
		this.props.switchPage('home')
	}

	onSearch() {
		this.props.switchPage('list')
	}

	onBtnMineClick() {
		this.props.switchPage('user')
	}

	render() {

		let page, showHome = true, showMine = true, showSearch = true
		switch (this.props.theState.get('page')) {
			case 'list': { page = <List />; } break;
			case 'detail': { page = <Detail />; } break;
			case 'user': { page = <User />; } break;
			default: { page = <Home />; showSearch = false } break;
		}

		return (
			<div>
				<Bar onBtnHomeClick={this.onBtnHomeClick} onBtnMineClick={this.onBtnMineClick} onSearch={this.onSearch} showSearch={showSearch} />
				{page}
			</div>
		)



		// return this.props.projectStore.get('projects').map(item => {
		// 	return <div>{item.ownerEmail}</div>
		// })
	}
})

class Bar extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {

		let btns = []

		btns.push(<a href='javascript:;' onClick={this.props.onBtnHomeClick}>主页</a>)
		this.props.showSearch && btns.push(<Search mini placeholder="input search text" onSearch={this.props.onSearch} />)
		btns.push(<a href='javascript:;' onClick={this.props.onBtnMineClick}>我的</a>)

		return <div width={{ width: '100%' }}>
			{btns}
		</div>
	}
}

class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		const css_input = {
			border: '1px solid #FF7F00',
			lineHeight: this.props.mini ? '24px' : '32px',
			fontSize: '14px',
			borderTopLeftRadius: '16px',
			borderBottomLeftRadius: '16px',
			padding: '0px 16px',
			width: '160px',
			fontWeight: 'bold',
			boxSizing: 'border-box',
			margin: '0px',

		}
		const css_span = {
			display: 'inline-block',
			backgroundColor: '#ff7f00',
			height: this.props.mini ? '26px' : '34px',
			lineHeight: this.props.mini ? '26px' : '34px',
			padding: this.props.mini ? '0px 12px 0px 6px' : '0px 16px 0px 8px',
			borderTopRightRadius: '16px',
			borderBottomRightRadius: '16px',
			color: '#fff',
			fontSize: '14px',
			cursor: 'pointer',
		}

		const css_frame = {
			textAlign: 'center',
			verticalAlign: 'middle',
			whiteSpace: 'nowrap',
		}

		let text = this.props.mini ? <Icon name='icon-search' style={{ fontSize: '14px', color: '#fff' }} /> : '搜索'

		return (
			<div style={css_frame}>
				<input style={css_input} onKeyDown={(e) => { e.keyCode == 13 && this.props.onSearch() }} onChange={(e) => { this.props.onSearchTextChange(e.target.value) }} value={this.props.searchText} />
				<span style={css_span} onClick={this.props.onSearch}>{text}</span>
			</div>
		)
	}
}

const Home = connect(
	state => {
		return {
			searchText: state.panelResource_state.get('searchText')
		}
	},
	dispatch => {
		return {
			onSearch: () => { },
			onSearchTextChange: (value) => {
				dispatch({ type: 'PANELRESOURCE_SEARCH_TEXT_CHANGE', searchText: value })
			}
		}
	}
)(class extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {

		let search = (
			<div style={{ padding: '48px 0px' }}>
				<Search searchText={this.props.searchText} onSearchTextChange={this.props.onSearchTextChange} />
			</div>
		)

		return <div>{search}</div>
	}
})

class List extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div>list</div>
	}
}

class Detail extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div>detail</div>
	}
}

class User extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div>user</div>
	}
}