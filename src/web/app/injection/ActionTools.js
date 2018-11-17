import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'
import Mask from './Mask'
import Styles from './index.css'
import { Modal, Input, Select } from 'antd'
const Option = Select.Option;
import 'antd/lib/Modal/style'
import 'antd/lib/Select/style'

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showDialog: true
		}
		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onURLChange = this.onURLChange.bind(this)
		this.onProtocolChange = this.onProtocolChange.bind(this)
		this.getProtocol = this.getProtocol.bind(this)

		this.inputURL = null
		this.protocol = this.getProtocol(window.location.href)
	}

	onCancel(e){
		e.stopPropagation()
		this.setState({showDialog: false})
	}

	onOK(){
		window.location = this.protocol + '//' + this.inputURL
	}

	onURLChange(e){
		this.inputURL = e.currentTarget.value
	}

	onProtocolChange(e){
		this.protocol = e
	}

	getProtocol(url) {
		if (url.startsWith('http://')) { return 'http://' }
		if (url.startsWith('https://')) { return 'https://' }
		return ''
	}

	render() {
		let url = window.location.href
		let defaultValue = this.getProtocol(url)

		let selectBefore = null
		if (defaultValue) {
			url = url.substr(defaultValue.length)
			selectBefore = <Select defaultValue={defaultValue} style={{ width: 90 }} onChange={this.onProtocolChange}>
				<Option className={Styles['z-index-dialog-popup']} value="http://">http://</Option>
				<Option className={Styles['z-index-dialog-popup']} value="https://">https://</Option>
			</Select>
		}

		return (
			<Modal title="Open-URL" visible={this.state.showDialog} onCancel={this.onCancel} afterClose={this.props.onDialogCancel} onOk={this.onOK}>
				<Input addonBefore={selectBefore} defaultValue={url} onChange={this.onURLChange}/>
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
		this.onFilterMouseOver = this.onFilterMouseOver.bind(this)
		this.onFilterMouseOut = this.onFilterMouseOut.bind(this)
		this.onFilterToggleCheck = this.onFilterToggleCheck.bind(this)
		this.flushByQNodeList = this.flushByQNodeList.bind(this)
		this.state = {
			highLight: [],
			highLightRects: [],
			selection: [],
			selectionRects: [],
			opElement: null,
			opElementRect: {},
			filterTriggerRect: null,
			qNodeList: []
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
			}
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

	onFilterMouseOver(e) {
		let rect = e.target.getBoundingClientRect()
		this.setState({ filterTriggerRect: rect })
	}

	onFilterMouseOut(e) {
		if (e.relatedTarget) {
			for (let itor = e.relatedTarget; itor; itor = itor.parentElement) {
				let attr = itor.attributes['clazz']
				if (attr && attr.value == 'Filter') { return }
			}
		}
		this.setState({ filterTriggerRect: null })
	}

	flushByQNodeList(qNodeList) {
		const selection = utils.Smart.queryElements(qNodeList)
		const selectionRects = selection.map((ele) => {
			const { left, top, width, height } = ele.getBoundingClientRect()
			return {
				left: left + document.documentElement.scrollLeft,
				top: top + document.documentElement.scrollTop,
				width, height
			}
		})
		this.setState({ selection, selectionRects, qNodeList })
	}

	onFilterToggleCheck(idx, field) {
		let qNodeList = [...this.state.qNodeList]
		let node = qNodeList[idx]
		switch (field) {
			case 'tag': { node.config.tagName = !node.config.tagName } break
			case 'f': { node.config.isFirst = !node.config.isFirst } break
			case 'l': { node.config.isLast = !node.config.isLast } break
			case 'i': { node.config.index = !node.config.index } break
			case 't': { node.config.text = !node.config.text } break
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

	render() {
		const css = { position: 'absolute', pointerEvents: 'none' }
		const css_highLight = Object.assign({}, css, { border: '1px dashed #FF7F00' })
		const css_selection = Object.assign({}, css, { border: '2px dashed #FF7F00' })
		let highLightFrames = this.state.highLightRects.map((rect, i) => {
			const css_div = Object.assign({}, css_highLight, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, })
			return (<div key={`h-${i}`} style={css_div} />)
		})
		let selectionFrames = this.state.selectionRects.map((rect, i) => {
			const css_div = Object.assign({}, css_selection, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, })
			return (<div key={`s-${i}`} style={css_div} />)
		})

		let opBtns = []
		if (this.state.opElement) {
			const left = this.state.opElementRect.left
			const top = this.state.opElementRect.top + this.state.opElementRect.height
			const css_icon = { cursor: 'pointer', backgroundColor: '#FF7F00', color: '#fff', marginRight: '1px', border: '1px solid #E6E6E6', width: '16px', height: '16px' }
			opBtns.push(
				<div key={'open-url'} style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}>
					<i style={css_icon} className={utils.icon('icon-click')}></i>
					<i style={css_icon} className={utils.icon('icon-open-url')}></i>
					<i style={css_icon} className={utils.icon('icon-open-each-url')}></i>
					<i style={css_icon} className={utils.icon('icon-fetch-table')}></i>
					<i style={css_icon} clazz={Filter.clazz} onMouseOver={this.onFilterMouseOver} onMouseOut={this.onFilterMouseOut} className={utils.icon('icon-filter')}></i>
				</div>
			)
		}

		let filter = this.state.filterTriggerRect && <Filter qNodeList={this.state.qNodeList} triggerRect={this.state.filterTriggerRect} onMouseOut={this.onFilterMouseOut} onToggleCheck={this.onFilterToggleCheck} />

		return ReactDOM.createPortal([
			<Mask key={1} rects={this.state.selectionRects} />,
			<div key={2}>{highLightFrames}</div>,
			<div key={3}>{selectionFrames}</div>,
			<div key={4}>{opBtns}</div>,
			<div key={5}>{filter}</div>,
		], utils.getModalRoot());
	}
}

