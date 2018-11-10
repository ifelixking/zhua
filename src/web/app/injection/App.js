import React from 'react'
import PanelAction from './PanelAction'
import PanelResource from './PanelResource'
import PanelOption from './PanelOption'
import Styles from './index.css'


const MAX_LONG_LONG = 2147483647

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.onMainBtnClick = this.onMainBtnClick.bind(this)
		this.onMainBtnMove = this.onMainBtnMove.bind(this)
		this.onPanelChange = this.onPanelChange.bind(this)
		this.onPanelResize = this.onPanelResize.bind(this)
		this.onActionClick = this.onActionClick.bind(this)

		this.state = {
			showMainPanel: false,
			positionMain: { x: 61.8, y: 100 },
			panelSize: { width: 400, height: 700 },
			currentPanel: null,
			currentAction: 1,
			actionStore: {
				start: 1,
				actions: [
					{ id: 1, type: 'open-url', next: 2 },
					{
						id: 2, type: 'open-each-url', next: 4,
						actionStore: {
							start: 3,
							actions: [
								{ id: 3, type: 'fetch-table', next: 5 },
								{ id: 5, type: 'fetch-table', next: 12 },
								{
									id: 12, type: 'open-each-url', next: 3, actionStore: {
										start: 13,
										actions: [
											{ id: 13, type: 'fetch-table', next: 15 },
											{ id: 15, type: 'fetch-table', next: 13 },
										]
									}
								},
							]
						}
					},
					{ id: 4, type: 'open-url', next: 2 },
				]
			},
		}
	}

	onMainBtnClick() {
		this.setState({
			showMainPanel: !this.state.showMainPanel
		})
	}

	onMainBtnMove(pos) {
		this.setState({
			positionMain: pos
		})
	}

	onPanelChange(titie) {
		this.setState({
			currentPanel: titie
		})
	}

	onPanelResize(newSize) {
		this.setState({ panelSize: newSize })
	}

	onActionClick(action){
		if ((action && action.id) == this.state.currentAction) { return }
		this.setState({currentAction: action && action.id})
	}

	render() {
		let mainPanel = this.state.showMainPanel ? (
			<MainPanel position={this.state.positionMain}
				current={this.state.currentPanel} onChange={this.onPanelChange}
				size={this.state.panelSize} onResize={this.onPanelResize} miniSize={{ width: 300, height: 500 }}>
				<PanelAction actionStore={this.state.actionStore} currentAction={this.state.currentAction} onActionClick={this.onActionClick}/>
				<PanelResource />
				<PanelOption />
			</MainPanel>
		) : null

		const css_global = { color: '#333', fontFamily: 'Microsoft YaHei,SimHei,NSimSun,SimSun,SimHei', fontSize: '12px' }

		return (
			<div style={css_global}>
				<MainButton
					onClick={this.onMainBtnClick} mini={this.state.showMainPanel}
					onMove={this.onMainBtnMove} position={this.state.positionMain} />
				{mainPanel}
			</div>
		)
	}
}

class MainPanel extends React.Component {
	constructor(props) {
		super(props)
		this.onMouseDownForResize = this.onMouseDownForResize.bind(this)
	}

	onMouseDownForResize(e) {
		const onMouseMove = (e) => {
			e.stopPropagation()
			let pt = { x: e.clientX, y: e.clientY }
			let newSize = { width: this.props.size.width + pt.x - lastPt.x, height: this.props.size.height + pt.y - lastPt.y }
			if (newSize.width < this.props.miniSize.width) {
				newSize.width = this.props.miniSize.width
			} else {
				lastPt.x = pt.x
			}
			if (newSize.height < this.props.miniSize.height) {
				newSize.height = this.props.miniSize.height
			} else {
				lastPt.y = pt.y
			}
			this.props.onResize(newSize)
			// lastPt = pt;
		}
		const onMouseUp = (e) => {
			e.stopPropagation()
			window.removeEventListener('mousemove', onMouseMove, true)
			window.removeEventListener('mouseup', onMouseUp, true)
			document.onselectstart = oldOnSelectStart
		}
		const disableSelect = function (e) { return false; }
		let lastPt = { x: e.clientX, y: e.clientY }
		let oldOnSelectStart = document.onselectstart
		document.onselectstart = disableSelect
		window.addEventListener('mousemove', onMouseMove, true)
		window.addEventListener('mouseup', onMouseUp, true)
		e.stopPropagation()
	}

