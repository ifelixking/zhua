export function findSimilarity(element) {
	let qNodes = analysePath(element)
	let qString = toQueryString(qNodes)
	return $(qString).toArray()
}

class QNode {
	constructor(element) {
		this.element = element
		this.config = {
			tagName: true,
			innerText: false,
			className: [],
			index: false,
			isFirst: false,
			isLast: false,
			attributes: []
		}
	}
	get tagName() { return this.element.tagName }
	get innerText() { return this.element.innerText }
	get className() { return this.element.className.split(' ').filter(a => a) }
	get index() { return this.element.parentElement && Array.from(this.element.parentElement.children).indexOf(this.element) }
	get isFirst() { return this.index === 0 }
	get isLast() { return this.element.parentElement && (this.index == this.element.parentElement.children.length - 1) }
	get attributes() { return this.element.attributes && Array.from(this.element.attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })) }
	get jQString() { return this.tagName }
}

export function analysePath(element) {
	let qNodes = []
	for (let itor = element; itor; itor = itor.parentElement) { qNodes.push(new QNode(itor)); }
	qNodes.reverse()
	return qNodes
}

export function toQueryString(qNodes) {
	return qNodes.map(n => n.jQString).join(' ')
}