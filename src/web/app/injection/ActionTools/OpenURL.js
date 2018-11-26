import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../../utils'
import Mask from '../Common/Mask'
import Styles from '../index.css'
import { Modal, Input, Select } from 'antd'
const Option = Select.Option;
import 'antd/lib/Modal/style'
import 'antd/lib/Select/style'
import Icon from '../Common/Icon'

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showDialog: true,
			inputURL: '',
			protocol: '',
		}

		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onURLChange = this.onURLChange.bind(this)
		this.onProtocolChange = this.onProtocolChange.bind(this)
		this.getProtocol = this.getProtocol.bind(this)
	}

	componentWillMount() {
		let protocol = this.getProtocol(window.location.href)
		let inputURL = window.location.href.substr(protocol.length)
		this.setState({ protocol, inputURL })
	}

	onCancel(e) {
		e.stopPropagation()
		this.setState({ showDialog: false })
	}

	onOK() {
		window.location = this.state.protocol + '//' + this.state.inputURL
	}

	onURLChange(e) {
		let protocol = this.getProtocol(e.currentTarget.value.toLowerCase())
		let inputURL = e.currentTarget.value
		if (protocol) {
			this.setState({ protocol })
			inputURL = inputURL.substr(protocol.length)
		}
		this.setState({ inputURL })
	}

	onProtocolChange(protocol) {
		this.setState({ protocol })
	}

	getProtocol(url) {
		if (url.startsWith('http://')) { return 'http://' }
		if (url.startsWith('https://')) { return 'https://' }
		return ''
	}

	render() {
		let selectBefore = null
		if (this.state.protocol) {
			selectBefore = <Select value={this.state.protocol} style={{ width: 90 }} onChange={this.onProtocolChange}>
				<Option className={Styles['z-index-dialog-popup']} value="http://">http://</Option>
				<Option className={Styles['z-index-dialog-popup']} value="https://">https://</Option>
			</Select>
		}

		return (
			<Modal title="Open-URL" visible={this.state.showDialog} onCancel={this.onCancel} afterClose={this.props.onDialogCancel} onOk={this.onOK}>
				<Input addonBefore={selectBefore} value={this.state.inputURL} onChange={this.onURLChange} onPressEnter={this.onOK} />
			</Modal>
		)
	}
}

