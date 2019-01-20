import Icons from './res/iconfont/iconfont.css'

export const ROOT_ELEMENT_ID = '__ZHUA_ROOT__'
export const Z_INDEX_BASE = (2147483647 - 2000)
export const Z_INDEX_ROOT = Z_INDEX_BASE

let g_svgDOM_hidden = null
export function getSVGTextSize(text) {
	const ns = 'http://www.w3.org/2000/svg'
	if (g_svgDOM_hidden == null) {
		g_svgDOM_hidden = document.createElementNS(ns, 'svg');
		Object.assign(g_svgDOM_hidden.style, { visibility: 'hidden', position: 'absolute', left: '0px', top: '0px', width: '1px', height: '1px' })
	}
	document.body.appendChild(g_svgDOM_hidden);

	let txtNode = document.createTextNode(text);
	let tmpSVGText = document.createElementNS(ns, 'text');
	tmpSVGText.appendChild(txtNode)

	g_svgDOM_hidden.appendChild(tmpSVGText)
	let { width, height } = tmpSVGText.getBBox()
	g_svgDOM_hidden.removeChild(tmpSVGText)

	document.body.removeChild(g_svgDOM_hidden);

	return { width, height }
}

let g_text_to_size = []
export function getCachedSVGTextSize(text) {
	let size = g_text_to_size[text]
	if (!size) {
		size = getSVGTextSize(text)
		g_text_to_size[text] = size
	}
	return size;
}

export function actionStoreFindAction(actionStore, actionID) {
	let path = []
	const func = function (store) {
		let actions = store.get('actions'); if (!actions) { return }
		path.push('actions')
		let found = actions.find((a, i) => {
			if (a.get('id') == actionID) { path.push(i); return true }
		})
		if (!found) {
			actions.forEach((a, i) => {
				path.push([i, 'actionStore'])
				found = func(a.get('actionStore'))
				found == null && (path.pop(), path.pop())
				return found == null
			})
		}
		return found
	}
	let action = func(actionStore)
	return { action, path }
}

export function eventFilterRoot(e) {
	if (e.path.find(ele => ele.id == ROOT_ELEMENT_ID)) { return true }
	return stopEvent(e)
}

export function stopEvent(e) {
	e.stopPropagation(); e.preventDefault(); e.stopImmediatePropagation && e.stopImmediatePropagation(); e.returnValue = false
	return false
}

export function getModalRoot() {
	return document.getElementById(ROOT_ELEMENT_ID).children[0]
}

export function icon(name, extStyles = []) {
	return [Icons.iconfont, Icons[name], ...extStyles].join(' ')
}

export function getElementIndex(element, rootIndex = 0) {
	if (element && element.parentElement) { return Array.from(element.parentElement.children).indexOf(element) }
	return !element.parentElement && rootIndex
}

export function getElementRIndex(element) {
	if (element && element.parentElement) { return element.parentElement.children.length - Array.from(element.parentElement.children).indexOf(element) - 1 }
}

export function isAncestors(element, target) {
	for (let itor = element; itor; itor = itor.parentElement) {
		if (itor == target) { return true }
	}
	return false
}

export function toggleIMList(list, value) {
	let idx = list.indexOf(value)
	if (idx == -1) {
		return list.push(value)
	} else {
		return list.splice(idx, 1)
	}
}

export function toggleArray(array, value) {
	let idx = array.indexOf(value)
	if (idx == -1) {
		array.push(value)
	} else {
		array.splice(idx, 1)
	}
}

export function getElementHierarchy(element, toElement = null) {
	let result = []
	for (let itor = element; itor != toElement; itor = itor.parentElement) { result.unshift(itor) }
	return result
}

export function getSameCount(array1, array2) {
	let i, cnt = Math.min(array1.length, array2.length)
	for (i = 0; i < cnt; ++i) {
		if (array1[i] != array2[i]) { break }
	}
	return i
}

// convert mysql timestamp(bigint, UTC 秒数 from 1970) to human
export function t(utc, strFormat = 'yyyy-MM-dd') {
	return new Date(utc * 1000).format(strFormat)
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function (fmt) { //author: meizz   
	let o = {
		"M+": this.getMonth() + 1,                 //月份   
		"d+": this.getDate(),                    //日   
		"h+": this.getHours(),                   //小时   
		"m+": this.getMinutes(),                 //分   
		"s+": this.getSeconds(),                 //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds()             //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

export function createGlobalStyle(strStyle) {
	let style = document.createElement('style')
	style.setAttribute('type', 'text/css')
	style.innerHTML = strStyle
	document.head.appendChild(style)
	return style
}


export function validEmail(text) {
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	return reg.test(text)
}

export function doWhile(funcWhile, funcDo, retryCount = 10, interval = 30) {
	const func = function () {
		if (funcWhile()) {
			funcDo()
		} else if (retryCount--) {
			console.log(`retry:${retryCount}`)
			window.setTimeout(func, interval)
		}
	}
	func()
}

export function doAsync(func, timeout = 1) {
	window.setTimeout(func, timeout)
}

// export function* ping(url) {
// 	try {
// 		let result = yield fetch(url, { method: 'HEAD' })
// 		return result.status == 200
// 	} catch (ex) { return false; }
// }

export function checkURL(URL) {
	var str = URL;
	var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp = new RegExp(Expression);
	return objExp.test(str)
}

export function parseURL(url) {
	let a = document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':', ''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function () {
			let ret = {},
				seg = a.search.replace(/^\?/, '').split('&'),
				len = seg.length, i = 0, s;
			for (; i < len; i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
		hash: a.hash.replace('#', ''),
		path: a.pathname.replace(/^([^\/])/, '/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
		segments: a.pathname.replace(/^\//, '').split('/')
	};
}