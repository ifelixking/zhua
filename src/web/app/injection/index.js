import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as utils from '../../utils'

(function(){
	const css_global = { color: '#333', fontFamily: 'Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Consolas,Courier New,monospace,NSimSun,SimSun,SimHei', fontSize: '12px', lineHeight: '12px', position: 'absolute', left: '0px', top: '0px', fontWeigth: 'normal', zIndex: utils.Z_INDEX_ROOT }
	let root = document.createElement('div'); Object.assign(root.style, css_global); root.setAttribute('id', utils.ROOT_ELEMENT_ID);
	let content = document.createElement('div'); root.append(content)
	let modal = document.createElement('div'); root.append(modal)
	document.body.append(root)
	ReactDOM.render(<App />, content);
})()