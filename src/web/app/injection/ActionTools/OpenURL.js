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
		let inputURL = url && url.substr(protocol.length)

		this.state = {
			name: this.props.action.getIn(['data', 'name']),
			inputURL, protocol,
			showDialog: true
		}
		this.dlgResult = null

		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onURLChange = this.onURLChange.bind(this)
		this.onProtocolChange = this.onProtocolChange.bind(this)
		this.getProtocol = this.getProtocol.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.onFillLocation = this.onFillLocation.bind(this)
		this.onClosed = this.onClosed.bind(this)
	}

	onCancel(e) {
		e.stopPropagation()
		this.dlgResult = false;
		this.setState({ showDialog: false })
	}

	onOK(e) {
		e.stopPropagation()

		const url = this.state.protocol + this.state.inputURL
		const newAction = this.props.action.setIn(['data', 'url'], url).setIn(['data', 'name'], this.state.name)

		this.dlgResult = newAction;
		this.setState({ showDialog: false })
	}

	onClosed() {
		if (this.dlgResult) {
			this.props.onDialogOK(this.dlgResult)
		} else {
			this.props.onDialogCancel()
		}
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
		if (url && url.startsWith('http://')) { return 'http://' }
		if (url && url.startsWith('https://')) { return 'https://' }
		return ''
	}

	onNameChange(e) {
		this.setState({
			name: e.target.value
		})
	}

	onFillLocation() {
		let location = window.location.toString()
		this.onURLChange({ currentTarget: { value: location } })
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
			<Modal maskClosable={false} title='Open-URL' visible={this.state.showDialog} onCancel={this.onCancel} afterClose={this.onClosed} onOk={this.onOK}>
				<div style={css_field}>名称</div>
				<div style={css_value}><Input value={this.state.name} onChange={this.onNameChange} onPressEnter={this.onOK} /></div>
				<div style={css_field}>打开网页</div>
				<div style={css_value}><Input onDoubleClick={this.onFillLocation} addonBefore={selectBefore} value={this.state.inputURL} onChange={this.onURLChange} onPressEnter={this.onOK} /></div>
			</Modal>
		)
	}
}