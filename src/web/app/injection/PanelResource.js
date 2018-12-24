import React from 'react'
import { connect } from 'react-redux';
import * as Actions from './action'

export default connect(
	state => {
		return { projectStore: state.projectStore }
	},
	dispatch => {
		return {
			loadProjects: () => {
				dispatch(Actions.fetchProjects())
			}
		}
	}
)(class PanelResource extends React.Component {
	constructor(props) {
		super(props)
	}
	static title = "资源"

	componentWillMount() {
		// TODO: 判断上次请求时间, 适时请求
		this.props.loadProjects()
	}

	render() {
		return this.props.projectStore.get('projects').map(item => {
			return <div>{item.ownerEmail}</div>
		})
	}
}
)