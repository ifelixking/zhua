import React from 'react'
import Styles from '../index.css'


export default class PanelGroup extends React.Component {
	constructor(props) {
		super(props)
		const { width = 300, height = 600 } = this.props.initSize || {}
		const showMainPanel = this.props.initShow === undefined ? false : this.props.initShow
		this.state = {
			showMainPanel: showMainPanel,
			positionMain: { x: 61.8, y: 100 },
			panelSize: { width, height },
			currentPanel: '动作',
		}
		this.onMainBtnClick = this.onMainBtnClick.bind(this)
		this.onMainBtnMove = this.onMainBtnMove.bind(this)
		this.onPanelChange = this.onPanelChange.bind(this)
		this.onPanelResize = this.onPanelResize.bind(this)
		this.props.onPanelResize && this.props.onPanelResize({ width, height })
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
		this.props.onPanelResize && this.props.onPanelResize(newSize)
	}

	render() {
		let mainPanel = this.state.showMainPanel ? (
			<MainPanel position={this.state.positionMain} right={this.props.right}
				current={this.state.currentPanel} onChange={this.onPanelChange}
				size={this.state.panelSize} onResize={this.onPanelResize} miniSize={{ width: 300, height: 500 }}>
				{this.props.children}
			</MainPanel>
		) : null

		return (
			<div>
				{mainPanel}
				<MainButton right={this.props.right}
					onClick={this.onMainBtnClick} mini={this.state.showMainPanel}
					onMove={this.onMainBtnMove} position={this.state.positionMain} >{this.props.buttons}</MainButton>
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
			let newSize = { width: this.props.size.width + (this.props.right ? (lastPt.x - pt.x) : (pt.x - lastPt.x)), height: this.props.size.height + pt.y - lastPt.y }
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
		let css_frame = {
			position: 'fixed', borderRadius: '4px', boxShadow: '0px 0px 5px #888888',
			width: `${this.props.size.width}px`, height: `${this.props.size.height}px`, backgroundColor: '#fff',
			top: `${this.props.position.y + posOffset}px`, textAlign: 'left',
		}
		let css_strip = { position: 'absolute', width: '0px', height: '0px', backgroundColor: 'transparent', bottom: '0px', borderWidth: '8px 8px 8px 8px', borderStyle: 'solid' }
		if (this.props.right) {
			css_frame.right = `${this.props.position.x + posOffset}px`
			css_strip.left = '0px'
			css_strip.borderColor = 'transparent transparent #FF7F00 #FF7F00'
			css_strip.cursor = 'sw-resize'
		} else {
			css_frame.left = `${this.props.position.x + posOffset}px`
			css_strip.right = '0px'
			css_strip.borderColor = 'transparent #FF7F00 #FF7F00 transparent'
			css_strip.cursor = 'se-resize'
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
			return (<span className={Styles['MainPanel-tab']} key={i} style={i == current_idx ? css_tab_current : css_tab} onClick={() => this.props.onChange(item.type.title)}>{item.type.title}</span>)
		})

		return (
			<div style={css_frame}>
				<div style={{ height: '8px', backgroundColor: '#FF7F00', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
				<div style={{ width: '100%', padding: '0px 12px', boxSizing: 'border-box' }}>{tabs}</div>
				<div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
					{this.props.children[current_idx]}
				</div>
				<div onMouseDown={this.onMouseDownForResize} style={css_strip} />
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
				x: this.props.position.x + (this.props.right ? lastPt.x - pt.x : pt.x - lastPt.x),
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

		let css_frame = { position: 'fixed', top: `${this.props.position.y}px`, }

		const css = {
			backgroundColor: '#FF7F00', width: `${size}px`, height: `${size}px`, borderRadius: `${size >> 1}px`, boxSizing: 'border-box',
			boxShadow: '0px 0px 5px #888888', cursor: 'pointer',
			lineHeight: `${size}px`, fontSize: `${fontSize}px`, color: 'white', fontWeight: 'bold', textAlign: 'center',
			transitionProperty: `width,height,border-radius,line-height,font-size`, transitionDuration: `${timing}s`, transitionTimingFunction: 'ease'
		}
		if (this.props.right) {
			css_frame.right = `${this.props.position.x}px`
		} else {
			css_frame.left = `${this.props.position.x}px`
		}

		const css_btn = {
			position: 'absolute', boxShadow: '0px 0px 5px #888888', cursor: 'pointer', backgroundColor: '#FF7F00',
			borderRadius: '12px', width: '24px', height: '24px', top: '-10px', left: '0px', padding: '6px 5px'
		}

		const positions = [
			{ top: '-26px', left: '15px' },
			{ top: '-11px', left: '-11px' },
			{ top: '16px', left: '-25px' }
		]

		const btns = this.props.children.map((item, i) => {
			return (
				<div onClick={item.onClick} key={i} style={{ ...css_btn, ...positions[i] }}>{item.title}</div>
			)
		})

		return (
			<div style={css_frame}>
				<div onMouseDown={this.onMouseDown} style={css}>Z</div>
				{btns}
			</div>
		)
	}
}