import React from 'react'
import * as utils from '../../../utils'

export default class Icon extends React.Component{
	constructor(props){
		super(props)
	}

	render(){
		return <i title={this.props.title} style={Object.assign({}, { fontSize: '16px' }, this.props.style)} className={this.props.className + ' ' + utils.icon(this.props.name)} onClick={this.props.onClick} />
	}
}