import Immutable from 'immutable'

export function findSimilarity(element) {
	let qNodes = analysePath(element)
	let qString = toQueryString(qNodes)
	return $(qString).toArray()
}

export class QNode {

	static create(element, output = null) {

		let index, isFirst, isLast
		if (element.parentElement) {
			index = Array.from(ele.parentElement.children).indexOf(element)
			isFirst = index == 0
			isLast = index == ele.parentElement.children.length - 1
		} else {
			index = 0, isFirst = true, isLast = true
		}

		let result = Immutable.Map({
			// element,

			tagName: element.tagName, innerText: element.innerText, index, isFirst, isLast,
			className: element.className.split(' ').filter(a => a),
			attributes: Array.from(element.attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })),

			href: element.href,
			title: element.title,
			src: element.src,

			config: Immutable.Map({
				tagName: true,
				innerText: false,
				className: Immutable.List([]),
				index: false,
				isFirst: false,
				isLast: false,
				attributes: Immutable.List([]),

				output
				// {
				// 	innerText: false,
				// 	href: false,
				// 	src: false,
				// 	title: false
				// }
			}),

		})
		return result;
	}

	// static tagName(n) { return n.get('element').tagName }
	// static innerText(n) { return n.get('element').innerText }
	// static className(n) { return n.get('element').className.split(' ').filter(a => a) }
	// static index(n) { let ele = n.get('element'); return ele.parentElement ? Array.from(ele.parentElement.children).indexOf(ele) : 0 }
	// static isFirst(n) { return QNode.index(n) === 0 }
	// static isLast(n) { let ele = n.get('element'); return !ele.parentElement || (this.index == ele.parentElement.children.length - 1) }
	// static attributes(n) { let ele = n.get('element'); return ele.attributes && Array.from(ele.attributes).filter(a => a.name != 'class' && a.name != 'style').map(a => ({ name: a.name, value: encodeURI(a.value) })) }

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

}

