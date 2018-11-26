import React from 'react'

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
		let holes = []
		let groups = this.props.rectGroups.map((group, i) => {
			group.hole && holes.push(...(group.rects.map(r => `M${r.left} ${r.top} L${r.left} ${r.top + r.height} L${r.left + r.width} ${r.top + r.height} L${r.left + r.width} ${r.top} Z`)))
			return (<div key={i}>{group.rects.map((rect, j) => {
				const css_div = Object.assign({}, group.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, })
				return (<div key={`s-${j}`} style={css_div} />)
			})}</div>)
		})
		const w = document.body.scrollWidth, h = document.body.scrollHeight
		const css_svg = { position: 'absolute', top: '0px', left: '0px', width: `${w}`, height: `${h}`, pointerEvents: 'none' }
		return (
			<div>
				<svg key={-1} style={css_svg}>
					<path fill="#000" fillOpacity="0.5" d={`M0 0 L${w} 0 L${w} ${h} L0 ${h} Z ${holes.join(' ')}`}></path>
				</svg>
				{[...groups]}
			</div>
		)
	}
}