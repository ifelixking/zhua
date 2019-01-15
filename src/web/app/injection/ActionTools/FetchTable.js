import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import PanelGroup from '../Common/PanelGroup'
import Immutable from 'immutable'
import * as utils from '../../../utils'
import * as Smart from '../../../smart'
import { Tree, Checkbox, Table } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { TreeNode } = Tree;
import 'antd/lib/Tree/style'
import 'antd/lib/Table/style'
import Icon from '../Common/Icon'
import Mask from '../Common/Mask'
import { co } from 'co'
import * as Service from '../../../service'

export default connect(
	state => {
		return {
			actionStore: state.actionStore,
			actionInfo: utils.actionStoreFindAction(state.actionStore, state.selectedActionInfo.id)
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
		this.onPanelResize = this.onPanelResize.bind(this)
		this.state = {
			captureElements: [],
			rawTree: null,
			panelHeight: 300,
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
		let rawTree = Smart.queryElements(qTree)
		this.setState({ rawTree })
	}

	isValidElement(target) {
		return !this.state.captureElements.find(ele => utils.isAncestors(ele, target))
	}

	onCapture(target) {
		if (!this.isValidElement(target)) { return }
		let qTree = this.props.actionInfo.action.get('data')
		let newQTree = Smart.QTree.mergeElement(qTree, target)
		newQTree && this.updateActionData(newQTree)
	}

	updateActionData(data) {
		this.props.updateActionData(this.props.actionInfo.action.get('id'), data)
	}

	onPanelResize(size){
		this.setState({ panelHeight: size.height })
	}

	render() {
		let qTree = this.props.actionInfo.action.get('data')
		return (
			<div>
				<PanelGroup right={true} initSize={{ width: 400 }} initShow={true} onPanelResize={this.onPanelResize}>
					<TablePanel rawTree={this.state.rawTree} height={this.state.panelHeight - 78} />
					<RawPanel rawTree={this.state.rawTree} />
					<CapturePanel qTree={qTree} onUpdate={this.updateActionData} />
				</PanelGroup>
				<Tool captureElements={this.state.captureElements} onCapture={this.onCapture} isValidElement={this.isValidElement} />
			</div>
		)

	}
})

class TablePanel extends React.Component {
	constructor(props) {
		super(props)
		this.flushCache = this.flushCache.bind(this)
		this.onExport = this.onExport.bind(this)
		this.cache_dataSource = []
		this.cache_columns = []
		this.flushCache(this.props.rawTree)
	}

	static title = "表格"

	getColumns(rawTree) {
		let colmuns = [];
		if (rawTree) {
			const func = function (node, baseKey = null) {
				let theKey = (baseKey ? (baseKey + '>') : '') + Smart.toQueryString(node.get('data'))
				let output = Smart.QTree.getNodeOutput(node)
				if (output) {
					if (output.innerText !== false) { let key = `${theKey}~innerText`; colmuns.push({ title: '文本', key, dataIndex: key, width: 100 }) }
					if (output.href) { let key = `${theKey}~href`; colmuns.push({ title: '超链接', key, dataIndex: key, width: 100 }) }
					if (output.src) { let key = `${theKey}~src`; colmuns.push({ title: '源地址', key, dataIndex: key, width: 100 }) }
					if (output.title) { let key = `${theKey}~title`; colmuns.push({ title: '提示文本', key, dataIndex: key, width: 100 }) }
				}
				node.get('children').forEach((childNode) => {
					func(childNode, theKey)
				})
			}
			func(rawTree.block)
		}
		return colmuns
	}

	flushCache(tree) {
		this.cache_columns = this.getColumns(tree)
		if (!tree) { this.cache_dataSource = []; return }

		const processItem = function (item, row, output, baseKey) {
			const element = item.element
			if (output) {
				if (output.innerText !== false) { row[`${baseKey}~innerText`] = element.innerText }
				if (output.href) { row[`${baseKey}~href`] = element.href }
				if (output.src) { row[`${baseKey}~src`] = element.src }
				if (output.title) { row[`${baseKey}~title`] = element.title }
			}
			item.children.forEach((subNode, j) => {
				if (subNode.elements.length == 0) { return }
				let theKey = Smart.toQueryString(subNode.block.get('data'))
				processItem(subNode.elements[0], row, Smart.QTree.getNodeOutput(subNode.block), `${baseKey}>${theKey}`)
			})
		}

		let output = Smart.QTree.getNodeOutput(tree.block)
		let baseKey = Smart.toQueryString(tree.block.get('data'))
		this.cache_dataSource = tree.elements.map((item, i) => {
			let row = { key: i }; processItem(item, row, output, baseKey)
			return row
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.rawTree != this.props.rawTree) {
			this.flushCache(nextProps.rawTree)
		}
	}

	onExport(){
		let _this = this
		co(function*(){
			let result = yield Service.NATIVE('openSaveFileDialog', ['导出'])
			yield Service.NATIVE('exportToExcel', [result, JSON.stringify(_this.cache_columns), JSON.stringify(_this.cache_dataSource)])
		})		
	}

	render() {
		const css_btn = { position: 'absolute', top: '48px', right: '32px', fontSize: '24px', cursor: 'pointer' }
		return (<div>
			<Table size="middle" bordered scroll={{ y: this.props.height }} pagination={false} dataSource={this.cache_dataSource} columns={this.cache_columns} />
			<Icon onClick={this.onExport} title='导出...' style={css_btn} name='icon-save' />
		</div>)
	}
}

const RawPanel = connect(
	state => {
		return {
			expandedKeys: state.rawPanel_expandedKeys,
		}
	},
	dispatch => {
		return {
			onExpand: (expandedKeys) => {
				dispatch({ type: 'RAWPANEL_ONEXPAND', expandedKeys })
			}
		}
	}
)(class extends React.Component {
	constructor(props) {
		super(props)
		this.onExpand = this.onExpand.bind(this)
		this.onSelect = this.onSelect.bind(this)
	}

	static title = "原始"

	onExpand(expandedKeys, { expanded, node }) {
		if (expanded && !node.props.eventKey.startsWith('r-')) {
			let finalExpandedKeys = [...expandedKeys]
			node.props.children.forEach(child => { !expandedKeys.includes(child.key) && (finalExpandedKeys.push(child.key)) })
			expandedKeys = finalExpandedKeys;
		}
		this.props.onExpand(expandedKeys)
	}

	onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
		const key = selectedKeys[0]
		let expandedKeys = [...this.props.expandedKeys]
		let idx = expandedKeys.indexOf(key)
		if (idx != -1) { expandedKeys.splice(idx, 1) } else { expandedKeys.push(key) }
		this.onExpand(expandedKeys, { expanded: idx == -1, node })
	}

	render() {
		const output = function (n, element) {
			let output = n.get('data').last().getIn(['config', 'output'])
			if (!output) { return element.innerText }
			if (output.href) { return element.href }
			if (output.src) { return element.src }
			if (output.title) { return element.title }
			return element.innerText
		}

		const css_node_query = {
			cursor: 'default', display: 'inline-block', backgroundColor: 'green', color: 'white', padding: '2px 4px', maxWidth: '100%',
			borderRadius: '12px', margin: '2px 0px', border: '2px solid green', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
		}

		const func = function (nb, idx = 0) {
			let children = nb.elements.map((item, i) => {
				let strOriTitle = output(nb.block, item.element);
				let strTitle = strOriTitle
				let css = { lineHeight: '24px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
				if (strTitle.length == 0) { strTitle = '[没有文本]'; css.color = '#aaa' }
				if (item.children.length && !nb.block.get('data').last().getIn(['config', 'output'])) { css.fontStyle = 'italic', css.color = '#aaa' } else { css.fontWeight = 'bold' }
				if (idx && nb.elements.length > 1) { css.color = '#d00', css.fontStyle = 'italic' }
				let domTitle = (<div title={strOriTitle} style={css}>{strTitle}</div>)
				return (<TreeNode key={`${idx}-${i}`} title={domTitle}>{item.children.map((subBlock, j) => { return func(subBlock, `${idx}-${i}-${j}`) })}</TreeNode>)
			})
			let strTitle = Smart.toQueryString(nb.block.get('data'))
			let domTitle = (<div title={strTitle} style={css_node_query}>{strTitle}</div>)
			return (<TreeNode key={`r-${idx}`} title={domTitle}>{children}</TreeNode>)
		}
		let node = this.props.rawTree && func(this.props.rawTree)
		return <div style={{ height: '100%', overflow: 'auto' }}><Tree showLine selectedKeys={[]} expandedKeys={this.props.expandedKeys} onExpand={this.onExpand} onSelect={this.onSelect}>{node}</Tree></div>
	}
})

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
		const newQTree = Smart.QTree.updateByTag(this.props.qTree, this.state.selectedTag, (tag) => {
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
		const css_prop_section_title = { position: 'absolute', top: '-10px', padding: '0px 8px', backgroundColor: '#efefef', fontWeight: 'bold' }
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
				tags.push(<span key={i << 1} onClick={(e) => { e.stopPropagation(); this.onTagClick(t) }} style={(st == t) ? css_tag_selected : css_tag}>{t.get('tagName')}</span>);
				(i < node.get('data').size - 1) && tags.push(<Icon key={(i << 1) + 1} style={css_next} name='icon-next' />)
			})
			let jqString = Smart.toQueryString(node.get('data'))
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
					let options = []
					st.get('innerText') && (options.push({ label: '文本', value: 'innerText' }));
					st.get('href') && (options.push({ label: '超链接', value: 'href' }));
					st.get('src') && (options.push({ label: '源地址', value: 'src' }));
					st.get('title') && (options.push({ label: '鼠标提示', value: 'title' }));
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
				st.get('isFirst') && !st.get('isLast') && (options.push({ label: '选择第一个', value: 'isFirst' })); st.getIn(['config', 'isFirst']) && values.push('isFirst');
				st.get('isLast') && !st.get('isFirst') && (options.push({ label: '选择最后一个', value: 'isLast' })); st.getIn(['config', 'isLast']) && values.push('isLast');
				!st.get('isLast') && !st.get('isFirst') && (options.push({ label: `选择第${st.get('index') + 1}个`, value: 'index' })); st.getIn(['config', 'index']) && values.push('index');
				st.get('innerText') && (options.push({ label: `选择内容为:"${st.get('innerText')}"`, value: 'innerText' })); st.getIn(['config', 'innerText']) && values.push('innerText');
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
			if (st.get('className').length) {
				let options = st.get('className').map((name, i) => ({ label: name, value: i }))
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
			if (st.get('attributes').length) {
				let options = st.get('attributes').map((attr, i) => ({ label: `${attr.name}="${decodeURI(attr.value)}"`, value: i }))
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
		// const qNodeList = Smart.analysePath(e.target)
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
