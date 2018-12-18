import React from 'react'
import { Modal, Input, Select } from 'antd'
const Option = Select.Option;
import 'antd/lib/Modal/style'
import 'antd/lib/select/style'
import Styles from '../index.css'

export default class OpenURL extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showDialog: true,
			inputURL: '',
			protocol: '',
		}

		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onURLChange = this.onURLChange.bind(this)
		this.onProtocolChange = this.onProtocolChange.bind(this)
		this.getProtocol = this.getProtocol.bind(this)
	}

	componentWillMount() {
		let protocol = this.getProtocol(window.location.href)
		let inputURL = window.location.href.substr(protocol.length)
		this.setState({ protocol, inputURL })
	}

	onCancel(e) {
		e.stopPropagation()
		this.setState({ showDialog: false })
	}

	onOK() {
		window.location = this.state.protocol + '//' + this.state.inputURL
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

	render() {
		let selectBefore = null
		if (this.state.protocol) {
			selectBefore = <Select value={this.state.protocol} style={{ width: 90 }} onChange={this.onProtocolChange}>
				<Option className={Styles['z-index-dialog-popup']} value='http://'>http://</Option>
				<Option className={Styles['z-index-dialog-popup']} value='https://'>https://</Option>
			</Select>
		}

		return (
			<Modal title='Open-URL' visible={this.state.showDialog} onCancel={this.onCancel} afterClose={this.props.onDialogCancel} onOk={this.onOK}>
				<Input addonBefore={selectBefore} value={this.state.inputURL} onChange={this.onURLChange} onPressEnter={this.onOK} />
			</Modal>
		)
	}
}