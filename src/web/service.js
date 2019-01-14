const { promisify } = require("es6-promisify");
import { QWebChannel } from './app/injection/Common/qwebchannel'

export const HOST = 'https://www.zhua.com'
const API_SERVER = `${HOST}/api`
// const API_SERVER = ''

// ======================================================================================================
// native
export function nSave(key, value){
	return NATIVE('save', [key, value])
}

export function nLoad(key){
	return NATIVE('load', [key])
}

export function NATIVE(func, args){
	const cb = (func, args, callback)=>{
		new QWebChannel(qt.webChannelTransport, function (channel) {
			channel.objects.Zhua[func].apply(channel.objects.Zhua, [...args, (result)=>{callback(null, result)}]);
		});
	}
	return promisify(cb)(func, args)
}

// ======================================================================================================
// 用户注册
export function registe({ email, password }) {
	return POST('/user', { email, password })
}

// 邮箱是否已注册
export function emailExists(email) {
	return GET(`/email/exists?email=${email}`)
}

// 用户登录
export function login({ username, password }) {
	return POST('/user/login', { username, password })
}

// 当前登录信息
export function getLoginInfo() {
	return GET('/user/loginInfo')
}

// 用户注销
export function logout() {
	return POST('/user/logout')
}

// ======================================================================================================
export function getRecentAndPopular() {
	return GET('/projects/rap');
}

// 项目(最新)列表, 带分页, 关键字搜索
export function getProjects(keyword = null, page = 0) {
	let url = '/projects?1'
	keyword && (url += `&keyword=${keyword}`)
	page && (url += `&page=${page}`)
	return GET(url)
}

// 创建项目
export function createProject({ name, privately, siteTitle, siteURL, data }) {
	return POST('/projects', { name, privately, siteTitle, siteURL, data })
}

// 获取单个项目信息
export function getProject(id) {
	return GET(`/projects/${id}`)
}

// 修改项目data, 该项目必须是自己的项目
export function setMyProjectData(id, { data }) {
	return PUT(`/projects/${id}/data`, { data })
}

export function updateMyProject(id, { name, siteURL, siteTitle }) {
	return PUT(`/projects/${id}/info`, { name, siteURL, siteTitle })
}

// 访问次数inc
export function incOpen(id) {
	return PUT(`/projects/${id}/open/inc`)
}

// 我的项目列表
export function getMyProjects(page = 0) {
	return GET(`/projects/my/?page=${page}`);
}

// opened project
export function getOpenedProject() {
	return GET('/projects/open')
}

// openning
export function openning(id) {
	return PUT(`/projects/openning?id=${id}`)
}

// 删除项目
export function deleteProject(id) {
	return DELETE(`/projects/${id}`)
}

// ======================================================================================================
function GET(url) { return fetchJson('GET', url) }
function POST(url, body) { return fetchJson('POST', url, body) }
function PUT(url, body) { return fetchJson('PUT', url, body) }
function DELETE(url, body) { return fetchJson('DELETE', url, body) }
function* fetchJson(method, url, body) {
	let res = yield fetch(API_SERVER + url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) })
	let obj = yield res.json()
	return obj
}