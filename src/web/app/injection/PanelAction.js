import React from 'react'
import * as utils from '../../utils'
import * as ActionTools from './ActionTools'

export default class PanelAction extends React.Component {
	constructor(props) {
		super(props)

		this.buildUIActionStore = this.buildUIActionStore.bind(this)

		this.state = {}

		this.uiStart = null

		this.config = {
			blockPadding: { x: 16, y: 8 },
			blockMargin: { x: 0, y: 32 },
			lineOffset: 8,
			lineWidth: 8,
		}

	}
	static title = "动作"

	buildUIActionStore() {
		const f = (action, uiList, parentStore, offset) => {

			let ui = { action }; uiList.push(ui)
			const textSize = utils.getCachedSVGTextSize(action.type)
			ui.blockSize = { width: textSize.width + (this.config.blockPadding.x << 1), height: textSize.height + (this.config.blockPadding.y << 1) }

			// child
			if (action.actionStore) {
				ui.children = []; let childOffset = { y: this.config.blockMargin.y, maxWidth: ui.blockSize.width }
				const startAction = action.actionStore.actions.find(a => a.id == action.actionStore.start)
				ui.childStart = f(startAction, ui.children, action.actionStore, childOffset)
				ui.frameSize = { width: childOffset.maxWidth, height: ui.blockSize.height + childOffset.y }
			}
			ui.position = { /*x: this.config.blockPadding.x,*/ y: offset.y };
			offset.y += (ui.frameSize || ui.blockSize).height + this.config.blockMargin.y
			let outFrameWidth = (ui.frameSize || ui.blockSize).width + (this.config.blockPadding.x << 1)
			offset.maxWidth < outFrameWidth && (offset.maxWidth = outFrameWidth)

			// next
			if (action.next) {
				let uiNext = uiList.find(u => u.action.id == action.next)
				if (!uiNext) {
					let actionNext = parentStore.actions.find(a => a.id == action.next)
					uiNext = f(actionNext, uiList, parentStore, offset)
				} else {
					offset.maxWidth += (this.config.lineWidth << 2)
				}
				ui.next = uiNext
			}

			return ui

		}

		let startAction = this.props.actionStore.actions.find(action => action.id == this.props.actionStore.start)
		let uiList = [], offset = { y: 10, maxWidth: 0 }
		this.uiStart = f(startAction, uiList, this.props.actionStore, offset)

		return { width: offset.maxWidth, height: offset.y }
	}

