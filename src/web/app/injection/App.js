import React from 'react'
import PanelAction from './PanelAction'
import PanelResource from './PanelResource'
import PanelOption from './PanelOption'
import PanelGroup from './Common/PanelGroup'

export default class App extends React.Component {
	constructor(props) {
		super(props)
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