export function analysePath(element) {
	let qNodes = []
	for (let itor = element; itor; itor = itor.parentElement) { qNodes.push(QNode.create(itor, itor == element ? { innerText: true } : null)); }
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

export function queryElements(qTree) {
	const func = function (scopeElement, subBlocks) {
		return subBlocks.toArray().map((block, i) => {
			return {
				block,
				elements: $(scopeElement).find('>' + toQueryString(block.get('data'))).toArray().map((element, j) => {
					return {
						element,
						children: func(element, block.get('children'))
					}
				})
			}
		})
	}
	return {
		block: qTree,
		elements: $(toQueryString(qTree.get('data'))).toArray().map((element, i) => {
			return { element, children: func(element, qTree.get('children')) }
		})
	}
}

export class QTree {

	static createByQNodeList(qNodeList) {
		let result = Immutable.Map({
			data: qNodeList,
			children: Immutable.List([])
		})
		return result
	}

	static getNodeOutput(node) {
		const data = node.get('data'); if (!data || !data.size) { return }
		let output = data.last().getIn(['config', 'output'])
		if (!output && node.get('children').size == 0) { output = { innerText: true } }
		return output
	}

	static updateByTag(qTree, tag, updater) {
		const func = function (block) {
			let idx = block.get('data').indexOf(tag)
			if (idx != -1) {
				return block.updateIn(['data', idx], tag => updater(tag))
			} else {
				const children = block.get('children')
				for (let i = 0; i < children.size; ++i) {
					let newSubBlock = func(children.get(i))
					if (newSubBlock) {
						return block.setIn(['children', i], newSubBlock)
					}
				}
			}
		}
		return func(qTree)
	}

	static resetQTreeElement(qTree, similarElement) {
		let elementHier = utils.getElementHierarchy(similarElement)
		let rawTree = queryElements(qTree)

		const func = function (simHier, block, rawNode) {
			let closestItem, closestNum = 0, closestHier

			// 遍历当前Block查询出的所有的element
			rawNode.elements.forEach(item => {
				// 收集每个 element 的 Hierarchy
				// 注: 这里的 toElement 为 给定的 相似 element Hierarchy 的 第0个 的父, 
				// 目的就是保证 getSameCount 的 二者 起点相同
				let hier = utils.getElementHierarchy(item.element, simHier[0].parentElement)
				// 计算与给定的 simHier 的相同 element 的个数
				let sameCount = utils.getSameCount(hier, simHier);
				// 找出 相同element数 最多的 那个 item(即:element)
				if (sameCount > closestNum) { closestItem = item; closestHier = hier }
			})
			// 如果 closestHier 有值, 就说明找到了相同的element, 哪怕只有一个也算
			if (closestHier) {
				// 将最接近 的 Hierarchy(即:closestHier) 合到 block 的 data 的 element 字段上
				for (let i = 0; i < closestHier.length; ++i) {
					block = block.setIn(['data', i, 'element'], closestHier[i])
				}
			}
			// 如果 closestHier 为空, 则说明 完全没有相同的(不在同一路上, 多半是处理多余的子分支)
			// 这时 将使用默认 方式 填充 element
			else {
				// TODO:
			}

			// 如果 拟合的路径 上的 element 个数 等于 block 上命中的 element 的 Hierarchy 的 长度
			// 即: 拟合的路径 上的 element 个数 等于 block 的 data 的长度
			// 说明: 这个 similarElement 可以继续往 更深入的 children(即:分支) 找相似
			if (closestNum == closestHier.length) {
				const subBlocks = block.get('children')
				// 遍历 处理 block 的 children, 逐个局部更新该block
				for (let i = 0; i < subBlocks.size; ++i) {
					// simHier: 截断 当前 simHier, 取后段
					// block: 给定 要更新 的 subBlock
					// rawNode: 依据 之前找到的 最接近的 item(即:{elements, children}), 取 第 i 个 child 节点
					// 断言: subBlocks.size == closestItem.children.size					
					let subBlock = func(simHier.slice(closestNum), subBlocks.get(i), closestItem.children[i])
					// 将获得的新的 subBlock 局部更新 到 block 中
					block = block.setIn(['children', i], subBlock)
				}
			}
			// 如果 是 小于
			// 说明: 还没有在这个 block 的 data(即:qNodeList) 上比较相同 完 就分叉了
			// 那么: 该 block 的 children 则按默认方式 设置 element
			else if (closestNum < closestHier.length) {

			}
			
			return block
		}
		return func(elementHier, qTree, rawTree)
	}

	static mergeElement(qTree, element, tryResolveConflict = true) {

		qTree = QTree.resetQTreeElement(qTree, element)

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
							let subBranch = qNodeList.slice(i + 1).toArray()
							tryResolveConflict && !QTree.resolveConflict(itorEle, subBranch) && (console.warn('ambiguity'))		// 有分支产生 就需要作消除歧义的处理
							let subBlock = Immutable.Map({ data: Immutable.List(subBranch), children: block.get('children') })

							// 创建 一个新的 节点, 包含目前收集的element(即:branch)
							tryResolveConflict && !QTree.resolveConflict(itorEle, branch) && (console.warn('ambiguity'))		// 新分支 作消除歧义处理
							let newBranchBlock = Immutable.Map({ data: Immutable.List(branch), children: Immutable.List([]) })

							// 根分支处理，sub分支 和 new分支 作为 子分支 挂在 根分支上
							let rootBranch = qNodeList.slice(0, i + 1).toArray()
							// 注: 如果是 qTree 的根分支, 则不需要处理 歧义
							if (tryResolveConflict && block != qTree) {
								let rootBranchParentElement = qNodeList.getIn([0, 'element']).parentElement
								!QTree.resolveConflict(rootBranchParentElement, rootBranch) && (console.warn('ambiguity'));		// 这个 重构出的根分支 同样 要作消除歧义处理
							}
							return block.merge({
								data: Immutable.List(rootBranch),			// 当前节点的 qNodeList 要去掉尾部
								children: Immutable.List([subBlock, newBranchBlock])	// 将原来的 children 替换为 新的 分支
							})
						} else {

							tryResolveConflict && !QTree.resolveConflict(itorEle, branch) && (console.warn('ambiguity'))

							// branch 不为空, 但命中的是 某个 节点 的 qNodeList 的尾部, 则 直接将 branch 加到该 节点的 children 中 即可
							return block.update('children', ch => ch.push(Immutable.Map({ data: Immutable.List(branch), children: Immutable.List([]) })))
						}
					} else {
						// branch 是空的, 说明 element 就在已有的 qNodeList 里, 不用建立 branch, 直接设置这个节点里的元素为 要输出 即可
						return block.setIn(['data', i, 'config', 'output'], { innerText: true })
					}
				}
			}
		}

		for (let itorEle = element; itorEle; branch.unshift(QNode.create(itorEle, itorEle == element ? { innerText: true } : null)), itorEle = itorEle.parentElement) {
			let newQTree = func(qTree, itorEle)
			if (newQTree) { return newQTree }
		}
	}

	static resolveConflict(parentElement, qNodes) {

		for (let j = qNodes.length - 1; j >= 0; --j) {
			let oldNode = qNodes[j]

			// 
			L_TRY_MODIFY:
			for (let i = 0; i < 3; ++i) {

				switch (i) {
					case 0: {
						// 不做任何改变
					} break;
					case 1: {
						// 尝试修改 classname
						let classNames = QNode.className(oldNode)
						let newNode = oldNode.setIn(['config', 'className'], Immutable.List(classNames.map((c, i) => i)))
						qNodes[j] = newNode
					} break;
					case 2: {
						// 尝试使用 索引
						let newNode = oldNode.setIn(['config', 'index'], true)
						qNodes[j] = newNode
					} break;
				}

				let jqString = toQueryString(qNodes)
				let elements = parentElement ? $(parentElement).find('>' + jqString) : $(jqString)

				// 如果筛选后没有结果了 就回滚修改
				if (elements.length == 0) {
					// 断言不能是没修改 就查不到东西
					if (i == 0) { throw 'assert 1' }
					// 回滚, 放弃这次修改
					qNodes[j] = oldNode

					break L_TRY_MODIFY;
				}

				// 没有歧义了
				if (elements.length == 1) { return true; }

				// 仍然后歧义，继续向上修改
			}

		}
	}

}


	// let rootElements = $(toQueryString(qTree.get('data'))).toArray()


	// let jqStr = toQueryString(block.get('data'))
	// let result = {element: scopeElement, jqStr}
	// const childBlocks = block.get('children')
	// result.children = $(scopeElement).children($(jqStr)).toArray().map((childEle,i) => { 			
	// 	return {
	// 		name: `${jsStr} - ${i}`,
	// 		element: childEle,
	// 		children: childBlocks.map((childBlock,j)=>{
	// 			func(childEle, childBlock)
	// 		})
	// 	}
	// })

	// let rawNodes = rootElements.map((scopeElement, i) => {
	// 	let node = { element: scopeElement,  children: [] }

	// 	qTree.get('children').map(block=>{

	// 	})

	// 	return node
	// })

	// return rawNodes





	// let foundPath = []

	// const func = function(node, blockToUpdate, immPath){
	// 	let foundElementWrap = node.elements.find((elementWrap, i)=>{
	// 		let found = false
	// 		elementWrap.children.forEach((subNode, j)=>{
	// 			// func(subNode, 
	// 		})

	// 		find((subNode, j)=>{
	// 			return func(subNode, [...immPath, 'children', j])
	// 		})
	// 		if (found) { return found }

	// 		return elementHr.includes(elementWrap.element)
	// 	})

	// 	if (foundElementWrap){
	// 		return {block: blockToUpdate.updateIn([...immPath, 'data'], qNodeList=>{
	// 			for (let itor = foundElementWrap.element, i=qNodeList.size-1; itor; itor = itor.parentElement,--i) { 
	// 				qNodeList = qNodeList.setIn([i, 'eleMent'], itor)
	// 			}
	// 			return qNodeList
	// 		}), found:true}
	// 	}
	// 	return blockToUpdate
	// }

	// qTree = func(rawTree, qTree, [])


	// return qTree