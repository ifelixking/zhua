import React from 'react'
import * as utils from '../../../utils'

export default class Icon extends React.Component{
	constructor(props){
		super(props)
	}

	render(){
		return <i style={Object.assign({}, { fontSize: '16px' }, this.props.style)} className={utils.icon(this.props.name)} />
	}
}