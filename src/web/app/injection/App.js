import React from 'react'
import PanelAction from './PanelAction'
import PanelResource from './PanelResource'
import PanelOption from './PanelOption'
import PanelGroup from './Common/PanelGroup'
import * as Service from '../../service'

export default class App extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount(){
		Service.getProjects()
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