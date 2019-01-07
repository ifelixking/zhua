import React from 'react'
import { connect } from 'react-redux';
import Immutable from 'immutable'
import * as utils from '../../utils'
import * as Smart from '../../smart'
import ActionTools from './ActionTools'
import Icon from './Common/Icon'
import * as Service from './../../service'
import co from 'co'
import { message } from 'antd';

export default connect(
	state => {
		return {
			loginInfo: state.loginInfo,
			project: state.project,
			actionStore: state.actionStore,
			currentActionInfo: state.currentActionInfo,
			maxActionID: state.maxActionID,
			actionStoreModified: state.actionStoreModified,
		}
	},
	dispatch => {
		return {
			onActionClick: (currentActionInfo) => { dispatch({ type: 'CHANGE_CURRENT_ACTION_INFO', currentActionInfo }) },
			onCreateNextAction: (newAction, currentActionID) => {
				dispatch({ type: 'CREATE_NEXT_ACTION', newAction, currentActionID })
				dispatch({ type: 'CHANGE_CURRENT_ACTION_INFO', currentActionInfo: { type: 'action', id: newAction.get('id') } })
			},
			onCreateProject: (newProject) => {
				dispatch({ type: 'SET_PROJECT', project: newProject })
			},
			onSaved: () => { dispatch({ type: 'PROJECT_SAVED', project: newProject }) }
		}
	}
)(class PanelAction extends React.Component {
	constructor(props) {
		super(props)

		this.onFrameDivClick = this.onFrameDivClick.bind(this)
		this.onCreate = this.onCreate.bind(this)
		this.onSave = this.onSave.bind(this)

		this.state = {}
		this.config = {
			blockPadding: { x: 16, y: 8 },
			blockMargin: { x: 0, y: 32 },
			lineOffset: 8,
			lineWidth: 8,
		}

	}
	static title = "动作"

	// 用于清空 current select action
	onFrameDivClick(e) {
		if (e.target == e.currentTarget || e.currentTarget.children[0] == e.target) {
			this.props.onActionClick(null)
		}
	}

	onCreate(qNodeList, type) {
		let currentActionID = this.props.currentActionInfo.id
		let newAction = Immutable.Map({ id: this.props.maxActionID + 1, type: type, data: Smart.QTree.createByQNodeList(qNodeList) })
		this.props.onCreateNextAction(newAction, currentActionID)
	}

	onSave() {
		if (!this.props.actionStoreModified) { return; }
		let { project, loginInfo, actionStore, onCreateProject, onSaved } = this.props
		if (!loginInfo || !loginInfo.userId) { message.warn('您还没有登录，请点击【选项】面板【登录】或【注册】'); return }
		let data = JSON.stringify(actionStore.toJSON())
		if (project && project.ownerId == loginInfo.userId) {
			// 保存自己的 Project
			co(function* () {
				let result = yield Service.setMyProjectData(project.id, { data })
				result.data ? (message.success("保存成功"), onSaved) : message.error("保存失败")

			})
		} else {
			// 保存为新的自己的 Project
			co(function* () {
				let newProject = {
					name: 'aaa',
					privately: false,
					siteTitle: document.title,
					siteURL: document.URL,
					data,
				}
				let result = yield Service.createProject(newProject)
				result.data ? (onCreateProject(result.data), message.success("保存成功"), onSaved()) : message.error("保存失败")
			})
		}
	}

	render() {

		// buildUIActionStore
		const { totalWidth, totalHeight, uiStart } = (() => {
			const func = (action, uiList, parentStore, offset) => {

				let ui = { action }; uiList.push(ui)
				const textSize = utils.getCachedSVGTextSize(action.get('type'))
				ui.blockSize = { width: textSize.width + (this.config.blockPadding.x << 1), height: textSize.height + (this.config.blockPadding.y << 1) }

				// child
				if (action.get('actionStore')) {
					ui.children = []; let childOffset = { y: this.config.blockMargin.y, maxWidth: ui.blockSize.width }
					let idx, startAction = action.getIn(['actionStore', 'actions']).find((a, i) => a.get('id') == action.getIn(['actionStore', 'start']) && (idx = i) != -1)
					ui.childStart = func(startAction, ui.children, action.get('actionStore'), childOffset); ui.childStart.index = idx
					ui.frameSize = { width: childOffset.maxWidth, height: ui.blockSize.height + childOffset.y }
				}
				ui.position = { /*x: this.config.blockPadding.x,*/ y: offset.y };
				offset.y += (ui.frameSize || ui.blockSize).height + this.config.blockMargin.y
				let outFrameWidth = (ui.frameSize || ui.blockSize).width + (this.config.blockPadding.x << 1)
				offset.maxWidth < outFrameWidth && (offset.maxWidth = outFrameWidth)

				// next
				if (action.get('next')) {
					let uiNext = uiList.find(u => u.action.get('id') == action.get('next'))		// 先
					if (!uiNext) {
						let idx, actionNext = parentStore.get('actions').find((a, i) => a.get('id') == action.get('next') && (idx = i) != -1)
						uiNext = func(actionNext, uiList, parentStore, offset); uiNext.index = idx
					} else {
						offset.maxWidth += (this.config.lineWidth << 2)
					}
					ui.next = uiNext
				}
				return ui
			}

			let startActionIndex, startAction = this.props.actionStore.get('actions').find((action, i) => action.get('id') == this.props.actionStore.get('start') && (startActionIndex = i) != -1)
			let uiList = [], offset = { y: 10, maxWidth: 0 }
			let uiStart = func(startAction, uiList, this.props.actionStore, offset); uiStart.index = startActionIndex

			return { totalWidth: offset.maxWidth, totalHeight: offset.y, uiStart }
		})()

		let blocks = [], line = 10, exists = []
		const func = (ui, blocks, frameWidth, imPath) => {
			const width = (ui.frameSize || ui.blockSize).width
			const height = (ui.frameSize || ui.blockSize).height
			ui.position.x = (frameWidth - width) >> 1

			// child
			let childBlocks = null
			if (ui.children) {
				let lineHighLight = this.props.currentActionInfo && this.props.currentActionInfo.type == 'innerNext' && ui.action.get('id') == this.props.currentActionInfo.id
				const x1 = (width >> 1), y1 = this.config.lineOffset;
				const x2 = x1, y2 = ui.childStart.position.y - this.config.lineOffset - this.config.lineWidth;
				childBlocks = [<Line data={{ type: 'innerNext', id: ui.action.get('id'), childStartId: ui.childStart.action.get('id') }} highLight={lineHighLight} lineWidth={this.config.lineWidth} key={0}
					points={[{ x: x1, y: y1 }, { x: x2, y: y2 }]} onClick={this.props.onActionClick} />]
				func(ui.childStart, childBlocks, width, [...imPath, 'actionStore', 'actions', ui.childStart.index])
			}

			// block
			let blockHighLight = this.props.currentActionInfo && this.props.currentActionInfo.type == 'action' && ui.action.get('id') == this.props.currentActionInfo.id
			let block = <Block key={ui.action.get('id')} data={{ type: 'action', id: ui.action.get('id'), imPath }} highLight={blockHighLight} onClick={this.props.onActionClick}
				blockSize={ui.blockSize} frameSize={ui.frameSize} position={ui.position} text={ui.action.get('id') + '-' + ui.action.get('type')}>{childBlocks}</Block>
			blocks.push(block); exists.push(ui.action.get('id'))

			// next
			const x1 = ui.position.x + (width >> 1), y1 = ui.position.y + height + this.config.lineOffset;
			let lineHighLight = this.props.currentActionInfo && this.props.currentActionInfo.type == 'next' && ui.action.get('id') == this.props.currentActionInfo.id
			if (ui.next) {
				const nextSize = ui.next.frameSize || ui.next.blockSize
				const key = `${ui.action.get('id')}.${ui.next.action.get('id')}`
				let points = []
				if (exists.indexOf(ui.next.action.get('id')) == -1) {
					func(ui.next, blocks, frameWidth, [...(imPath.slice(0, -1)), ui.next.index])
					const x2 = ui.next.position.x + (nextSize.width >> 1), y2 = ui.next.position.y - this.config.lineOffset - this.config.lineWidth;
					points.push(...[{ x: x1, y: y1 }, { x: x2, y: y2 }])
				} else {
					points.push(...[
						{ x: x1, y: y1 },
						{ x: x1, y: y1 + this.config.blockMargin.y - (this.config.lineOffset << 1) - this.config.lineWidth },
						{ x: ui.next.position.x + ((nextSize.width - frameWidth) >> 1) + this.config.lineWidth + (this.config.blockPadding.x >> 1), y: y1 + this.config.blockMargin.y - (this.config.lineOffset << 1) - this.config.lineWidth },
						{ x: ui.next.position.x + ((nextSize.width - frameWidth) >> 1) + this.config.lineWidth + (this.config.blockPadding.x >> 1), y: ui.next.position.y + (ui.next.blockSize.height >> 1) },
						{ x: ui.next.position.x - this.config.lineOffset, y: ui.next.position.y + (ui.next.blockSize.height >> 1) }
					])
				}

				blocks.push(<Line data={{ type: 'next', id: ui.action.get('id'), nextId: ui.next.action.get('id') }} highLight={lineHighLight} lineWidth={this.config.lineWidth} key={key} points={points} onClick={this.props.onActionClick} />)
			} else {
				const key = `${ui.action.get('id')}.`
				let points = [{ x: x1, y: y1 }, { x: x1, y: y1 + this.config.blockMargin.y - (this.config.lineOffset << 1) - this.config.lineWidth }]
				blocks.push(<Line data={{ type: 'next', id: ui.action.get('id'), next: null }} highLight={lineHighLight} lineWidth={this.config.lineWidth} key={key} points={points} onClick={this.props.onActionClick} />)
			}
		}
		func(uiStart, blocks, totalWidth, ['actions', uiStart.index])

		// tool
		let actionTool = null

		if (this.props.currentActionInfo) {
			let { action: currentAction } = utils.actionStoreFindAction(this.props.actionStore, this.props.currentActionInfo.id)
			if (this.props.currentActionInfo.type == 'action') {

				switch (currentAction.get('type')) {
					case 'open-url': { actionTool = <ActionTools.OpenURL onDialogCancel={() => { this.props.onActionClick(null) }} /> } break;
					case 'open-each-url': { actionTool = <ActionTools.OpenEachURL /> } break;
					case 'fetch-table': {
						actionTool = <ActionTools.FetchTable
						// actionStore={this.props.actionStore} actionInfo={{ action: currentAction, imPath: this.props.currentActionInfo.imPath }} 
						/>
					} break;
				}
			} else if (this.props.currentActionInfo.type == 'next') {
				// switch (currentAction.get('type')) {
				// 	case 'open-url': { actionTool = <ActionTools.OpenURLNext onBtnFetchTableClick={()=>this.onCreate()} /> } break;
				// 	case 'fetch-table': { actionTool = <ActionTools.OpenURLNext onBtnOpenLinkClick={this.onBtnOpenLinkClick} /> } break;
				// }
				actionTool = <ActionTools.OpenURLNext onBtnFetchTableClick={(qNodeList) => this.onCreate(qNodeList, 'fetch-table')} onBtnOpenLinkClick={(qNodeList) => { this.onCreate(qNodeList, 'open-url') }} />
			}
		}

		//
		const css_frame = { width: '100%', height: '100%', textAlign: 'center', overflow: 'scroll' }
		const css_redDot = {
			display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'red',
			borderRadius: '3px', position: 'relative', top: '-14px', left: '-6px', boxShadow: '0px 0px 3px red'
		}
		return (
			<div style={css_frame} onClick={this.onFrameDivClick}>
				<div style={{ textAlign: 'right', position: 'absolute', width: 'calc(100% - 17px)', padding: '22px 16px' }}>
					<Icon onClick={this.onSave} titie="保存" style={{ cursor: 'pointer', fontSize: '20px', borderRadius: '14px', padding: '4px', boxShadow: '0px 0px 3px #888888', backgroundColor: '#fff' }} name="icon-save" />
					<div style={Object.assign({}, css_redDot, { visibility: this.props.actionStoreModified ? 'visible' : 'hidden' })}></div>
				</div>
				<svg width={totalWidth} height={totalHeight} style={{ cursor: 'default' }}>
					<defs>
						<marker id="arrow" markerWidth="1" markerHeight="2" refX="0" refY="1" orient="auto"><path d="M0,0 L0,2 L1,1 z" fill="#70AD47" /></marker>
						<marker id="arrowHighLight" markerWidth="1" markerHeight="2" refX="0" refY="1" orient="auto"><path d="M0,0 L0,2 L1,1 z" fill="#507E32" /></marker>
					</defs>
					{blocks}
				</svg>
				{actionTool}
			</div>
		)
	}
})


