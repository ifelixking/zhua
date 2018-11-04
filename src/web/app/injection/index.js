import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

(function(){
	let root = document.createElement('div');
	Object.assign(root.style, {
		position: 'absolute',
		left: '0px', top: '0px', width: '100%', height: '100%',		
	})
	document.body.append(root);
	ReactDOM.render(<App />, root);
})()