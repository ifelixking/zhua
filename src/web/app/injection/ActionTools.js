import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'
import Mask from './Mask'
import { extname } from 'path';

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onWindowResize = this.onWindowResize.bind(this)
		this.onFilterMouseOver = this.onFilterMouseOver.bind(this)
		this.onFilterMouseOut = this.onFilterMouseOut.bind(this)
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

		const selection = $(utils.Smart.toQueryString(qNodeList)).toArray()
		const selectionRects = selection.map((ele) => {
			const { left, top, width, height } = ele.getBoundingClientRect()
			return {
				left: left + document.documentElement.scrollLeft,
				top: top + document.documentElement.scrollTop,
				width, height
			}
		})
		const opElementRect = e.target.getBoundingClientRect()
		this.setState({
			selection, selectionRects, qNodeList,
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
					<i style={css_icon} clazz={Filter.clazz} onMouseOver={this.onFilterMouseOver} onMouseOut={this.onFilterMouseOut} className={utils.icon('icon-fetch-table')}></i>
				</div>
			)
		}

		let filter = this.state.filterTriggerRect && <Filter qNodeList={this.state.qNodeList} triggerRect={this.state.filterTriggerRect} onMouseOut={this.onFilterMouseOut} />

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
	}

	static clazz = 'Filter'

	render() {
		const r = this.props.triggerRect
		const left = document.documentElement.scrollLeft + r.left
		const top = document.documentElement.scrollTop + r.top + r.height
		const css_frame = { position: 'absolute', left: `${left}px`, top: `${top}px`, backgroundColor: '#ccc' }
		const css_tag = { cursor: 'pointer', display: 'inline-block', height: '15px', backgroundColor: '#FF7F00', color: '#fff', borderRadius: '8px', lineHeight: '15px', padding: '0px 8px' }
		const css_line = { lineHeight: '18px' }
		const css_check = { cursor: 'pointer', display: 'inline-block', height: '15px', minWidth: '15px', textAlign: 'center', margin: '0px 2px', backgroundColor: '#FF7F00', color: '#fff', borderRadius: '8px', lineHeight: '15px' }
		const css_uncheck = Object.assign({}, css_check, { backgroundColor: '#fff', color: '#FF7F00' })

		let lines = this.props.qNodeList.map((n, i) => {
			let checkes = []
			checkes.push(<div key={'tag'} style={css_tag} title={`标签`}>{n.tagName}</div>)			// tag
			checkes.push(...n.className.map((a, i) => (<div key={`c-${i}`} style={css_uncheck} title={`样式:${a}`}>C</div>)))	// [class]
			n.isFirst && checkes.push(<div key={'f'} style={css_uncheck} title={'第一个'}>F</div>)			// first
			n.isLast && checkes.push(<div key={'l'} style={css_uncheck} title={'最后一个'}>L</div>)			// last
			!n.isFirst && checkes.push(<div key={'i'} style={css_uncheck} title={`第${n.index}个`}>I</div>)			// index
			n.innerText && checkes.push(<div key={'t'} style={css_uncheck} title={`文本:${n.innerText}`}>T</div>)					// text
			checkes.push(...n.attributes.map((a, i) => (<div key={`a-${i}`} style={css_uncheck} title={`属性:${a.name}=${a.value}`}>A</div>)))		// [attributes]

			return (
				<div style={css_line} key={i}>
					<nobr>
						{checkes}
					</nobr>
				</div>
			)
		})
		lines.reverse()

		return (
			<div clazz={Filter.clazz} onMouseOut={this.props.onMouseOut} style={css_frame}>
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