// ========================================================================================================================================================================================================================================================================================
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
		let css_frame = { fill: '#70AD47', strokeWidth: 1, stroke: '#507E32', cursor: 'pointer' }
		let css_text = { fill: '#fff', cursor: 'pointer' }
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

class Line extends React.Component {
	constructor(props) {
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick(e) {
		e.stopPropagation()
		this.props.onClick(this.props.data)
	}

	render() {
		const css_line = { fill: 'none', stroke: this.props.highLight ? '#507E32' : '#70AD47', strokeWidth: this.props.lineWidth, markerEnd: this.props.highLight ? 'url(#arrowHighLight)' : 'url(#arrow)' }
		const css_line_cover = { cursor: 'pointer', fill: 'none', stroke: 'transparent', strokeWidth: this.props.lineWidth + 8 }
		let pointsForCover = [...this.props.points]
		let p0 = { ...pointsForCover[pointsForCover.length - 2] }
		let p1 = { ...pointsForCover[pointsForCover.length - 1] };
		pointsForCover[pointsForCover.length - 2] = p0;
		pointsForCover[pointsForCover.length - 1] = p1;
		(p1.x != p0.x) && (p1.x += (p1.x - p0.x) / Math.abs(p1.x - p0.x) * 8);
		(p1.y != p0.y) && (p1.y += (p1.y - p0.y) / Math.abs(p1.y - p0.y) * 8)
		return (
			<g onClick={this.onClick} >
				<polyline style={css_line} points={this.props.points.map(p => `${p.x},${p.y}`).join(' ')} />
				<polyline style={css_line_cover} points={pointsForCover.map(p => `${p.x},${p.y}`).join(' ')} />
			</g>
		)
	}
}