	render() {
		const posOffset = 18
		const css_frame = {
			position: 'fixed', zIndex: MAX_LONG_LONG - 1, borderRadius: '4px', boxShadow: '0px 0px 5px #888888',
			width: `${this.props.size.width}px`, height: `${this.props.size.height}px`, backgroundColor: '#fff',
			left: `${this.props.position.x + posOffset}px`, top: `${this.props.position.y + posOffset}px`
		}

		const css_tab = {
			display: 'inline-block', height: '32px', boxSizing: 'border-box', padding: '6px 16px',
			margin: '0px 10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
			borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px'
		}
		const css_tab_current = Object.assign({}, css_tab, {
			background: 'linear-gradient(#FF7F00, #FF7F00)', color: '#fff'
		})

		let current_idx = this.props.children.findIndex(item => item.type.title == this.props.current)
		current_idx >= 0 || (current_idx = 0)

		let tabs = this.props.children.map((item, i) => {
			return (<span className={Styles['MainPanel-tab']} key={item.type.title} style={i == current_idx ? css_tab_current : css_tab} onClick={() => this.props.onChange(item.type.title)}>{item.type.title}</span>)
		})

		return (
			<div style={css_frame}>
				<div style={{ height: '8px', backgroundColor: '#FF7F00', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
				<div style={{ width: '100%', padding: '0px 12px', boxSizing: 'border-box' }}>{tabs}</div>
				<div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
					{this.props.children[current_idx]}
				</div>
				<div onMouseDown={this.onMouseDownForResize} style={{ cursor: 'se-resize', position: 'absolute', width: '0px', height: '0px', backgroundColor: 'transparent', right: '0px', bottom: '0px', borderWidth: '8px 8px 8px 8px', borderColor: 'transparent #FF7F00 #FF7F00 transparent', borderStyle: 'solid' }} />
			</div>
		)
	}
}

class MainButton extends React.Component {
	constructor(props) {
		super(props)
		this.onMouseDown = this.onMouseDown.bind(this)
	}

	onMouseDown(e) {
		const onMouseMove = (e) => {
			e.stopPropagation()
			let pt = { x: e.clientX, y: e.clientY }
			let newPt = {
				x: this.props.position.x + pt.x - lastPt.x,
				y: this.props.position.y + pt.y - lastPt.y
			}
			this.props.onMove(newPt)
			if (clickInfo.result === true) {
				clickInfo.moveOffsetX += (pt.x - lastPt.x)
				clickInfo.moveOffsetY += (pt.y - lastPt.y)
				if (Math.abs(clickInfo.moveOffsetX) > 4 || Math.abs(clickInfo.moveOffsetY) > 4) {
					clickInfo.result = false
				}
			}
			lastPt = pt;
		}
		const onMouseUp = (e) => {
			e.stopPropagation()
			window.removeEventListener('mousemove', onMouseMove, true)
			window.removeEventListener('mouseup', onMouseUp, true)
			document.onselectstart = oldOnSelectStart
			if (clickInfo.result) {
				this.props.onClick && this.props.onClick(e)
			}
		}
		const disableSelect = function (e) { return false; }
		let clickInfo = {
			moveOffsetX: 0, moveOffsetY: 0, result: true
		}
		let lastPt = { x: e.clientX, y: e.clientY }
		let oldOnSelectStart = document.onselectstart
		document.onselectstart = disableSelect
		window.addEventListener('mousemove', onMouseMove, true)
		window.addEventListener('mouseup', onMouseUp, true)
		e.stopPropagation()
	}

	render() {

		const size = this.props.mini ? 38 : 76;
		const fontSize = this.props.mini ? 24 : 48;
		const timing = 0.2

		const css = {
			backgroundColor: '#FF7F00', width: `${size}px`, height: `${size}px`, borderRadius: `${size >> 1}px`, boxSizing: 'border-box', zIndex: MAX_LONG_LONG,
			position: 'fixed', left: `${this.props.position.x}px`, top: `${this.props.position.y}px`, boxShadow: '0px 0px 5px #888888', cursor: 'pointer',
			lineHeight: `${size}px`, fontSize: `${fontSize}px`, color: 'white', fontWeight: 'bold', textAlign: 'center',
			transitionProperty: `width,height,border-radius,line-height,font-size`, transitionDuration: `${timing}s`, transitionTimingFunction: 'ease'
		}

		return (
			<div onMouseDown={this.onMouseDown} style={css}>Z</div>
		)
	}
}