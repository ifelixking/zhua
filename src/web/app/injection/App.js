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
			fetchLoginInfo: () => {
				dispatch(Actions.fetchLoginInfo())
			},
			fetchOpenedProject: () => {
				dispatch(Actions.fetchOpenedProject())
			}
		}
	}
)(class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.fetchLoginInfo()
		this.props.fetchOpenedProject()
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

	render() {

		const buttons = [
			{ title: <Icon onClick={this.onBtnHomeClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-home' /> },
			{ title: <Icon onClick={this.onBtnForwardClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-forward' /> },
			{ title: <Icon onClick={this.onBtnBackClick} style={{ fontSize: '14px', color: '#fff' }} name='icon-back' /> }
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