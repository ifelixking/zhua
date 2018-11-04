import React from 'react'

export default class PanelOption extends React.Component{
	constructor(props) {
		super(props)
	}
	render(){
		return <h1>Options</h1>
	}	
}
Object.assign(PanelOption, { title: "选项" })
