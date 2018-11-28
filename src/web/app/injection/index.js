import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as utils from '../../utils'
import Styles from './index.css'

(function () {

	
	let style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = `
		#${utils.ROOT_ELEMENT_ID} .ant-checkbox-wrapper{
			line-height:26px
		}
	`; document.head.appendChild(style); 

	const css_root = { position: 'absolute', left: '0px', top: '0px', zIndex: utils.Z_INDEX_ROOT }
	let root = document.createElement('div'); root.className = Styles['global']; root.setAttribute('id', utils.ROOT_ELEMENT_ID); Object.assign(root.style, css_root)
	let modal = document.createElement('div'); root.append(modal)
	let content = document.createElement('div'); root.append(content)
	document.body.append(root)
	ReactDOM.render(<App />, content);
})()