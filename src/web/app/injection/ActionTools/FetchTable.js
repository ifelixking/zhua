import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import PanelGroup from '../Common/PanelGroup'
import Immutable from 'immutable'
import Styles from '../index.css'
import * as utils from '../../../utils'
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import 'antd/lib/Checkbox/style'
import Icon from '../Common/Icon'
import Mask from '../Common/Mask'

export default connect(
	state => {
		return {
			actionStore: state.actionStore,
			actionInfo: utils.actionStoreFindAction(state.actionStore, state.currentActionInfo.id)
		}
	},
	dispatch => {
		return {
			updateActionData: (actionId, data) => {
				dispatch({ type: 'UPDATE_ACTION_STORE_BY_ACTION_DATA', actionId, data })
			}
		}
	}
)(class FetchTable extends React.Component {
	constructor(props) {
		super(props)
		this.flushCapture = this.flushCapture.bind(this)
		this.onCapture = this.onCapture.bind(this)
		this.isValidElement = this.isValidElement.bind(this)
		this.updateActionData = this.updateActionData.bind(this)
		this.state = {
			captureElements: []
		}
	}

	componentWillReceiveProps(nextProps) {
		let nextProps_data = nextProps.actionInfo.action.get('data')
		if (nextProps_data != this.props.actionInfo.action.get('data')) {
			this.flushCapture(nextProps_data)
		}
	}

	componentDidMount() {
		let qTree = this.props.actionInfo.action.get('data')
		this.flushCapture(qTree)
	}

	flushCapture(qTree) {
		// TODO: 
		let elements = utils.Smart.queryElements(qTree.get('data'))
		this.setState({ captureElements: elements });
	}

	isValidElement(target) {
		return !this.state.captureElements.find(ele => utils.isAncestors(ele, target))
	}

	onCapture(target) {
		if (!this.isValidElement(target)) { return }
		let qTree = this.props.actionInfo.action.get('data')
		let newQTree = utils.Smart.QTree.mergeElement(qTree, target)
		newQTree && this.updateActionData(newQTree)
	}

	updateActionData(data) {
		this.props.updateActionData(this.props.actionInfo.action.get('id'), data)
	}

	render() {
		let qTree = this.props.actionInfo.action.get('data')
		return (
			<div>
				<PanelGroup right={true} initSize={{ width: 400 }} initShow={true}>
					<TablePanel />
					<RawPanel />
					<CapturePanel qTree={qTree} onUpdate={this.updateActionData} />
				</PanelGroup>
				<Tool captureElements={this.state.captureElements} onCapture={this.onCapture} isValidElement={this.isValidElement} />
			</div>
		)

	}
}
)


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

	onTagConfigChange(values, type) {
		const newQTree = utils.Smart.QTree.updateByTag(this.props.qTree, this.state.selectedTag, (tag) => {
			let newTag = tag.update('config', c => {
				switch (type) {
					case 0:
						return c.merge({
							tagName: values.includes('tagName'),
							index: values.includes('index'),
							isFirst: values.includes('isFirst'),
							isLast: values.includes('isLast'),
							innerText: values.includes('innerText'),
						})
					case 1: return c.set('className', Immutable.List(values))
					case 2: return c.set('attributes', Immutable.List(values))
					case 3: return c.set('output', {
						innerText: values.includes('innerText'),
						href: values.includes('href'),
						src: values.includes('src'),
						title: values.includes('title'),
					})
				}
			})
			this.setState({ selectedTag: newTag })
			return newTag
		})
		this.props.onUpdate(newQTree)
	}

	render() {
		const st = this.state.selectedTag
		const css_node_up = { backgroundColor: '#ddd', padding: '4px 8px', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }
		const css_node_down = { backgroundColor: 'gray', color: '#fff', marginBottom: '8px', padding: '4px 8px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', lineHeight: '18px' }
		const css_tag = { cursor: 'pointer', display: 'inline-block', backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '16px', margin: '2px 0px', border: '2px solid green' }
		const css_tag_selected = Object.assign({}, css_tag, { backgroundColor: '#fff', color: 'green' })
		const css_next = { color: 'green' }
		const css_prop_frame = { backgroundColor: '#efefef', padding: '4px 8px', position: 'relative', boxShadow: '0px -0px 20px #888' }
		const css_prop_section = { padding: '8px', borderTop: '1px solid gray', position: 'relative', margin: '8px 0px 0px 0px' }
		const css_prop_first_section = Object.assign({}, css_prop_section, { margin: '10px 20px 0px 0px' })
		const css_prop_section_title = { position: 'absolute', top: '-10px', padding: '0px 8px', backgroundColor: '#efefef', fontWeight:'bold' }
		const css_prop_section_title_text_0 = { display: 'inline-block', padding: '3px 6px 4px 6px', color: '#fff', backgroundColor: 'green', borderRadius: '4px' }
		const css_prop_section_title_text_1 = { display: 'inline-block', padding: '3px 6px 4px 6px', color: '#fff', backgroundColor: '#555', borderRadius: '4px' }
		const indent = 32
		const css_line = {
			fontSize: '16px',
			position: 'absolute',
			left: '8px',
			top: '12px',
			color: 'green'
		}

		const func = (node, i = 0, padding = 0) => {
			let subs = node.get('children').map((n, i) => func(n, i, indent))
			let tags = []; node.get('data').forEach((t, i) => {
				tags.push(<span key={i << 1} onClick={(e) => { e.stopPropagation(); this.onTagClick(t) }} style={(st == t) ? css_tag_selected : css_tag}>{utils.Smart.QNode.tagName(t)}</span>);
				(i < node.get('data').size - 1) && tags.push(<Icon key={(i << 1) + 1} style={css_next} name='icon-next' />)
			})
			let jqString = utils.Smart.toQueryString(node.get('data'))
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
		let tree = func(this.props.qTree)

		let divProperty = null
		if (st) {

			let outputChecks = null; {
				let output = st.getIn(['config', 'output']), values = []
				if (output) {
					output && output.innerText && (values.push('innerText'))
					output && output.href && (values.push('href'))
					output && output.src && (values.push('src'))
					output && output.title && (values.push('title'))
					let element = st.get('element'), options = []
					element.innerText && (options.push({ label: '文本', value: 'innerText' }));
					element.href && (options.push({ label: '超链接', value: 'href' }));
					element.src && (options.push({ label: '源地址', value: 'src' }));
					element.title && (options.push({ label: '鼠标提示', value: 'title' }));
					outputChecks = (
						<div style={css_prop_first_section}>
							<span style={css_prop_section_title}><div style={css_prop_section_title_text_0}>输出:</div></span>
							<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
								<CheckboxGroup options={options} value={values} onChange={(values) => this.onTagConfigChange(values, 3)} />
							</div>
						</div>
					)
				}
			}

			let basicChecks; {
				let options = [{ label: '使用标签', value: 'tagName' }], values = []; st.getIn(['config', 'tagName']) && values.push('tagName');
				utils.Smart.QNode.isFirst(st) && !utils.Smart.QNode.isLast(st) && (options.push({ label: '选择第一个', value: 'isFirst' })); st.getIn(['config', 'isFirst']) && values.push('isFirst');
				utils.Smart.QNode.isLast(st) && !utils.Smart.QNode.isFirst(st) && (options.push({ label: '选择最后一个', value: 'isLast' })); st.getIn(['config', 'isLast']) && values.push('isLast');
				!utils.Smart.QNode.isLast(st) && !utils.Smart.QNode.isFirst(st) && (options.push({ label: `选择第${utils.Smart.QNode.index(st) + 1}个`, value: 'index' })); st.getIn(['config', 'index']) && values.push('index');
				utils.Smart.QNode.innerText(st) && utils.Smart.QNode.innerText(st).length <= 16 && (options.push({ label: `选择内容为:"${utils.Smart.QNode.innerText(st)}"`, value: 'innerText' })); st.getIn(['config', 'innerText']) && values.push('innerText');
				basicChecks = (
					<div style={outputChecks ? css_prop_section : css_prop_first_section}>
						<span style={css_prop_section_title}><div style={css_prop_section_title_text_1}>筛选:</div></span>
						<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
							<CheckboxGroup options={options} value={values} onChange={(values) => this.onTagConfigChange(values, 0)} />
						</div>
					</div>
				)
			}

			let divClass = null
			if (utils.Smart.QNode.className(st).length) {
				let options = utils.Smart.QNode.className(st).map((name, i) => ({ label: name, value: i }))
				let values = st.getIn(['config', 'className']).toArray()
				divClass = (
					<div style={css_prop_section}>
					<span style={css_prop_section_title}><div style={css_prop_section_title_text_1}>使用样式筛选:</div></span>
						<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
							<CheckboxGroup options={options} value={values} onChange={(values) => this.onTagConfigChange(values, 1)} />
						</div>
					</div>
				)
			}
			let divAttr = null
			if (utils.Smart.QNode.attributes(st).length) {
				let options = utils.Smart.QNode.attributes(st).map((attr, i) => ({ label: `${attr.name}="${decodeURI(attr.value)}"`, value: i }))
				let values = st.getIn(['config', 'attributes']).toArray()
				divAttr = (
					<div style={css_prop_section}>
						<span style={css_prop_section_title}><div style={css_prop_section_title_text_1}>使用属性筛选:</div></span>
						<div style={{ maxHeight: '100px', overflowY: 'auto' }}>
							<CheckboxGroup options={options} value={values} onChange={(values) => this.onTagConfigChange(values, 2)} />
						</div>
					</div>
				)
			}

			divProperty = (
				<div style={css_prop_frame}>
					{outputChecks}{basicChecks}{divClass}{divAttr}
					<Icon name='icon-close' style={{ cursor: 'pointer', position: 'absolute', right: '6px', top: '8px' }} onClick={() => this.onTagClick(null)} />
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
