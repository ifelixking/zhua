import * as Smart from '../../smart'
import Immutable from 'immutable'

(function(){
	window.fetchTable = function(jsonFetchTableActionData){
		let fetchTableActionData = Immutable.fromJS(JSON.parse(jsonFetchTableActionData))
		let rawTree = Smart.queryElements(fetchTableActionData)
		let columns = Smart.getColumnsFromRawTree(rawTree)
		let rows = Smart.getRowsFromRawTree(rawTree)
		return JSON.stringify({columns, rows})
	}
})()