import React from 'react'
import { getSVGTextSize } from '../../utils'

export default class PanelAction extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			actionStore: {
				start: 1,
				actions: [
					{ id: 1, type: 'open-url', next: 2 },
					{
						id: 2, type: 'open-each-url', next: 4, actionStore: {
							start: 3,
							actions: [
								{ id: 3, type: 'fetch-table' },
							]
						}
					},
					{ id: 4, type: 'open-url', next: 2 },
				]
			}
		}
	}
	static title = "动作"

	render() {

		debugger;

		let blocks = [], line = 10, dicExist = {}
		const f = (blocks, parent, action) => {
			// child
			let childBlocks = null
			if (action.actionStore) {
				childBlocks = []
				if (action.actionStore.start) {
					f(childBlocks, action.actionStore, action.actionStore.actions.find(item => item.id == action.actionStore.start))
				}
			}

			// block
			let block = <Block key={action.id} position={{ x: 10, y: line }} text={action.type}>{childBlocks}</Block>
			blocks.push(block)
			dicExist[action.id] = block
			line += 50

			// next
			if (action.next) {
				let nextBlock = dicExist[action.next]
				if (!nextBlock) {
					nextBlock = f(blocks, parent, parent.actions.find(item => item.id == action.next))
				}
				// arrow
			}
			return block
		}
		f(blocks, this.state.actionStore, this.state.actionStore.actions.find(action => action.id == this.state.actionStore.start))

		return (
			<svg width={'100%'} height={'100%'}>
				{blocks}
			</svg>
		)
	}
}

class Block extends React.Component {
	constructor(props) {
		super(props)
		this.calcTextSize = this.calcTextSize.bind(this)
		this.textSize = null
	}

	componentWillReceiveProps(next) {
		(next.text != this.props.text) && this.calcTextSize()
	}

	componentWillMount() {
		this.calcTextSize()
	}

	calcTextSize() {
		this.textSize = getSVGTextSize(this.props.text)
	}

	render() {
		const padding = { x: 16, y: 8 }
		const size = { width: this.textSize.width + (padding.x << 1), height: this.textSize.height + (padding.y << 1) }

		let g
		if (this.props.children && this.props.children.length) {
			<g transform={`translate(${this.props.position.x}, ${this.props.position.y})`}>
				<rect width={this.props.size.width} height={this.props.size.height} rx="4" ry="4" style={{ fill: '#70AD47', strokeWidth: 1, stroke: '#507E32' }} />
				<text fill="#fff" x={this.props.size.width >> 1} y={this.props.size.height >> 1} textAnchor="middle" dominantBaseline="middle">{this.props.text}</text>
			</g>
		} else {
			g = <g transform={`translate(${this.props.position.x}, ${this.props.position.y})`}>
				<rect width={size.width} height={size.height} rx="4" ry="4" style={{ fill: '#70AD47', strokeWidth: 1, stroke: '#507E32' }} />
				<text fill="#fff" x={size.width >> 1} y={(size.height >> 1) + 1} textAnchor="middle" dominantBaseline="middle">{this.props.text}</text>
			</g>
		}

		return g
	}
}