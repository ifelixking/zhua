import React from 'react'
import { Modal, Input } from 'antd'
import 'antd/lib/Modal/style'
import Icon from '../Common/Icon'
import * as Service from '../../../service'
import { co } from 'co'

export default class FetchTableEdit extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			name: this.props.action.getIn(['data', 'name']),
			export: this.props.action.getIn(['data', 'export']),
			showDialog: true
		}

		this.dlgResult = null

		this.onCancel = this.onCancel.bind(this)
		this.onOK = this.onOK.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.onExportChange = this.onExportChange.bind(this)
		this.onSettingExport = this.onSettingExport.bind(this)
		this.onClosed = this.onClosed.bind(this)
	}

	onNameChange(e) {
		this.setState({
			name: e.target.value
		})
	}

	onExportChange(e) {
		this.setState({
			export: e.target.value
		})
	}

	onCancel(e) {
		e.stopPropagation()
		this.dlgResult = false;
		this.setState({ showDialog: false })
	}

	onOK(e) {
		e.stopPropagation()

		const newAction = this.props.action.setIn(['data', 'export'], this.state.export).setIn(['data', 'name'], this.state.name)

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

	onSettingExport() {
		let _this = this
		co(function* () {
			let filename = yield Service.NATIVE('openSaveFileDialog', [_this.state.export])
			filename && _this.setState({ export: filename })
		})
	}

	render() {
		const css_field = { marginBottom: '4px' }
		const css_value = { marginBottom: '16px' }
		return (
			<Modal maskClosable={false} title='Open-URL' visible={this.state.showDialog} onCancel={this.onCancel} afterClose={this.onClosed} onOk={this.onOK}>
				<div style={css_field}>名称</div>
				<div style={css_value}><Input value={this.state.name} onChange={this.onNameChange} onPressEnter={this.onOK} /></div>
				<div style={css_field}>导出到...</div>
				<div style={css_value}><Input addonAfter={<Icon onClick={this.onSettingExport} style={{ cursor: 'pointer' }} title='设置' name="icon-setting" />} value={this.state.export} onChange={this.onExportChange} onPressEnter={this.onOK} /></div>
			</Modal>
		)
	}
}