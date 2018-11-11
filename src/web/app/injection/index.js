import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as utils from '../../utils'

(function(){
	let root = document.createElement('div'); Object.assign(root.style, {position: 'absolute', left: '0px', top: '0px', zIndex:9999999999}); root.setAttribute('id', utils.ROOT_ELEMENT_ID);
	let content = document.createElement('div'); root.append(content)
	let modal = document.createElement('div'); root.append(modal)
	document.body.append(root)
	ReactDOM.render(<App />, content);
})()