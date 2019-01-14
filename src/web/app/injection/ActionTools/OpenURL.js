import React from 'react'
import { Modal, Input, Select } from 'antd'
const Option = Select.Option;
import 'antd/lib/Modal/style'
import 'antd/lib/select/style'
import Styles from '../index.css'

export default class OpenURL extends React.Component {
	constructor(props) {
		super(props)

		const url = this.props.action.getIn(['data', 'url'])
		let protocol = this.getProtocol(url)
		let inputURL = url.substr(protocol.length)

		this.state = {
			name: this.props.action.getIn(['data', 'name']),
			inputURL, protocol,
		}

		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onURLChange = this.onURLChange.bind(this)
		this.onProtocolChange = this.onProtocolChange.bind(this)
		this.getProtocol = this.getProtocol.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
	}

	onCancel(e) {
		e.stopPropagation()
		this.props.onDialogCancel()
	}

	onOK(e) {
		const url = this.state.protocol + this.state.inputURL
		const newAction = this.props.action.setIn(['data', 'url'], url).setIn(['data', 'name'], this.state.name)
		this.props.onDialogOK(newAction)
	}

	onURLChange(e) {
		let protocol = this.getProtocol(e.currentTarget.value.toLowerCase())
		let inputURL = e.currentTarget.value
		if (protocol) {
			this.setState({ protocol })
			inputURL = inputURL.substr(protocol.length)
		}
		this.setState({ inputURL })
	}

	onProtocolChange(protocol) {
		this.setState({ protocol })
	}

	getProtocol(url) {
		if (url.startsWith('http://')) { return 'http://' }
		if (url.startsWith('https://')) { return 'https://' }
		return ''
	}

	onNameChange(e) {
		this.setState({
			name: e.target.value
		})
	}
	
	render() {
		let selectBefore = null
		if (this.state.protocol) {
			selectBefore = <Select value={this.state.protocol} style={{ width: 90 }} onChange={this.onProtocolChange}>
				<Option className={Styles['z-index-dialog-popup']} value='http://'>http://</Option>
				<Option className={Styles['z-index-dialog-popup']} value='https://'>https://</Option>
			</Select>
		}

		const css_field = { marginBottom: '4px' }
		const css_value = { marginBottom: '16px' }

		return (
			<Modal title='Open-URL' visible={true} onCancel={this.onCancel} afterClose={this.props.onDialogCancel} onOk={this.onOK}>
				<div style={css_field}>名称</div>
				<div style={css_value}><Input value={this.state.name} onChange={this.onNameChange} onPressEnter={this.onOK} /></div>
				<div style={css_field}>打开网页</div>
				<div style={css_value}><Input addonBefore={selectBefore} value={this.state.inputURL} onChange={this.onURLChange} onPressEnter={this.onOK} /></div>
			</Modal>
		)
	}
}