import React from 'react'

export default class PanelAction extends React.Component{	
	constructor(props) {
		super(props)
	}
	render(){
		return <h1>Action</h1>
	}	
}
Object.assign(PanelAction, { title: "动作" })