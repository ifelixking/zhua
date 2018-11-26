import React from 'react'
import PanelGroup from '../Common/PanelGroup'
import Styles from '../index.css'
import * as utils from '../../../utils'
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import 'antd/lib/Checkbox/style'
import Icon from '../Common/Icon'

export class FetchTable extends React.Component {
	constructor(props) {
		super(props)
		// this.flushData = this.flushData.bind(this)
		this.state = {
			qTree: this.props.action.get('data')
		}
	}

	render() {
		return (
			<PanelGroup right={true} initSize={{ width: 400 }} initShow={true}>
				<TablePanel></TablePanel>
				<RawPanel></RawPanel>
				<CapturePanel qTree={this.state.qTree}></CapturePanel>
				<QueryPanel></QueryPanel>
			</PanelGroup>
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
		const css_node = { padding: '4px 8px' }
		const css_tag = { cursor: 'pointer', display: 'inline-block', backgroundColor: 'green', color: 'white', padding: '4px 8px', borderRadius: '16px', margin: '2px 0px', border: '2px solid green' }
		const css_tag_selected = Object.assign({}, css_tag, { backgroundColor: '#fff', color: 'green' })
		const css_next = { color: 'green' }
		const css_prop_frame = { position: 'absolute', left: '0px', bottom: '0px', maxHeight: '300px', width: '100%', backgroundColor: '#efefef', marginBottom: '16px', padding: '0px 8px', overflow: 'auto' }
		const css_prop_section = { padding: '16px', borderTop: '1px solid gray', position: 'relative' }
		const css_prop_section_title = { position: 'absolute', top: '-8px', padding: '0px 8px', backgroundColor: '#efefef' }

		const func = (node) => {
			let subs = node.children.map(n => func(n))
			let tags = []; node.data.forEach((t, i) => {
				tags.push(<span key={i << 1} onClick={() => this.onTagClick(t)} style={t == st ? css_tag_selected : css_tag}>{t.tagName}</span>);
				(i < node.data.length - 1) && tags.push(<Icon key={(i << 1) + 1} style={css_next} name='icon-next' />)
			})
			return (
				<div style={css_node}>
					<div>{tags}</div>
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
			<div>
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
