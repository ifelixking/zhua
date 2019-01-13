import * as Service from '../../service'
import co from 'co'

export function fetchProjects() {
	return (dispatch) => {
		co(function* () {
			let projects = yield Service.getProjects()
			dispatch({ type: 'LOAD_PROJECT_LIST', projects })
		})
	}
}

export function fetchLoginInfo() {
	return (dispatch) => {
		co(function* () {
			let result = yield Service.getLoginInfo()
			dispatch({ type: 'SET_LOGININFO', loginInfo: result.data })
		})
	}
}

export function fetchProject(id) {
	return (dispatch) => {
		co(function* () {
			let result = yield Service.getProject(id)
			dispatch({ type: 'SET_PROJECT', project: result.data })
		})
	}
}

export function loadNative() {
	return (dispatch) => {
		co(function* () {
			let loginInfo = yield Service.nLoad('loginInfo')
			dispatch({ type: 'SET_LOGININFO', loginInfo: loginInfo && JSON.parse(loginInfo) })
			let project = yield Service.nLoad('project')
			dispatch({ type: 'SET_PROJECT', project: project && JSON.parse(project) })
			let modified = yield Service.nLoad('modified')
			dispatch({ type: 'SET_MODIFIED', flag: modified && JSON.parse(modified) })
		})
	}
}