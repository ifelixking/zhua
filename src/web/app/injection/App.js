import React from 'react'
import { connect } from 'react-redux'
import PanelAction from './PanelAction'
import PanelResource from './PanelResource'
import PanelOption from './PanelOption'
import PanelGroup from './Common/PanelGroup'
import * as Actions from './action'

export default connect(
	state => {
		return {

		}
	},
	dispatch => {
		return {
			fetchLoginInfo: () => {
				dispatch(Actions.fetchLoginInfo())
			}
		}
	}
)(class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.fetchLoginInfo()
	}

	render() {
		return (
			<PanelGroup>
				<PanelAction />
				<PanelResource />
				<PanelOption />
			</PanelGroup>
		)
	}
}
)