	render() {

		// blocks
		const totalSize = this.buildUIActionStore()
		const css_line = { fill: 'none', stroke: '#70AD47', strokeWidth: this.config.lineWidth, markerEnd: 'url(#arrow)' }
		let blocks = [], line = 10, exists = [], currentAction = null
		const f = (ui, blocks, frameWidth) => {
			const width = (ui.frameSize || ui.blockSize).width
			const height = (ui.frameSize || ui.blockSize).height
			ui.position.x = (frameWidth - width) >> 1

			// child
			let childBlocks = null
			if (ui.children) {
				const x1 = (width >> 1), y1 = this.config.lineOffset;
				const x2 = x1, y2 = ui.childStart.position.y - this.config.lineOffset - this.config.lineWidth;
				childBlocks = [<line key={0} style={css_line} x1={x1} y1={y1} x2={x2} y2={y2} />]
				f(ui.childStart, childBlocks, width)
			}

			// block
			(ui.action.id == this.props.currentAction) && (currentAction = ui.action)
			let block = <Block key={ui.action.id} data={ui.action} highLight={ui.action.id == this.props.currentAction} onClick={this.props.onActionClick}
				blockSize={ui.blockSize} frameSize={ui.frameSize} position={ui.position} text={ui.action.id + '-' + ui.action.type}>{childBlocks}</Block>
			blocks.push(block); exists.push(ui.action.id)

			// next
			if (ui.next) {
				let line;
				const nextSize = ui.next.frameSize || ui.next.blockSize
				const key = `${ui.action.id}.${ui.next.action.id}`
				const x1 = ui.position.x + (width >> 1), y1 = ui.position.y + height + this.config.lineOffset;

				if (exists.indexOf(ui.next.action.id) == -1) {
					f(ui.next, blocks, frameWidth)
					const x2 = ui.next.position.x + (nextSize.width >> 1), y2 = ui.next.position.y - this.config.lineOffset - this.config.lineWidth;
					line = <line key={key} style={css_line} x1={x1} y1={y1} x2={x2} y2={y2} />
				} else {
					line = <polyline key={key} style={css_line}
						points={`${x1},${y1} ${x1},${y1 + this.config.blockMargin.y - (this.config.lineOffset << 1) - this.config.lineWidth} 
						${ui.next.position.x + ((nextSize.width - frameWidth) >> 1) + this.config.lineWidth + (this.config.blockPadding.x >> 1)},${y1 + this.config.blockMargin.y - (this.config.lineOffset << 1) - this.config.lineWidth}
						${ui.next.position.x + ((nextSize.width - frameWidth) >> 1) + this.config.lineWidth + (this.config.blockPadding.x >> 1)},${ui.next.position.y + (ui.next.blockSize.height >> 1)}
						${ui.next.position.x - this.config.lineOffset},${ui.next.position.y + (ui.next.blockSize.height >> 1)}
					`} />
				}
				blocks.push(line)

			}
		}
		f(this.uiStart, blocks, totalSize.width)

		// tool
		let actionTool = null

		switch(currentAction && currentAction.type){
			case 'open-url': { actionTool = <ActionTools.OpenURL /> } break;
			case 'open-each-url': { actionTool = <ActionTools.OpenEachURL /> } break;
			case 'fetch-table': { actionTool = <ActionTools.FetchTable /> } break;
		}

		//
		const css_frame = { width:'100%', height:'100%', textAlign: 'center', overflow: 'scroll' }
		return (
			<div style={css_frame}>
				<svg width={totalSize.width} height={totalSize.height} style={{ cursor: 'default' }}>
					<defs>
						<marker id="arrow" markerWidth="1" markerHeight="2" refX="0" refY="1" orient="auto">
							<path d="M0,0 L0,2 L1,1 z" fill="#70AD47" />
						</marker>
					</defs>
					{blocks}
				</svg>
				{actionTool}
			</div>
		)
	}
}

class Block extends React.Component {
	constructor(props) {
		super(props)
		this.onGroupClick = this.onGroupClick.bind(this)
	}

	onGroupClick(e) {
		e.stopPropagation()
		this.props.onClick(this.props.data)
	}

	render() {
		let css_frame = { fill: '#70AD47', strokeWidth: 1, stroke: '#507E32' }
		let css_text = { fill: '#fff' }
		if (this.props.highLight) {
			css_frame.strokeWidth = 4
			css_text.fontWeight = 'bold'
		}

		let g
		if (this.props.children && this.props.children.length) {
			let innerRectWidth = this.props.frameSize.width - 2
			let innerRectX = 0
			if (this.props.highLight) {
				innerRectWidth = this.props.frameSize.width - 4
				innerRectX = 1
			}
			g = <g transform={`translate(${this.props.position.x}, ${this.props.position.y})`} onClick={this.onGroupClick}>
				<rect width={this.props.frameSize.width} height={this.props.frameSize.height} rx="4" ry="4" style={css_frame} />
				<text style={css_text} x={this.props.frameSize.width >> 1} y={this.props.blockSize.height >> 1} textAnchor="middle" dominantBaseline="middle">{this.props.text}</text>
				<g transform={`translate(1, ${this.props.blockSize.height})`}>
					<rect x={innerRectX} y={0} width={innerRectWidth} height={this.props.frameSize.height - this.props.blockSize.height - 1} rx="4" ry="4" style={{ fill: '#FFF' }} />
					{this.props.children}
				</g>
			</g>
		} else {
			g = <g transform={`translate(${this.props.position.x}, ${this.props.position.y})`} onClick={this.onGroupClick}>
				<rect width={this.props.blockSize.width} height={this.props.blockSize.height} rx="4" ry="4" style={css_frame} />
				<text style={css_text} x={this.props.blockSize.width >> 1} y={(this.props.blockSize.height >> 1) + 1} textAnchor="middle" dominantBaseline="middle">{this.props.text}</text>
			</g>
		}

		return g
	}

	static exportToBlockSize(textSize) {
		const padding = { x: 16, y: 8 }
		return { width: textSize.width + (padding.x << 1), height: textSize.height + (padding.y << 1) }
	}
}

