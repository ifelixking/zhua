import React from 'react'

export default class OpenEachURL extends React.Component {
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