export class OpenURLNext extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onWindowResize = this.onWindowResize.bind(this)
		this.onFilterClick = this.onFilterClick.bind(this)
		this.onFilterToggleCheck = this.onFilterToggleCheck.bind(this)
		this.flushByQNodeList = this.flushByQNodeList.bind(this)
		this.onBtnFetchTableClick = this.onBtnFetchTableClick.bind(this)
		this.state = {
			highLight: [],
			highLightRects: [],
			selection: [],
			selectionRects: [],
			opElement: null,
			opElementRect: {},
			filterPosition: null,
			qNodeList: [],
			// showFilter : false,
		}
	}

	onMouseMove(e) {
		if (utils.eventFilterRoot(e)) { return true }
		let highLight
		if (this.state.selection.indexOf(e.target) != -1) {
			highLight = []
		} else {
			highLight = [e.target]
		}
		this.setState({
			highLight, highLightRects: highLight.map(ele => {
				const { left, top, width, height } = ele.getBoundingClientRect()
				return {
					left: left + document.documentElement.scrollLeft,
					top: top + document.documentElement.scrollTop,
					width, height
				}
			})
		})
		return false
	}

	onMouseDown(e) {
		if (utils.eventFilterRoot(e)) { return true }
		return false
	}

	onClick(e) {
		if (utils.eventFilterRoot(e)) { return true }
		const qNodeList = utils.Smart.analysePath(e.target)
		this.flushByQNodeList(qNodeList)
		const opElementRect = e.target.getBoundingClientRect()
		this.setState({
			opElement: e.target, opElementRect: {
				left: opElementRect.left + document.documentElement.scrollLeft,
				top: opElementRect.top + document.documentElement.scrollTop,
				width: opElementRect.width, height: opElementRect.height
			}, filterPosition: null
		})

		return false
	}

	onWindowResize(e) {
		const opElementRect = this.state.opElement.getBoundingClientRect()
		this.setState({
			selectionRects: this.state.selection.map((ele) => {
				const { left, top, width, height } = ele.getBoundingClientRect()
				return {
					left: left + document.documentElement.scrollLeft,
					top: top + document.documentElement.scrollTop,
					width: width, height: height
				}
			}),
			highLightRects: this.state.highLight.map(ele => {
				const { left, top, width, height } = ele.getBoundingClientRect()
				return {
					left: left + document.documentElement.scrollLeft,
					top: top + document.documentElement.scrollTop,
					width, height
				}
			}),
			opElementRect: {
				left: opElementRect.left + document.documentElement.scrollLeft,
				top: opElementRect.top + document.documentElement.scrollTop,
				width: opElementRect.width, height: opElementRect.height
			}
		})
	}

	componentDidMount() {
		window.document.addEventListener('mousemove', this.onMouseMove, true)
		window.document.addEventListener('mousedown', this.onMouseDown, true)
		window.document.addEventListener('click', this.onClick, true)
		window.addEventListener('resize', this.onWindowResize, true)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize, true)
		window.document.removeEventListener('mousemove', this.onMouseMove, true)
		window.document.removeEventListener('mousedown', this.onMouseDown, true)
		window.document.removeEventListener('click', this.onClick, true)
	}

	onFilterClick(e) {
		e.stopPropagation()
		let rect = e.currentTarget.getBoundingClientRect()
		let position = { x: document.documentElement.scrollLeft + rect.left, y: document.documentElement.scrollTop + rect.top + rect.height + 4 }
		this.setState({ filterPosition: this.state.filterPosition ? null : position })
	}

	flushByQNodeList(qNodeList) {
		let jqExpr = utils.Smart.toQueryString(qNodeList)
		let selection = $(jqExpr).toArray()
		const selectionRects = selection.map((ele) => {
			const { left, top, width, height } = ele.getBoundingClientRect()
			return {
				left: left + document.documentElement.scrollLeft,
				top: top + document.documentElement.scrollTop,
				width, height
			}
		})
		this.setState({ selection, selectionRects, qNodeList, jqExpr })
	}

	onFilterToggleCheck(idx, field) {
		let qNodeList = [...this.state.qNodeList]
		let node = qNodeList[idx]
		switch (field) {
			case 'tag': { node.config.tagName = !node.config.tagName } break
			case 'f': { node.config.isFirst = !node.config.isFirst } break
			case 'l': { node.config.isLast = !node.config.isLast } break
			case 'i': { node.config.index = !node.config.index } break
			case 't': { node.config.innerText = !node.config.innerText } break
			default: {
				if (field[0] == 'c') {
					let i = parseInt(field.substr(2))
					utils.toggleArray(node.config.className, i)
				} else if (field[0] == 'a') {
					let i = parseInt(field.substr(2))
					utils.toggleArray(node.config.attributes, i)
				} break
			}
		}
		this.flushByQNodeList(qNodeList)
	}

	onBtnFetchTableClick() {
		this.props.onBtnFetchTableClick(this.state.qNodeList)
	}

	render() {
		const css = { position: 'absolute', pointerEvents: 'none' }
		const css_highLight = Object.assign({}, css, { border: '1px dashed #FF7F00' })
		const css_selection = Object.assign({}, css, { border: '2px dashed #FF7F00' })
		let rectGroups = [
			{ style: css_selection, rects: this.state.selectionRects, hole: true },
			{ style: css_highLight, rects: this.state.highLightRects }
		]
		let mask = <Mask key={'mask'} rectGroups={rectGroups} />

		let opBtns = null
		if (this.state.opElement) {
			const left = this.state.opElementRect.left
			const top = this.state.opElementRect.top + this.state.opElementRect.height + 4
			const css_icon = { borderRadius: '3px', boxShadow: '0px 0px 6px #000', cursor: 'pointer', backgroundColor: '#FF7F00', marginRight: '4px', display: 'inline-block', width: '20px', height: '20px', lineHeight: '20px', textAlign: 'center' }
			let buttons = [];
			// (this.state.selection.length == 1) && (buttons.push(<div title={'点击'} key={'click'} style={css_icon}><Icon style={{color: '#fff'}} name='icon-click' /></div>));
			(this.state.selection.length == 1) && (buttons.push(<div title={'打开连接'} key={'open-url'} style={css_icon}><Icon style={{ color: '#fff' }} name='icon-open-url' /></div>));
			(this.state.selection.length > 0) && (buttons.push(<div title={'打开每个连接'} key={'open-each-url'} style={css_icon}><Icon style={{ color: '#fff' }} name='icon-open-each-url' /></div>));
			(this.state.selection.length > 0) && (buttons.push(<div onClick={this.onBtnFetchTableClick} title={'抓取数据'} key={'fetch-table'} style={css_icon}><Icon style={{ color: '#fff' }} name='icon-fetch-table' /></div>));
			buttons.push(<div title={`自定义筛选, 目前已选中${this.state.selection.length}条`} key={'filter'} style={css_icon} onClick={this.onFilterClick}><Icon style={{ color: '#fff' }} name='icon-filter' /></div>)
			opBtns = (
				<div key={'opBtns'} style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, width: `${(buttons.length + 1) * 24}px` }}>
					{buttons}
				</div>
			)
		}

		let filter = this.state.filterPosition && <Filter key={'filter'} jqExpr={this.state.jqExpr} qNodeList={this.state.qNodeList} position={this.state.filterPosition} onMouseOut={this.onFilterMouseOut} onToggleCheck={this.onFilterToggleCheck} />
		return ReactDOM.createPortal([mask, opBtns, filter], utils.getModalRoot());
	}
}

