import React from 'react'
import { connect } from 'react-redux'

export default connect(
	state=>{
		return { loginInfo: state.loginInfo }
	},
	dispath=>{
		return {

		}
	}
)(class PanelOption extends React.Component{
		constructor(props) {
			super(props)
		}
		static title = "选项"
		render(){

			let user = this.props.loginInfo ? this.props.loginInfo.username : '没有登录';

			return <h1>{user}</h1>
		}	
	}
)


