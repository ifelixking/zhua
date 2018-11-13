import React from 'react'
import ReactDOM from 'react-dom'
import * as utils from '../../utils'

export default class Mask extends React.Component {
	constructor(props) {
		super(props)
		this.onResize = this.onResize.bind(this)
		this.state = {
			width: document.body.scrollWidth, height: document.body.scrollHeight,
		}
	}

	componentWillMount() {
		window.addEventListener('resize', this.onResize, true)
		document.body.addEventListener('resize', this.onResize, true)
	}

	componentWillUnmount() {		
		document.body.removeEventListener('resize', this.onResize, true)
		window.removeEventListener('resize', this.onResize, true)
	}

	onResize(e) {
		this.setState({ width: document.body.scrollWidth, height: document.body.scrollWidth })
	}

	render() {
		const w = document.body.scrollWidth, h = document.body.scrollHeight
		const css_svg = { position: 'absolute', top: '0px', left: '0px', width: `${w}`, height: `${h}`, pointerEvents: 'none' }
		const holes = this.props.rects.map(r => `M${r.left} ${r.top} L${r.left} ${r.top + r.height} L${r.left + r.width} ${r.top + r.height} L${r.left + r.width} ${r.top} Z`).join(' ')
		return ReactDOM.createPortal([
			<svg key={1} style={css_svg}>
				<path fill="#000" fillOpacity="0.5" d={`M0 0 L${w} 0 L${w} ${h} L0 ${h} Z ${holes}`}></path>
			</svg>
		], utils.getModalRoot());
	}
}