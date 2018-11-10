import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as utils from '../../utils'

(function(){
	let root = document.createElement('div'); Object.assign(root.style, {position: 'absolute', left: '0px', top: '0px'})
	root.setAttribute('id', utils.ROOT_ELEMENT_ID)
	document.body.append(root);
	ReactDOM.render(<App />, root);
})()