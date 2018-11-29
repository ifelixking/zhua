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
		this.onTagConfigChange = this.onTagConfigChange.bind(this)
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

	onTagConfigChange(values){
		
	}

	render() {
		const st = this.state.selectedTag
		const css_node_up = { backgroundColor: '#ddd', padding: '4px 8px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }
		const css_node_down = { backgroundColor: 'gray', color: '#fff', marginBottom: '8px', padding: '4px 8px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }
		const css_tag = { cursor: 'pointer', display: 'inline-block', backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '16px', margin: '2px 0px', border: '2px solid green' }
		const css_tag_selected = Object.assign({}, css_tag, { backgroundColor: '#fff', color: 'green' })
		const css_next = { color: 'green' }
		const css_prop_frame = { backgroundColor: '#efefef', padding: '4px 8px', position: 'relative', boxShadow:'0px -0px 20px #888' }
		const css_prop_section = { padding: '8px', borderTop: '1px solid gray', position: 'relative' }
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
			let subs = node.children.map((n, i) => func(n, i, indent))
			let tags = []; node.data.forEach((t, i) => {
				tags.push(<span key={i << 1} onClick={(e) => { e.stopPropagation(); this.onTagClick(t) }} style={t == st ? css_tag_selected : css_tag}>{t.tagName}</span>);
				(i < node.data.length - 1) && tags.push(<Icon key={(i << 1) + 1} style={css_next} name='icon-next' />)
			})
			let jqString = utils.Smart.toQueryString(node.data)
			return (
				<div key={i} style={{ position: 'relative', paddingLeft: `${padding}px` }}>
					{padding ? (<Icon style={css_line} name='icon-next' />) : null}
					<div>
						<div style={css_node_up}>{tags}</div>
						<div style={css_node_down}>{jqString}</div>
					</div>
					{subs}
				</div>
			)
		}
		let tree = func(this.props.qTree.root)

		let divProperty = null
		if (st) {
			
			let checks; {
				let options = [{ label: '使用标签', value: 'tagName' }], values = []; st.config.tagName && values.push('tagName');
				st.isFirst && !st.isLast && (options.push({ label: '选择第一个', value: 'isFirst' })); st.config.isFirst && values.push('isFirst');
				st.isLast && !st.isFirst && (options.push({ label: '选择最后一个', value: 'isLast' })); st.config.isLast && values.push('isLast');
				!st.isLast && !st.isFirst && (options.push({ label: `选择第${st.index}个`, value: 'index' })); st.config.index && values.push('index');
				st.innerText && st.innerText.length <= 16 && (options.push({ label: `选择内容为:"${st.innerText}"`, value: 'innerText' })); st.config.innerText && values.push('innerText');
				checks = (<CheckboxGroup options={options} value={values} onChange={this.onTagConfigChange}/>)
			}

			let divClass = null
			if (st.className.length) {
				divClass = (
					<div style={css_prop_section}>
						<span style={css_prop_section_title}>使用样式过滤:</span>
						<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
							<CheckboxGroup options={st.className.map((name, i) => ({ label: name, value: i }))} />
						</div>
					</div>
				)
			}
			let divAttr = null
			if (st.attributes.length) {
				divAttr = (
					<div style={css_prop_section}>
						<span style={css_prop_section_title}>使用属性过滤:</span>
						<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
							<CheckboxGroup options={st.attributes.map((attr, i) => ({ label: `${attr.name}="${decodeURI(attr.value)}"`, value: i }))} />
						</div>
					</div>
				)
			}

			divProperty = (
				<div style={css_prop_frame}>
					<div style={{ padding: '8px' }}>{checks}</div>
					{divClass}{divAttr}
					<Icon name='icon-close' style={{ cursor:'pointer', position: 'absolute', right: '6px', top: '8px' }} onClick={() => this.onTagClick(null)} />
				</div>
			)
		}

		return (
			<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div onClick={() => this.onTagClick(null)} style={{ flexGrow: '1', overflow: 'auto', padding: '8px' }}>{tree}</div>
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
