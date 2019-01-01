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
	e.stopPropagation(); e.preventDefault(); e.stopImmediatePropagation(); e.returnValue = false
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

// convert mysql time string to human
export function t()