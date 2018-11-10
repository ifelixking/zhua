import React from 'react'
import * as utils from '../../utils'

export class OpenURL extends React.Component{
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick(e) {
		if (e.path.find(ele => ele.id == utils.ROOT_ELEMENT_ID)) { return; }
		e.stopPropagation(); e.preventDefault(); e.stopImmediatePropagation(); e.returnValue = false; return false
	}

	componentDidMount(){
		window.document.addEventListener('click', this.onClick, true)
	}
	componentWillUnmount(){
		window.document.removeEventListener('click', this.onClick, true)
	}

	render(){
		return <div> open url </div>
	}
}

export class OpenEachURL extends React.Component{
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick() {
		debugger
	}

	componentDidMount(){
		// window.document.addEventListener('click', this.onClick, true)
	}
	componentWillUnmount(){
		// window.document.removeEventListener('click', this.onClick, true)
	}

	render(){
		return <div> open each url </div>
	}
}

export class FetchTable extends React.Component{
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick() {
		debugger
	}

	componentDidMount(){
		// window.document.addEventListener('click', this.onClick, true)
	}
	componentWillUnmount(){
		// window.document.removeEventListener('click', this.onClick, true)
	}

	render(){
		return <div> fetch table </div>
	}
}
