import React from 'react'
import PanelAction from './PanelAction'
import PanelResource from './PanelResource'
import PanelOption from './PanelOption'
import Immutable from 'immutable'
import * as utils from '../../utils'
import PanelGroup from './Common/PanelGroup'

export default class App extends React.Component {
	constructor(props) {
		super(props)
		// this.onMainBtnClick = this.onMainBtnClick.bind(this)
		// this.onMainBtnMove = this.onMainBtnMove.bind(this)
		// this.onPanelChange = this.onPanelChange.bind(this)
		// this.onPanelResize = this.onPanelResize.bind(this)
		this.onActionClick = this.onActionClick.bind(this)
		this.onActionCreate = this.onActionCreate.bind(this)

		this.maxActionID = 1
		this.state = {
			// showMainPanel: false,
			// positionMain: { x: 61.8, y: 100 },
			// panelSize: { width: 300, height: 600 },
			// currentPanel: null,
			currentActionInfo: null,
			actionStore: Immutable.fromJS(
				{
					start: 1,
					actions: [
						{ id: 1, type: 'open-url' },
						// { id: 2, type: 'fetch-table' },
						// {
						// 	id: 2, type: 'open-each-url', next: 4,
						// 	actionStore: {
						// 		start: 3,
						// 		actions: [
						// 			{ id: 3, type: 'fetch-table', next: 5 },
						// 			{ id: 5, type: 'fetch-table', next: 12 },
						// 			{
						// 				id: 12, type: 'open-each-url', next: 3, actionStore: {
						// 					start: 13,
						// 					actions: [
						// 						{ id: 13, type: 'fetch-table', next: 15 },
						// 						{ id: 15, type: 'fetch-table', next: 13 },
						// 					]
						// 				}
						// 			},
						// 		]
						// 	}
						// },
						// { id: 4, type: 'open-url', next: 2 },
					]
				}
			),

		}
	}

	// onMainBtnClick() {
	// 	this.setState({
	// 		showMainPanel: !this.state.showMainPanel
	// 	})
	// }

	// onMainBtnMove(pos) {
	// 	this.setState({
	// 		positionMain: pos
	// 	})
	// }

	// onPanelChange(titie) {
	// 	this.setState({
	// 		currentPanel: titie
	// 	})
	// }

	// onPanelResize(newSize) {
	// 	this.setState({ panelSize: newSize })
	// }

	onActionClick(actionInfo) {
		this.setState({ currentActionInfo: actionInfo })
	}

	onActionCreate(type, param) {
		let currentActionID = this.state.currentActionInfo.action.get('id')
		let { path, action } = utils.actionStoreFindAction(this.state.actionStore, currentActionID)
		let newAction = Immutable.Map({ id: ++this.maxActionID, type, data: param })
		this.setState({
			actionStore: this.state.actionStore.updateIn(path.slice(0, path.length - 1), actions => {
				return actions.push(newAction)
			}).setIn([...path, 'next'], newAction.get('id')),
			currentActionInfo: { type: 'action', action: newAction }
		})
	}

	render() {
		return (
			<PanelGroup>
				<PanelAction actionStore={this.state.actionStore} currentActionInfo={this.state.currentActionInfo} onActionClick={this.onActionClick} onActionCreate={this.onActionCreate} />
				<PanelResource />
				<PanelOption />
			</PanelGroup>
		)

		// let mainPanel = this.state.showMainPanel ? (
		// 	<MainPanel position={this.state.positionMain}
		// 		current={this.state.currentPanel} onChange={this.onPanelChange}
		// 		size={this.state.panelSize} onResize={this.onPanelResize} miniSize={{ width: 300, height: 500 }}>
		// 		<PanelAction actionStore={this.state.actionStore} currentActionInfo={this.state.currentActionInfo} onActionClick={this.onActionClick} onActionCreate={this.onActionCreate} />
		// 		<PanelResource />
		// 		<PanelOption />
		// 	</MainPanel>
		// ) : null

		// return (
		// 	<div>
		// 		{mainPanel}
		// 		<MainButton
		// 			onClick={this.onMainBtnClick} mini={this.state.showMainPanel}
		// 			onMove={this.onMainBtnMove} position={this.state.positionMain} />
		// 	</div>
		// )
	}
}