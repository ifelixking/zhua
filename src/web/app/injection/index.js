import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as utils from '../../utils'
import Styles from './index.css'
import Reducer from './reducer'
import App from './App'

(function () {
	let style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = `
		#${utils.ROOT_ELEMENT_ID} .ant-checkbox-wrapper{
			line-height:28px
		}
		#${utils.ROOT_ELEMENT_ID} .ant-tree-node-content-wrapper {
			width: calc(100% - 32px);
		}
	`; document.head.appendChild(style);
	const css_root = { position: 'absolute', left: '0px', top: '0px', zIndex: utils.Z_INDEX_ROOT }
	let root = document.createElement('div'); root.className = Styles['global']; root.setAttribute('id', utils.ROOT_ELEMENT_ID); Object.assign(root.style, css_root)
	let modal = document.createElement('div'); root.append(modal)
	let content = document.createElement('div'); root.append(content)
	document.body.append(root)

	let store = createStore(Reducer, applyMiddleware(thunk))
	ReactDOM.render(<Provider store={store}><App /></Provider>, content);
})()