import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'
// import Styles from './index.css'

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.state = {
			highLight: [],
			selection: [],
			opElement: null,
		}
	}

	onMouseMove(e) {
		if (utils.eventFilterRoot(e)) { return true }
		this.setState({ highLight: [e.target] })
		return false
	}

	onMouseDown(e) {
		if (utils.eventFilterRoot(e)) { return true }
		return false
	}

	onClick(e) {
		if (utils.eventFilterRoot(e)) { return true }
		this.setState({ selection: [e.target], opElement: e.target })
		return false
	}

	componentDidMount() {
		window.document.addEventListener('mousemove', this.onMouseMove, true)
		window.document.addEventListener('mousedown', this.onMouseDown, true)
		window.document.addEventListener('click', this.onClick, true)
	}

	componentWillUnmount() {
		window.document.removeEventListener('mousemove', this.onMouseMove, true)
		window.document.removeEventListener('mousedown', this.onMouseDown, true)
		window.document.removeEventListener('click', this.onClick, true)
	}

	render() {
		const css = { position: 'absolute', pointerEvents: 'none' }
		const css_highLight = Object.assign({}, css, { border: '1px dashed #FF7F00' })
		const css_selection = Object.assign({}, css, { border: '2px dashed #FF7F00' })
		let highLightRects = this.state.highLight.map((ele, i) => {
			const rect = ele.getBoundingClientRect()
			const css_div = Object.assign({}, css_highLight, {
				left: `${rect.left + document.documentElement.scrollLeft}px`,
				top: `${rect.top + document.documentElement.scrollTop}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
			})
			return (<div key={`h-${i}`} style={css_div} />)
		})
		let selectionRects = this.state.selection.map((ele, i) => {
			const rect = ele.getBoundingClientRect()
			const css_div = Object.assign({}, css_selection, {
				left: `${rect.left + document.documentElement.scrollLeft}px`,
				top: `${rect.top + document.documentElement.scrollTop}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
			})
			return (<div key={`s-${i}`} style={css_div} />)
		})
		let opBtns = []
		if (this.state.opElement) {
			const clientRect = this.state.opElement.getBoundingClientRect()
			const left = clientRect.left + document.documentElement.scrollLeft
			const top = clientRect.top + document.documentElement.scrollTop + clientRect.height
			const css_icon = { cursor:'pointer', backgroundColor: '#FF7F00', color:'#fff',marginRight:'1px',border:'1px solid #E6E6E6', width:'16px', height:'16px' }
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
			<div key={1}>{highLightRects}</div>,
			<div key={2}>{selectionRects}</div>,
			<div key={3}>{opBtns}</div>,
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