export class Filter extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.state = {
			explodeClassName: [],
			explodeAttributes: [],
		}
	}

	static clazz = 'Filter'

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
		const r = this.props.triggerRect
		const left = document.documentElement.scrollLeft + r.left
		const top = document.documentElement.scrollTop + r.top + r.height
		const css_frame = { position: 'absolute', left: `${left}px`, top: `${top}px`, backgroundColor: '#ccc' }

		const css_line = { lineHeight: '20px', whiteSpace: 'nowrap' }
		const css_check = { cursor: 'pointer', display: 'inline-block', height: '16px', minWidth: '16px', textAlign: 'center', marginRight: '4px', backgroundColor: '#FF7F00', color: '#fff', borderRadius: '8px', lineHeight: '16px', fontWeight: 'bold' }
		const css_uncheck = Object.assign({}, css_check, { backgroundColor: '#fff', color: '#FF7F00' })
		const css_tag_check = Object.assign({}, css_check, { padding: '0px 8px' })
		const css_tag_uncheck = Object.assign({}, css_tag_check, { backgroundColor: '#fff', color: '#FF7F00' })
		const css_explode = Object.assign({}, css_check, { backgroundColor: '#FFBE7E', color: '#fff', fontSize: '14px' })

		let lines = this.props.qNodeList.map((n, i) => {
			let checkes = []
			checkes.push(<div key={'tag'} data-key={'tag'} style={n.config.tagName ? css_tag_check : css_tag_uncheck} title={`标签`}>{n.tagName}</div>)			// tag
			// [class]
			{
				let explode = this.state.explodeClassName.indexOf(i) != -1
				let final = (n.className.length <= 3 || explode) ? n.className : n.className.slice(0, 3)
				checkes.push(...final.map((a, j) => (<div key={`c-${j}`} data-key={`c-${j}`} style={n.config.className.indexOf(j) != -1 ? css_check : css_uncheck} title={`样式:${a}`}>C</div>)))
				if (n.className.length > 3) {
					checkes.push(<div key={'e-c'} data-key={'e-c'} style={css_explode} className={utils.icon(explode ? 'icon-collape' : 'icon-explode')} />)
				}
			}
			n.isFirst && checkes.push(<div key={'f'} data-key={'f'} style={n.config.isFirst ? css_check : css_uncheck} title={'第一个'}>F</div>)				// first
			n.isLast && checkes.push(<div key={'l'} data-key={'l'} style={n.config.isLast ? css_check : css_uncheck} title={'最后一个'}>L</div>)				// last
			!n.isFirst && checkes.push(<div key={'i'} data-key={'i'} style={n.config.index ? css_check : css_uncheck} title={`第${n.index}个`}>I</div>)			// index
			n.innerText && checkes.push(<div key={'t'} data-key={'t'} style={n.config.text ? css_check : css_uncheck} title={`文本:${n.innerText}`}>T</div>)		// text
			// [attributes]
			{
				let explode = this.state.explodeAttributes.indexOf(i) != -1
				let final = (n.attributes.length <= 3 || explode) ? n.attributes : n.attributes.slice(0, 3)
				checkes.push(...final.map((a, j) => (<div key={`a-${j}`} data-key={`a-${j}`} style={n.config.attributes.indexOf(j) != -1 ? css_check : css_uncheck} title={`属性:${a.name}=${a.value}`}>A</div>)))
				if (n.attributes.length > 3) {
					checkes.push(<div key={'e-a'} data-key={'e-a'} style={css_explode} className={utils.icon(explode ? 'icon-collape' : 'icon-explode')} />)
				}
			}
			return (
				<div style={css_line} key={i}>
					{checkes}
				</div>
			)
		})
		lines.reverse()

		return (
			<div clazz={Filter.clazz} onMouseOut={this.props.onMouseOut} style={css_frame} onClick={this.onClick}>
				{lines}
			</div>
		)
	}
}

export class OpenEachURL extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick() {
		debugger
	}

	componentDidMount() {
		// window.document.addEventListener('click', this.onClick, true)
	}
	componentWillUnmount() {
		// window.document.removeEventListener('click', this.onClick, true)
	}

	render() {
		return <div> open each url </div>
	}
}

export class FetchTable extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick() {
		debugger
	}

	componentDidMount() {
		// window.document.addEventListener('click', this.onClick, true)
	}
	componentWillUnmount() {
		// window.document.removeEventListener('click', this.onClick, true)
	}

	render() {
		return <div> fetch table </div>
	}
}
