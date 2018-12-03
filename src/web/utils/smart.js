import Immutable from 'immutable'

export function findSimilarity(element) {
	let qNodes = analysePath(element)
	let qString = toQueryString(qNodes)
	return $(qString).toArray()
}

export class QNode {

	static create(element) {
		let result = Immutable.Map({
			element,
			config: Immutable.Map({
				tagName: true,
				innerText: false,
				className: Immutable.List([]),
				index: false,
				isFirst: false,
				isLast: false,
				attributes: Immutable.List([]),

				output: false,		// 	
			})
		})
		// QNode.defineWrapper(result)
		return result;
	}

	// static defineWrapper(qNode){
	// 	qNode.__defineGetter__("config", function () { return this.get('config') })
	// 	qNode.__defineGetter__("tagName", function () { return this.get('element').tagName })
	// 	qNode.__defineGetter__("innerText", function () { return this.get('element').innerText })
	// 	qNode.__defineGetter__("className", function () { return this.get('element').className.split(' ').filter(a => a) })
	// 	qNode.__defineGetter__("index", function () { return this.get('element').parentElement ? Array.from(this.get('element').parentElement.children).indexOf(this.get('element')) : 0 })
	// 	qNode.__defineGetter__("isFirst", function () { return this.index === 0 })
	// 	qNode.__defineGetter__("isLast", function () { return !this.get('element').parentElement || (this.index == this.get('element').parentElement.children.length - 1) })
	// 	qNode.__defineGetter__("attributes", function () { return this.get('element').attributes && Array.from(this.get('element').attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })) })
	// 	qNode.__defineGetter__("jQString", function () {
	// 		let expr = ''
	// 		this.getIn(['config', 'tagName']) && (expr += this.tagName);
	// 		this.getIn(['config', 'index']) && (expr += ':nth-child(' + (this.index + 1) + ')');
	// 		this.getIn(['config', 'isFirst']) && (expr += ':first-child');
	// 		this.getIn(['config', 'isLast']) && (expr += ':last-child');
	// 		this.getIn(['config', 'innerText']) && (expr += `:contains('${this.innerText.trim()}')`)
	// 		expr += this.getIn(['config', 'className']).map((a) => { return this.className[a] ? ('.' + this.className[a]) : '' }).join('');
	// 		expr += this.getIn(['config', 'attributes']).map((a) => { return `[${this.attributes[a].name}='${decodeURI(this.attributes[a].value)}']` }).join('');
	// 		return expr
	// 	})

	// 	let config = qNode.get('config')
	// 	config.__defineGetter__("tagName", function () { return this.get('tagName') })
	// 	config.__defineGetter__("innerText", function () { return this.get('innerText') })
	// 	config.__defineGetter__("className", function () { return this.get('className') })
	// 	config.__defineGetter__("index", function () { return this.get('index') })
	// 	config.__defineGetter__("isFirst", function () { return this.get('isFirst') })
	// 	config.__defineGetter__("isLast", function () { return this.get('isLast') })
	// 	config.__defineGetter__("attributes", function () { return this.get('attributes') })
	// 	config.__defineGetter__("output", function () { return this.get('output') })
	// }

