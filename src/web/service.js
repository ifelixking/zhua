import { puts } from "util";

const API_SERVER = 'http://localhost/api'

// ======================================================================================================
// 用户注册
export function registe({ email, password }) {
	return post('/user', { email, password })
}

// 邮箱是否已注册
export function emailExists(email) {
	return get(`/email/exists?email=${email}`)
}

// 用户登录
export function login({ username, password }) {
	return post('/user/login', { username, password })
}

// 当前登录信息
export function getLoginInfo() {
	return get('/user/loginInfo')
}

// 用户注销
export function logout() {
	return post('/user/logout')
}

// ======================================================================================================
// 项目(最新)列表, 带分页, 关键字搜索
export function getProjects(keyword = null, page = 0) {
	let url = '/projects?1'
	keyword && (url += `keyword=${keyword}`)
	page && (url += `page=${page}`)
	return get(url)
}

// 创建项目
export function createProject({ name, privately, siteTitle, siteURL, data }) {
	return post('/projects', { name, privately, siteTitle, siteURL, data })
}

// 获取单个项目信息
export function getProject(id) {
	return get(`/projects/${id}`)
}

// 修改项目data
export function setProjectData(id, { data }) {
	return puts(`/projects/${id}/data`, { data })
}

// 我的项目列表
export function getMyProjects(){
	return get('/projects/my/');
}


// ======================================================================================================
function* get(url) {
	let res = yield fetch(API_SERVER + url)
	let obj = yield res.json()
	return obj
}

function* post(url, body) {
	let res = yield fetch(API_SERVER + url, { method: 'POST', body: JSON.stringify(body) })
	let obj = yield res.json()
	return obj
}

function* put(url, body) {
	let res = yield fetch(API_SERVER + url, { method: 'put', body: JSON.stringify(body) })
	let obj = yield res.json()
	return obj
}