// ===========================================================================================================================================================================================================================================================================================================================
class Filter extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.state = {
			explodeClassName: [],
			explodeAttributes: [],
		}
	}

	onClick(e) {
		if (e.target) {
			const key = e.target.attributes['data-key']
			if (key) {
				let idx = utils.getElementRIndex(e.target.parentElement)
				if (key.value == 'e-c') {
					let explodeClassName = [...this.state.explodeClassName]
					utils.toggleArray(explodeClassName, idx)
					this.setState({ explodeClassName })
				} else if (key.value == 'e-a') {
					let explodeAttributes = [...this.state.explodeAttributes]
					utils.toggleArray(explodeAttributes, idx)
					this.setState({ explodeAttributes })
				} else {
					this.props.onToggleCheck(idx, key.value)
				}
			}
		}
	}

	render() {
		const css_frame = { position: 'absolute', left: `${this.props.position.x}px`, top: `${this.props.position.y}px`, backgroundColor: 'transparent' }

		const css_line = { lineHeight: '20px', whiteSpace: 'nowrap' }
		const css_check = { boxShadow: '0px 0px 6px #000', cursor: 'pointer', display: 'inline-block', height: '16px', minWidth: '16px', textAlign: 'center', marginRight: '4px', backgroundColor: '#FF7F00', color: '#fff', borderRadius: '8px', lineHeight: '16px', fontWeight: 'bold' }
		const css_uncheck = Object.assign({}, css_check, { backgroundColor: '#fff', color: '#FF7F00' })
		const css_tag_check = Object.assign({}, css_check, { padding: '0px 8px' })
		const css_tag_uncheck = Object.assign({}, css_tag_check, { backgroundColor: '#fff', color: '#FF7F00' })
		const css_explode = Object.assign({}, css_check, { backgroundColor: '#FFBE7E', color: '#fff', fontSize: '14px' })
		const css_expr = { backgroundColor: '#fff', padding: '0px 8px', borderRadius: '8px', boxShadow: '0px 0px 6px #000' }

		let lines = this.props.qNodeList.map((n, i) => {
			let checkes = []
			// tag
			checkes.push(

				<div key={'tag'} data-key={'tag'} style={n.config.tagName ? css_tag_check : css_tag_uncheck} title="标签">{n.tagName}</div>

			)
			// [class]
			{
				let explode = this.state.explodeClassName.indexOf(i) != -1
				let final = (n.className.length <= 3 || explode) ? n.className : n.className.slice(0, 3)
				checkes.push(...final.map((a, j) => (
					<div key={`c-${j}`} data-key={`c-${j}`} style={n.config.className.indexOf(j) != -1 ? css_check : css_uncheck} title={`样式:${a}`}>C</div>
				)))
				if (n.className.length > 3) {
					checkes.push(<div key={'e-c'} data-key={'e-c'} style={css_explode} className={utils.icon(explode ? 'icon-collape' : 'icon-explode')} />)
				}
			}
			// first
			n.isFirst && !n.isLast && checkes.push(
				<div key={'f'} data-key={'f'} style={n.config.isFirst ? css_check : css_uncheck} title={'第一个'}>F</div>
			)
			// last
			n.isLast && !n.isFirst && checkes.push(
				<div key={'l'} data-key={'l'} style={n.config.isLast ? css_check : css_uncheck} title={'最后一个'}>L</div>
			)
			// index
			!n.isFirst && !n.isLast && checkes.push(
				<div key={'i'} data-key={'i'} style={n.config.index ? css_check : css_uncheck} title={`第${n.index + 1}个`}>I</div>
			)
			// text
			n.innerText && n.innerText.length <= 16 && checkes.push(
				<div key={'t'} data-key={'t'} style={n.config.innerText ? css_check : css_uncheck} title={`文本:${n.innerText}`}>T</div>
			)
			// [attributes]
			{
				let explode = this.state.explodeAttributes.indexOf(i) != -1
				let final = (n.attributes.length <= 3 || explode) ? n.attributes : n.attributes.slice(0, 3)
				checkes.push(...final.map((a, j) => (
					<div key={`a-${j}`} data-key={`a-${j}`} style={n.config.attributes.indexOf(j) != -1 ? css_check : css_uncheck} title={`属性:${a.name}=${decodeURI(a.value)}`}>A</div>
				)))
				if (n.attributes.length > 3) {
					checkes.push(<div key={'e-a'} data-key={'e-a'} style={css_explode} className={utils.icon(explode ? 'icon-collape' : 'icon-explode')} />)
				}
			}
			return (<div style={css_line} key={i}>{checkes}</div>)
		})
		lines.reverse()

		return (
			<div onMouseOut={this.props.onMouseOut} style={css_frame} onClick={this.onClick}>
				<div>{lines}</div>
				<div style={css_line}><span style={css_expr}>{this.props.jqExpr}</span></div>
			</div>
		)
	}
}