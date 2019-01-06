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