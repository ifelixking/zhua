import React from 'react'
import ReactDOM from 'react-dom'
import PanelGroup from '../Common/PanelGroup'
import Styles from '../index.css'
import * as utils from '../../../utils'
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import 'antd/lib/Checkbox/style'
import Icon from '../Common/Icon'
import Mask from '../Common/Mask'


export class FetchTable extends React.Component {
	constructor(props) {
		super(props)
		this.flushCapture = this.flushCapture.bind(this)
		this.onCapture = this.onCapture.bind(this)
		this.isValidElement = this.isValidElement.bind(this)
		this.state = {
			qTree: this.props.action.get('data'),
			captureElements: []
		}

	}

	componentWillReceiveProps(nextProps) {
		let nextProps_data = nextProps.action.get('data')
		if (nextProps_data != this.props.action.get('data')) {
			this.flushCapture(nextProps_data)
		}
	}

	componentDidMount() {
		this.flushCapture(this.state.qTree)
	}

	flushCapture(qTree) {
		let elements = utils.Smart.queryElements(qTree.root.data)
		this.setState({ captureElements: elements });
	}

	isValidElement(target) {
		return !this.state.captureElements.find(ele => utils.isAncestors(ele, target))
	}

	onCapture(target) {
		if (!this.isValidElement(target)) { return }
		this.setState({
			qTree: this.state.qTree.mergeElement(target)
		})
	}

	render() {
		return (
			<div>
				<PanelGroup right={true} initSize={{ width: 400 }} initShow={true}>
					<TablePanel></TablePanel>
					<RawPanel></RawPanel>
					<CapturePanel qTree={this.state.qTree}></CapturePanel>
					<QueryPanel></QueryPanel>
				</PanelGroup>
				<Tool captureElements={this.state.captureElements} onCapture={this.onCapture} isValidElement={this.isValidElement} />
			</div>
		)

	}
}

class TablePanel extends React.Component {
	constructor(props) {
		super(props)
	}
	static title = "表格"
	render() {
		return <h1>表格</h1>
	}
}

class RawPanel extends React.Component {
	constructor(props) {
		super(props)
	}
	static title = "原始"
	render() {
		return <h1>原始</h1>
	}
}

class CapturePanel extends React.Component {
	constructor(props) {
		super(props)
		this.onTagClick = this.onTagClick.bind(this)
		this.state = {
			selectedTag: null
		}
	}
	static title = "捕获"

	onTagClick(tag) {
		this.setState({
			selectedTag: tag
		})
	}

	render() {
		const st = this.state.selectedTag
		const css_node = { backgroundColor: '#ddd', marginBottom: '8px', padding: '4px 8px', borderRadius: '4px' }
		const css_tag = { cursor: 'pointer', display: 'inline-block', backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '16px', margin: '2px 0px', border: '2px solid green' }
		const css_tag_selected = Object.assign({}, css_tag, { backgroundColor: '#fff', color: 'green' })
		const css_next = { color: 'green' }
		const css_prop_frame = { position: 'absolute', left: '0px', bottom: '0px', maxHeight: '300px', width: '100%', backgroundColor: '#efefef', marginBottom: '16px', padding: '4px 8px', overflow: 'auto' }
		const css_prop_section = { padding: '16px', borderTop: '1px solid gray', position: 'relative' }
		const css_prop_section_title = { position: 'absolute', top: '-8px', padding: '0px 8px', backgroundColor: '#efefef' }
		const indent = 32
		const css_line = {
			fontSize: '16px',
			position: 'absolute',
			left: '8px',
			top: '12px',
			color: 'green'
		}

		const func = (node, i = 0, padding = 0) => {
			let subs = node.children.map((n, i) => func(n, i, padding + indent))
			let tags = [], lines=[]; node.data.forEach((t, i) => {
				tags.push(<span key={i << 1} onClick={() => this.onTagClick(t)} style={t == st ? css_tag_selected : css_tag}>{t.tagName}</span>);
				(i < node.data.length - 1) && tags.push(<Icon key={(i << 1) + 1} style={css_next} name='icon-next' />)
			})
			return (
				<div key={i} style={{ position: 'relative', paddingLeft: `${padding}px` }}>
					{padding ? (<Icon style={css_line} name='icon-next' />) : null}
					<div style={css_node}>{tags}</div>
					{subs}
				</div>
			)
		}
		let tree = func(this.props.qTree.root)


		let divProperty = null
		if (st) {
			let options = [{ label: '使用标签', value: 'tag' }]
			st.isFirst && !st.isLast && (options.push({ label: '选择第一个', value: 'first' }))
			st.isLast && !st.isFirst && (options.push({ label: '选择最后一个', value: 'last' }))
			!st.isLast && !st.isFirst && (options.push({ label: `选择第${st.index}个`, value: 'index' }))
			st.innerText && st.innerText.length <= 16 && (options.push({ label: `选择内容为:"${st.innerText}"`, value: 'text' }))
			let checks = (<CheckboxGroup options={options} />)

			let divClass = null
			if (st.className.length) {
				divClass = (
					<div style={css_prop_section}>
						<span style={css_prop_section_title}>使用样式过滤:</span>
						<CheckboxGroup options={st.className.map((name, i) => ({ label: name, value: i }))} />
					</div>
				)
			}
			let divAttr = null
			if (st.attributes.length) {
				divAttr = (
					<div style={css_prop_section}>
						<span style={css_prop_section_title}>使用属性过滤:</span>
						<CheckboxGroup options={st.attributes.map((attr, i) => ({ label: `${attr.name}="${decodeURI(attr.value)}"`, value: i }))} />
					</div>
				)
			}

			divProperty = (
				<div style={css_prop_frame}>
					<div style={{ padding: '16px' }}>{checks}</div>
					{divClass}{divAttr}
				</div>
			)
		}

		return (
			<div style={{ padding: '8px' }}>
				{tree}
				{divProperty}
			</div>
		)
	}
}

