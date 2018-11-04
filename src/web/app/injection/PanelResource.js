import React from 'react'

export default class PanelResource extends React.Component{
	constructor(props) {
		super(props)
	}
	render(){
		return <h1>Resource</h1>
	}	
}
Object.assign(PanelResource, { title: "资源" })