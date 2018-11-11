import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'

export class OpenURL extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.state = {
			highLight: []
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
		let highLightRect = this.state.highLight.map((ele, i) => {
			const rect = ele.getBoundingClientRect()
			const css = {
				position: 'absolute',
				left: `${rect.left + document.documentElement.scrollLeft}px`,
				top: `${rect.top + document.documentElement.scrollTop}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
				border: '2px dashed #FF7F00',
				pointerEvents: 'none'
			}
			return (
				<div key={i} style={css}></div>
			)
		})
		return ReactDOM.createPortal(highLightRect, utils.getModalRoot());
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