class QueryPanel extends React.Component {
	constructor(props) {
		super(props)
	}
	static title = "查询"
	render() {
		return <h1>查询</h1>
	}
}

class Tool extends React.Component {
	constructor(props) {
		super(props)

		this.onClick = this.onClick.bind(this)
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.flushRects = this.flushRects.bind(this)

		this.state = {
			rects: [],
			highLightRects: []
		}

	}

	componentWillMount() {
		window.document.addEventListener('mousemove', this.onMouseMove, true)
		window.document.addEventListener('mousedown', this.onMouseDown, true)
		window.document.addEventListener('click', this.onClick, true)
	}

	componentWillUnmount() {
		window.document.removeEventListener('mousemove', this.onMouseMove, true)
		window.document.removeEventListener('mousedown', this.onMouseDown, true)
		window.document.removeEventListener('click', this.onClick, true)
	}

	componentDidMount() {
		this.flushRects(this.props.captureElements)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.captureElements != this.props.captureElements) {
			this.flushRects(nextProps.captureElements)
		}
	}

	flushRects(elements) {
		this.setState({
			rects: elements.map((ele) => {
				const { left, top, width, height } = ele.getBoundingClientRect()
				return {
					left: left + document.documentElement.scrollLeft,
					top: top + document.documentElement.scrollTop,
					width: width, height: height
				}
			})
		})
	}

	onMouseMove(e) {
		if (utils.eventFilterRoot(e)) { return true }
		let highLight = this.props.isValidElement(e.target) ? [e.target] : []
		this.setState({
			highLightRects: highLight.map(ele => {
				const { left, top, width, height } = ele.getBoundingClientRect()
				return {
					left: left + document.documentElement.scrollLeft,
					top: top + document.documentElement.scrollTop,
					width, height
				}
			})
		})
		return false
	}

	onMouseDown(e) {
		if (utils.eventFilterRoot(e)) { return true }
		return false
	}

	onClick(e) {
		if (utils.eventFilterRoot(e)) { return true }
		this.props.onCapture(e.target)
		// const qNodeList = utils.Smart.analysePath(e.target)
		// this.flushByQNodeList(qNodeList)
		// const opElementRect = e.target.getBoundingClientRect()
		// this.setState({
		// 	opElement: e.target, opElementRect: {
		// 		left: opElementRect.left + document.documentElement.scrollLeft,
		// 		top: opElementRect.top + document.documentElement.scrollTop,
		// 		width: opElementRect.width, height: opElementRect.height
		// 	}, filterPosition: null
		// })

		// return false
	}


	render() {
		const css_highLight = { border: '1px dashed #FF7F00' }

		let mask = <Mask key={'mask'} rectGroups={[
			{ style: {}, rects: this.state.rects, hole: true },
			{ style: css_highLight, rects: this.state.highLightRects }
		]} />
		return ReactDOM.createPortal([mask], utils.getModalRoot());
	}
}
