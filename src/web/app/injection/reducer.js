import { combineReducers } from 'redux'
import Immutable from 'immutable'
import * as utils from '../../utils'

export default combineReducers({
	loginInfo: (loginInfo = null, action) => {
		switch (action.type) {
			case 'SET_LOGININFO': {
				return action.loginInfo
			}
			default: return loginInfo;
		}
	},
	projectStore: (projectStore = Immutable.Map({
		projects: Immutable.List([]),
		lastUpdateTime: 0,
	}), action) => {
		switch (action.type) {
			case 'LOAD_PROJECT_LIST': {
				return projectStore.set('projects', action.projects)
					.set('lastUpdateTime', (new Date()).valueOf())
			}
			default: return projectStore
		}
	},
	actionStore: (actionStore = Immutable.fromJS({
		start: 1,
		actions: [
			{ id: 1, type: 'open-url', next: 2 },
			{
				id: 2, type: 'open-each-url', next: 4,
				actionStore: {
					start: 3,
					actions: [
						{ id: 3, type: 'fetch-table', next: 5 },
						{ id: 5, type: 'fetch-table', next: 12 },
						{
							id: 12, type: 'open-each-url', next: 3, actionStore: {
								start: 13,
								actions: [
									{ id: 13, type: 'fetch-table', next: 15 },
									{ id: 15, type: 'fetch-table', next: 13 },
								]
							}
						},
					]
				}
			},
			{ id: 4, type: 'open-url', next: 2 },
		]
	}), action) => {
		switch (action.type) {
			case 'LOAD_ACTION_STORE': { return action.actionStore; }
			case 'CREATE_NEXT_ACTION': {
				let { path } = utils.actionStoreFindAction(actionStore, action.currentActionID)
				return actionStore
					.updateIn(path.slice(0, path.length - 1), actions => { return actions.push(action.newAction) })
					.setIn([...path, 'next'], action.newAction.get('id'))
			}
			case 'UPDATE_ACTION_STORE_BY_ACTION_DATA': {
				let { path } = utils.actionStoreFindAction(actionStore, action.actionId)
				return actionStore.setIn([...path, 'data'], action.data)
			}
			default: {
				return actionStore
			}
		}
	},
	maxActionID: (maxActionID = 1, action) => {
		switch (action.type) {
			case 'LOAD_ACTION_STORE': {
				const maxId = function (actions) { return actions && actions.size ? actions.map(value => Math.max(value.get('id'), maxId(value.getIn(['actionStore', 'actions'])))).max() : 0 }
				return maxId(actionStore.get('actions'))
			}
			case 'CREATE_NEXT_ACTION': {
				return action.newAction.get('id')
			}
			default: return maxActionID
		}
	},
	currentActionInfo: (currentActionInfo = null, action) => {
		return action.type == 'CHANGE_CURRENT_ACTION_INFO' ? action.currentActionInfo : currentActionInfo
	},

	// ====================
	rawPanel_expandedKeys: (expandedKeys = ['r-0'], action) => {
		return action.type == 'RAWPANEL_ONEXPAND' ? action.expandedKeys : expandedKeys
	},
	panelResource_state: (theState = Immutable.Map({}), action) => {
		switch (action.type) {
			case 'PANELRESOURCE_SWITCH': {
				let newState = theState.set('page', action.page)
				if (action.params !== undefined) { newState = newState.set('pagaParams', params) }
				return newState
			}
			case 'PANELRESOURCE_SEARCH': {
				// let newState = theState.set('searchText', action.searchText)
				// return 
			}
			case 'PANELRESOURCE_SEARCH_TEXT_CHANGE': {
				let newState = theState.set('searchText', action.searchText)
				return newState
			}
			default: return theState
		}
	}
})