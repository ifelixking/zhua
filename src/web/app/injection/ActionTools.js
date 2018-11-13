import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'
import Mask from './Mask'

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onWindowResize = this.onWindowResize.bind(this)
		this.state = {
			highLight: [],
			highLightRects: [],
			selection: [],
			selectionRects: [],
			opElement: null,
			opElementRect: {}
		}
	}

	onMouseMove(e) {
		if (utils.eventFilterRoot(e)) { return true }
		const highLight = [e.target]
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
		const selection = [e.target]
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
			selection, selectionRects,
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
				</div>
			)
		}
		return ReactDOM.createPortal([
			<Mask rects={this.state.selectionRects} />,
			<div>{highLightFrames}</div>,
			<div>{selectionFrames}</div>,
			<div>{opBtns}</div>			
		], utils.getModalRoot());
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
