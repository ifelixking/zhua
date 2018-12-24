const API_SERVER = 'http://localhost'

export function getProjects(){
	return fetchJson(API_SERVER + '/api/project')
}

function * fetchJson(url){
	let res = yield fetch(url)
	let obj = yield res.json()
	return obj
}