	static tagName(n) { return n.get('element').tagName }
	static innerText(n) { return n.get('element').innerText }
	static className(n) { return n.get('element').className.split(' ').filter(a => a) }
	static index(n) { let ele = n.get('element'); return ele.parentElement ? Array.from(ele.parentElement.children).indexOf(ele) : 0 }
	static isFirst(n) { return QNode.index(n) === 0 }
	static isLast(n) { let ele = n.get('element'); return !ele.parentElement || (this.index == ele.parentElement.children.length - 1) }
	static attributes(n) { let ele = n.get('element'); return ele.attributes && Array.from(ele.attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })) }
	static jQString(n) {
		let expr = ''
		n.getIn(['config', 'tagName']) && (expr += QNode.tagName(n));
		n.getIn(['config', 'index']) && (expr += ':nth-child(' + (QNode.index(n) + 1) + ')');
		n.getIn(['config', 'isFirst']) && (expr += ':first-child');
		n.getIn(['config', 'isLast']) && (expr += ':last-child');
		n.getIn(['config', 'innerText']) && (expr += `:contains('${QNode.innerText(n).trim()}')`)
		expr += n.getIn(['config', 'className']).map((a) => { return QNode.className(n)[a] ? ('.' + QNode.className(n)[a]) : '' }).join('');
		expr += n.getIn(['config', 'attributes']).map((a) => { return `[${QNode.attributes(n)[a].name}="${decodeURI(QNode.attributes(n)[a].value)}"]` }).join('');
		return expr
	}


	// constructor(element) {
	// 	this.element = element
	// 	this.config = {
	// 		tagName: true,
	// 		innerText: false,
	// 		className: [],
	// 		index: false,
	// 		isFirst: false,
	// 		isLast: false,
	// 		attributes: [],

	// 		output: false,		// 
	// 	}
	// }

	// get tagName() { return this.element.tagName }
	// get innerText() { return this.element.innerText }
	// get className() { return this.element.className.split(' ').filter(a => a) }
	// get index() { return this.element.parentElement ? Array.from(this.element.parentElement.children).indexOf(this.element) : 0 }
	// get isFirst() { return this.index === 0 }
	// get isLast() { return !this.element.parentElement || (this.index == this.element.parentElement.children.length - 1) }
	// get attributes() { return this.element.attributes && Array.from(this.element.attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })) }
	// get jQString() {
	// 	let expr = ''
	// 	this.config.tagName && (expr += this.tagName);
	// 	this.config.index && (expr += ':nth-child(' + (this.index + 1) + ')');
	// 	this.config.isFirst && (expr += ':first-child');
	// 	this.config.isLast && (expr += ':last-child');
	// 	this.config.innerText && (expr += `:contains('${this.innerText.trim()}')`)
	// 	expr += this.config.className.map((a) => { return this.className[a] ? ('.' + this.className[a]) : '' }).join('');
	// 	expr += this.config.attributes.map((a) => { return `[${this.attributes[a].name}='${decodeURI(this.attributes[a].value)}']` }).join('');
	// 	return expr
	// }

}

export function analysePath(element) {
	let qNodes = []
	for (let itor = element; itor; itor = itor.parentElement) { qNodes.push(QNode.create(itor)); }
	qNodes.reverse()
	return Immutable.List(qNodes)
}

export function toQueryString(qNodes) {
	let str = ''
	qNodes.forEach(n => {
		let tmp = QNode.jQString(n)
		str && tmp && (str += '>')
		str += tmp
	})
	return str
	// return qNodes.map(n => n.jQString).join(' ')
}

export function queryElements(qNodes) {
	let elements = $(toQueryString(qNodes)).toArray()
	return elements
}

export class QTree {

	static createByQNodeList(qNodeList) {
		let result = Immutable.Map({
			data: qNodeList,
			children: Immutable.List([])
		})
		return result
	}

	// constructor(qNodeList) {
	// 	this.root = {
	// 		data: qNodeList,
	// 		children: []
	// 	}
	// }

	static mergeElement(qTree, element) {
		let branch = []
		const func = function (block, itorEle) {

			const children = block.get('children')
			for (let i = 0; i < children.size; ++i) {
				let newBlock = func(children.get(i), itorEle)
				if (newBlock) {
					return block.setIn(['children', i], newBlock)
				}
			}

			const qNodeList = block.get('data')
			for (let i = qNodeList.size - 1; i >= 0; --i) {
				let node = qNodeList.get(i)
				if (node.get('element') == itorEle) {
					if (branch.length) {
						if (i < qNodeList.size - 1) {
							// 分割 当前 节点 的 qNodeList 尾部, 到 这个新建的 子节点上, 并将 当前 节点的 children 移交给他
							let subBlock = Immutable.Map({ data: qNodeList.slice(i + 1), children: block.get('children') })

							// 创建 一个新的 节点, 包含目前收集的element(即:branch)
							let newBranchBlock = Immutable.Map({ data: Immutable.List(branch), children: Immutable.List([]) })

							return block.merge({
								data: qNodeList.slice(0, i + 1),			// 当前节点的 qNodeList 要去掉尾部
								children: Immutable.List([subBlock, newBranchBlock])	// 将原来的 children 替换为 新的 分枝
							})
						} else {
							// branch 不为空, 但命中的是 某个 节点 的 qNodeList 的尾部, 则 直接将 branch 加到该 节点的 children 中 即可
							return block.update('children', ch => ch.push(Immutable.Map({ data: Immutable.List(branch), children: Immutable.List([]) })))
						}
					} else {
						// branch 是空的, 说明 element 就在已有的 qNodeList 里, 不用建立 branch, 直接设置这个节点里的元素为 要输出 即可
						return block.setIn(['data', i, 'config', 'output'], true)
					}
				}
			}
		}

		for (let itorEle = element; itorEle; branch.unshift(QNode.create(itorEle)), itorEle = itorEle.parentElement) {
			let newQTree = func(qTree, itorEle)
			if (newQTree) { return newQTree }
		}
	}
}