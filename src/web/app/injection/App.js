import React from 'react'
import { connect } from 'react-redux'
import PanelAction from './PanelAction'
import PanelOption from './PanelOption'
import PanelGroup from './Common/PanelGroup'
import * as Actions from './action'
import Icon from './Common/Icon'
import { HOST } from '../../service'

export default connect(
	state => {
		return {

		}
	},
	dispatch => {
		return {
			loadNative: () => {
				dispatch(Actions.loadNative())
			}
		}
	}
)(class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.loadNative()
	}

	onBtnHomeClick() {
		window.location = HOST
	}
	onBtnForwardClick() {
		window.history.forward()
	}
	onBtnBackClick() {
		window.history.back()
	}
	onBtnFlushClick() {
		window.location.reload()
	}

	render() {

		const buttons = [
			{ title: '主页', text: <Icon onClick={this.onBtnHomeClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-home' /> },
			{ title: '前进', text: <Icon onClick={this.onBtnForwardClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-forward' /> },
			{ title: '后退', text: <Icon onClick={this.onBtnBackClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-back' /> },
			{ title: '刷新', text: <Icon onClick={this.onBtnFlushClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-flush' /> },
		]

		return (
			<PanelGroup buttons={buttons}>
				<PanelAction />
				<PanelOption />
			</PanelGroup>
		)
	}
}
)